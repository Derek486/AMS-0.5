import os
import json
import pandas as pd
from kafka import KafkaProducer

# Configuración de Kafka
KAFKA_BROKER = os.getenv('KAFKA_BROKER', 'localhost:9092')  # Asegúrate de que la IP y el puerto estén correctos
KAFKA_TOPIC_MODEL = os.getenv('KAFKA_TOPIC_MODEL', 'model-topic')

# Rutas de los archivos CSV
CSV_DESALINEAMIENTO_PATH = './data/Desalineamiento.csv'
CSV_DESGASTE_PATH = './data/Desgaste_rodamiento.csv'
CSV_FALLO_NINGUNO_PATH = './data/Fallo_Ninguno.csv'

def connect_to_kafka(broker):
    """Función para verificar la conexión inicial a Kafka."""
    try:
        producer = KafkaProducer(bootstrap_servers=broker)
        print("Conexión establecida con Kafka en:", broker)
        producer.close()
        return True
    except Exception as e:
        print("Error al conectar con Kafka:", e)
        return False

def get_kafka_producer(broker):
    """Crea y devuelve una instancia de KafkaProducer que permanece abierta."""
    return KafkaProducer(bootstrap_servers=broker)


def send_to_kafka_batch(producer, topic, messages):
    """Función para enviar un lote de mensajes JSON a Kafka usando un productor reutilizable."""
    for message in messages:
        producer.send(topic, json.dumps(message).encode('utf-8'))
    producer.flush()
    print(f"Lote de {len(messages)} mensajes enviado al tópico {topic}")


"""
def send_to_kafka(broker, topic, message):
    #Función para enviar un mensaje JSON a Kafka.
    producer = KafkaProducer(bootstrap_servers=broker)
    producer.send(topic, json.dumps(message).encode('utf-8'))
    producer.flush()
    print(f"Mensaje enviado al tópico {topic}: {message}")
"""

def read_csv(file_path):
    """Lee un archivo CSV en un DataFrame de pandas."""
    try:
        return pd.read_csv(file_path, sep=";")  # Aseguramos el separador correcto
    except Exception as e:
        print(f"Error al leer el archivo CSV {file_path}: {e}")
        return None

def get_csv_file(data_type):
    """Selecciona el archivo CSV basado en el tipo de dato recibido."""
    file_path = None
    if data_type == 'Desalineamiento':
        file_path = CSV_DESALINEAMIENTO_PATH
    elif data_type == 'Desgaste_rodamiento':
        file_path = CSV_DESGASTE_PATH
    elif data_type == 'Fallo_Ninguno':
        file_path = CSV_FALLO_NINGUNO_PATH
    df = read_csv(file_path)
    return df

def process_and_print_data_in_batches(data_type, batch_size=200):
    """Procesa los datos y los envía a Kafka en lotes, manteniendo abierta la conexión."""
    # Crear el productor al inicio del proceso
    producer = get_kafka_producer(KAFKA_BROKER)
    if not producer:
        print("No se pudo establecer la conexión con Kafka.")
        return
    
    print("Conexión exitosa. Procediendo a procesar y enviar los datos por lotes.")

    # Cargar el CSV basado en el tipo de dato
    df = get_csv_file(data_type)
    if df is not None:
        print(f"Datos para {data_type}:")
        print(df.head())  # Imprimir las primeras filas para verificar la estructura

        # Crear los mensajes y enviarlos en lotes
        messages = []
        for index, row in df.iterrows():
            message = {
                'Timestamp': row['Timestamp'],
                'Value': row['Value'],
                'Medicion': row['Medicion'],
                'Axis': row['Axis'],
                'data_type': data_type
            }
            messages.append(message)
            
            # Enviar el lote cuando alcanza el tamaño especificado
            if len(messages) == batch_size:
                send_to_kafka_batch(producer, KAFKA_TOPIC_MODEL, messages)
                messages = []  # Reiniciar el lote

        # Enviar los mensajes restantes si quedaron menos de 200
        if messages:
            send_to_kafka_batch(producer, KAFKA_TOPIC_MODEL, messages)
            
    else:
        print(f"No se pudo cargar el archivo para {data_type}")
    
    # Cerrar el productor al finalizar todo el proceso
    producer.close()
    print("Conexión cerrada después de enviar todos los datos.")


