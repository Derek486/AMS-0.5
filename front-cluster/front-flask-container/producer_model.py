import os
import json
import pandas as pd
from kafka import KafkaProducer
import logging

# Configuración de logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuración de Kafka
KAFKA_BROKER = os.getenv('KAFKA_BROKER', 'localhost:9092')
KAFKA_TOPIC_MODEL = os.getenv('KAFKA_TOPIC_MODEL', 'model-topic')

# Rutas de los archivos CSV
CSV_DESALINEAMIENTO_PATH = './data/Desalineamiento.csv'
CSV_DESGASTE_PATH = './data/Desgaste_rodamiento.csv'
CSV_FALLO_NINGUNO_PATH = './data/Fallo_Ninguno.csv'

def connect_to_kafka(broker, topic):
    """Función para verificar y registrar la conexión a Kafka."""
    try:
        producer = KafkaProducer(bootstrap_servers=broker)
        logger.info(f"Conexión exitosa a Kafka en el broker {broker}, tópico {topic}.")
        producer.close()
    except Exception as e:
        logger.error(f"Error al conectar con Kafka: {e}")

def get_kafka_producer(broker):
    """Crea y devuelve una instancia de KafkaProducer que permanece abierta."""
    return KafkaProducer(
        bootstrap_servers=broker,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )

def send_to_kafka_batch(producer, topic, messages):
    """Función para enviar un lote de mensajes JSON a Kafka usando un productor reutilizable."""
    for message in messages:
        producer.send(topic, message)
    producer.flush()
    logger.info(f"Lote de {len(messages)} mensajes enviado al tópico {topic}")

def read_csv(file_path):
    """Lee un archivo CSV y devuelve un DataFrame de pandas."""
    try:
        return pd.read_csv(file_path, sep=";")
    except Exception as e:
        logger.error(f"Error al leer el archivo CSV {file_path}: {e}")
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

def process_data_type(motor, data_type, batch_size=200):
    """Procesa el tipo de dato recibido, muestra el head en los logs y envía los datos en lotes a Kafka."""
    df = get_csv_file(data_type)
    if df is not None:
        logger.info(f"Head de datos para {data_type}:\n{df.head()}")
        
        # Crear el productor y enviar los datos en lotes
        producer = get_kafka_producer(KAFKA_BROKER)
        messages = []

        for index, row in df.iterrows():
            message = {
                'Timestamp': row['Timestamp'],
                'Value': row['Value'],
                'Medicion': row['Medicion'],
                'Axis': row['Axis'],
                'MotorId': motor['id'],
                'MotorName': motor['nombre'],
            }
            messages.append(message)

            # Enviar el lote cuando alcanza el tamaño especificado
            if len(messages) == batch_size:
                send_to_kafka_batch(producer, KAFKA_TOPIC_MODEL, messages)
                messages = []  # Reiniciar el lote

        # Enviar los mensajes restantes si quedaron menos de batch_size
        if messages:
            send_to_kafka_batch(producer, KAFKA_TOPIC_MODEL, messages)
        
        producer.close()
        logger.info("Conexión cerrada después de enviar todos los datos.")
    else:
        logger.error(f"No se pudo procesar los datos para {data_type}.")

