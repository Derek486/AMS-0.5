from kafka import KafkaConsumer
from model import get_aceleration_data, get_temperature_data, get_velocity_data
from .websockets import send_updates
import json
import os 
import threading
import asyncio

KAFKA_HOST = os.getenv('KAFKA_HOST')
KAFKA_TOPIC = os.getenv('KAFKA_TOPIC')
vibration_data_list = []

count_velocity = 0
count_acceleration = 0
count_temperature = 0

def consume_vibration_data():
    global vibration_data_list
    global count_velocity
    global count_acceleration
    global count_temperature
    try:
        # Crear consumidor de kafka
        vibration_consumer = KafkaConsumer(
            KAFKA_TOPIC,
            bootstrap_servers=KAFKA_HOST,
            auto_offset_reset='latest',
            enable_auto_commit=True,
            group_id='vibraciones-group',
            value_deserializer=lambda x: x.decode('utf-8')
        )
        print("Conectado al broker de Kafka")   

        for mesage in vibration_consumer:
            vibration_data = json.loads(mesage.value)
            print(f"Datos recibidos: {vibration_data}")
        
            ## Verificacion de los campos esperados
            if all(key in vibration_data for key in ['MotorId','Value','Axis','Medicion']):
                # Guardamos los datos en la lista
                data_array = [
                    vibration_data['MotorId'],
                    vibration_data['Value'],
                    vibration_data['Axis'],
                    vibration_data['Medicion']
                ]

                if vibration_data['Medicion'] == 'acceleration':
                    count_acceleration += 1
                if vibration_data['Medicion'] == 'velocity':
                    count_velocity += 1
                if vibration_data['Medicion'] == 'temperature':
                    count_temperature += 1
                
                result = None
                if count_acceleration > 0 and count_acceleration % 10 == 0:
                    result = get_aceleration_data(vibration_data['MotorId'], vibration_data_list)
                    if result is not None:
                        asyncio.run(send_updates(result))
                if count_temperature > 0 and count_temperature % 10 == 0:
                    result = get_temperature_data(vibration_data['MotorId'], vibration_data_list)
                    if result is not None:
                        asyncio.run(send_updates(result))
                if count_velocity > 0 and count_velocity % 10 == 0:
                    result = get_velocity_data(vibration_data['MotorId'], vibration_data_list)
                    if result is not None:
                        asyncio.run(send_updates(result))
                
                vibration_data_list.append(data_array)
                print(f"Datos procesados y almacenados: {data_array}")

    except Exception as e:
        print(f"Error al conectarse o consumir datos de Kafka: {e}")

def start_consumer():
    thread = threading.Thread(target=consume_vibration_data)
    thread.daemon = True  # Permite que el hilo se cierre al cerrar la aplicación
    thread.start()