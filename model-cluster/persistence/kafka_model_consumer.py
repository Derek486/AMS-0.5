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

# Cargar variables de entorno
KAFKA_HOST = os.getenv('KAFKA_HOST')
KAFKA_TOPIC_MODEL = os.getenv('KAFKA_TOPIC_MODEL')

## Llamado del modelo
svm_binario_model = joblib.load("svm_binario_model.pkl")
svm_fallo_model = joblib.load("svm_fallo_model.pkl")

# Variables para almacenar datos
vibration_data_model_list = []

def consume_model_data():
    try:
        # Crear un consumidor de kafka para el nuevo topico
        model_consumer = KafkaConsumer(
        KAFKA_TOPIC_MODEL,
        bootstrap_servers=KAFKA_HOST,    
        auto_offset_reset='latest',
        enable_auto_commit=True,
        group_id='vibraciones-group',
        value_deserializer=lambda x: x.decode('utf-8')
        )

        print("Conectado al broker de kafka al topico model-topic")

        for message in model_consumer:
            model_data = json.loads(message.value)
            print(f"Datos recibidos en el model-topic : {model_data}")

            # Verificacion de los campos esperados
            if all (key in model_data for key in ['TimeStamp','Value','Medicion','Axis']):
                data_array = [
                    model_data['Timestamp'],
                    model_data['Value'],
                    model_data['Medicion'],
                    model_data['Axis']
                ]

            vibration_data_model_list.append(data_array)

            if len(vibration_data_model_list) >= 800:
                # Convertir la lista en un dataframe
                df = pd.DataFrame(vibration_data_model_list, columns=['Timestamp','Value','Medicion','Axis'])

                ## Generar caracteristicas y procesar
                df = generar_caracteristicas(df)
                if df is None:
                    print("Error en las caracteristicas, se omite este lote")
                    vibration_data_model_list.clear()
                    continue

                df = procesar_datos(df)
                if df is None:
                    print("Error en el preprocesamiento de datos, se omite este lote")
                    vibration_data_model_list.clear()
                    continue

                ## Preparar la caracteristicas del modelo
                X_binario = df[['Value','Rms','Axis','Estado']]
                y_pred_bin = svm_binario_model.predict(X_binario)

                # Contador para el tipo de fallos
                tipo_fallo_counter = {"Desalineacion del eje": 0,"Desgaste del rodamiento": 0}
                fallo_detectado = False

                # Procesar los registros donde se detecta un fallo 
                for i, fallo_pred in enumerate(y_pred_bin):
                    if fallo_pred == 1:
                        fallo_pred = True
                        features_fallo = X_binario.iloc[i].values.reshape(1,-1)
                        tipo_fallo_pred = svm_fallo_model.predict(features_fallo)[0]

                        #Mapeo del tipo de fallo a nombres
                        if tipo_fallo_pred == 0:
                            tipo_fallo_counter['Desalineacion del eje'] += 1
                        elif tipo_fallo_pred == 1:
                            tipo_fallo_counter['Desgaste del rodamiento'] += 1

                if fallo_detectado:
                    tipo_fallo_predominante = max(tipo_fallo_counter,key=tipo_fallo_counter.get)
                    result = {"prediction" : "Fallo detectado","Tipo_fallo":tipo_fallo_predominante}
                else:
                    result = {"prediction":"Ningun fallo detectado"}

                # Enviar los resultados por webscockets
                asyncio.run(send_updates(result))

                # Limpiar la lista depues de procesar
                vibration_data_model_list.clear()
                print("Datos procesados y enviados por Websockets")

    except Exception as e:
        print(f"Error al conectarse o consumir datos de Kafka: {e}")

def start_model_consumer():
    # Inicia el consumidor en un hilo separado
    thread = threading.Thread(target=consume_model_data)
    thread.daemon = True  # Permite que el hilo se cierre al cerrar la aplicación
    thread.start()

        