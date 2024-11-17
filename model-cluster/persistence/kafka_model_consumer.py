from kafka import KafkaConsumer
from .websockets import send_updates
import json
import os
import threading
import asyncio
import pandas as pd
from data_generator.feature_generator import generar_caracteristicas
from data_generator.preprocess import procesar_datos
import joblib
import time
import queue

# Cargar variables de entorno
KAFKA_HOST = os.getenv('KAFKA_HOST')
KAFKA_TOPIC_MODEL = os.getenv('KAFKA_TOPIC_MODEL')

# Definir la ruta completa a los archivos de modelo
base_path = os.path.dirname(os.path.abspath(__file__))
svm_binario_model_path = os.path.join(base_path, "svm_binario_model.pkl")
svm_fallo_model_path = os.path.join(base_path, "svm_fallo_model.pkl")
# Ruta directa a data_generator/model_metadata.pkl
metadata_path = os.path.join("/app", "data_generator", "model_metadata.pkl")

# Variables para almacenar datos
vibration_data_model_list = []
timer_started = False
results_queue = queue.Queue()

def asyncio_thread():
    """
    Hilo dedicado para manejar asyncio y enviar resultados por WebSocket.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    async def process_results():
        while True:
            try:
                result = results_queue.get(timeout=1)
                print(f"Enviando resultados por WebSocket: {result}")
                await send_updates(result)
                print("Resultados enviados exitosamente.")
            except queue.Empty:
                await asyncio.sleep(0.1)  # Evitar un bucle ocupado
            except Exception as e:
                print(f"Error al procesar resultados asíncronos: {e}")

    loop.run_until_complete(process_results())

def check_and_process_batch():
    global vibration_data_model_list
    print("Entrando a check_and_process_batch...")

    # Verificar si tenemos datos acumulados
    if vibration_data_model_list:
        print(f"Procesando lote de {len(vibration_data_model_list)} registros...")
        
        # Convertir la lista en un DataFrame
        df = pd.DataFrame(vibration_data_model_list, columns=['Timestamp', 'Value', 'Medicion', 'Axis'])
        print(f"DataFrame creado con {len(df)} filas.")

        # Cargar los metadatos
        try:
            metadata = joblib.load(metadata_path)
            print("Metadatos cargados correctamente.")
        except Exception as e:
            print(f"Error al cargar los metadatos: {e}")
            vibration_data_model_list.clear()
            return

        ## Generar características y procesar
        df = generar_caracteristicas(df)
        df = procesar_datos(df)  # procesar_datos ya utiliza los metadatos internamente
        
        # Validar y ajustar las columnas antes de alimentar al modelo
        column_order_binario = metadata['column_order_binario']
        df = df[column_order_binario]
 
        # **Verificar si los modelos se cargan correctamente**

        # **Realizar predicciones**
        try:
            print("Cargando modelos SVM...")
            svm_binario_model = joblib.load(svm_binario_model_path)
            print("Modelo binario cargado correctamente.")
            svm_fallo_model = joblib.load(svm_fallo_model_path)
            print("Modelo de fallo cargado correctamente.")
            print(f"Preparando datos para el modelo binario: {df.head()}")

            # Asegurarse de que las columnas estén en el orden correcto
            X_binario = df[metadata['column_order_binario']]
            print(f"Columnas en X_binario antes de la predicción: {list(X_binario.columns)}")
            
            # Renombrar columnas si es necesario (opcional)
            X_binario.columns = metadata['column_order_binario']

            # Realizar la predicción
            y_pred_bin = svm_binario_model.predict(X_binario)

            # Contador para el tipo de fallos
            tipo_fallo_counter = {"Desalineacion del eje": 0, "Desgaste del rodamiento": 0}
            fallo_detectado = False

            # Procesar los registros donde se detecta un fallo
            for i, fallo_pred in enumerate(y_pred_bin):
                if fallo_pred == 1:
                    fallo_detectado = True
                    features_fallo = X_binario.iloc[i].to_frame().T
                    tipo_fallo_pred = svm_fallo_model.predict(features_fallo)[0]

                    # Mapear el tipo de fallo a nombres
                    if tipo_fallo_pred == 0:
                        tipo_fallo_counter['Desalineacion del eje'] += 1
                    elif tipo_fallo_pred == 1:
                        tipo_fallo_counter['Desgaste del rodamiento'] += 1

            if fallo_detectado:
                tipo_fallo_predominante = max(tipo_fallo_counter, key=tipo_fallo_counter.get)
                result = {"prediction": "Fallo detectado", "Tipo_fallo": tipo_fallo_predominante}
            else:
                result = {"prediction": "Ningún fallo detectado"}

            results_queue.put(result)  # Enviar a la cola para el hilo asyncio
            print(f"Resultado colocado en la cola: {result}")

        except Exception as e:
            print(f"Error durante la predicción: {e}")
        finally:
            # Limpiar la lista después de procesar
            vibration_data_model_list.clear()
            print("Lote procesado y lista limpiada.")

def consume_model_data():
    global timer_started, vibration_data_model_list
    try:
        model_consumer = KafkaConsumer(
            KAFKA_TOPIC_MODEL,
            bootstrap_servers=KAFKA_HOST,
            auto_offset_reset='latest',
            enable_auto_commit=True,
            group_id='vibraciones-group',
            value_deserializer=lambda x: x.decode('utf-8')
            
        )

        print("Conectado al broker de Kafka al tópico model-topic")
        last_received_time = time.time()

        for message in model_consumer:
            model_data = json.loads(message.value)
            print(f"Datos recibidos en el model-topic: {model_data}")

            # Eliminar el campo data_type si existe
            model_data.pop('data_type', None)
            print(f"Campos después de eliminar data_type: {list(model_data.keys())}")

            # Verificación y acumulación
            if all(key in model_data for key in ['Timestamp', 'Value', 'Medicion', 'Axis']):
                data_array = [
                    model_data['Timestamp'],
                    model_data['Value'],
                    model_data['Medicion'],
                    model_data['Axis']
                ]
                vibration_data_model_list.append(data_array)
                print(f"Datos acumulados: {len(vibration_data_model_list)}")

            # Actualizar el tiempo de recepción
            last_received_time = time.time()

            # Activar temporizador para esperar a más datos
            if not timer_started:
                timer_started = True
                threading.Thread(target=wait_for_completion, args=(last_received_time,)).start()
                print(f"Hilos activos después de iniciar el temporizador: {threading.active_count()}")

    except Exception as e:
        print(f"Error al conectarse o consumir datos de Kafka: {e}")

last_batch_time = time.time()

def process_queue():
    while True:
        try:
            result = results_queue.get(timeout=1)
            print(f"Enviando resultados desde la cola: {result}")
            asyncio.run(send_updates(result))
            print("Resultados enviados exitosamente.")
        except queue.Empty:
            continue  # Esperar nuevos elementos en la cola
        except Exception as e:
            print(f"Error al procesar la cola: {e}")

def wait_for_completion(last_received_time):
    global timer_started
    print(f"Hilos activos al iniciar wait_for_completion: {threading.active_count()}")
    while timer_started:
        current_time = time.time()
        if current_time - last_received_time > 3:  # Espera de 3 segundos
            print("Procesando datos acumulados...")
            check_and_process_batch()
            timer_started = False
            print(f"Hilos activos después de procesar el lote: {threading.active_count()}")
            break

def log_thread_state():
    while True:
        print(f"Hilos activos: {threading.active_count()}")
        time.sleep(10)

def start_model_consumer():
    # Hilo para consumir datos de Kafka
    threading.Thread(target=consume_model_data, daemon=True).start()
    # Hilo para procesar resultados en la cola
    threading.Thread(target=asyncio_thread, daemon=True).start()
    # Hilo para monitorear estado de los hilos
    threading.Thread(target=log_thread_state, daemon=True).start()
