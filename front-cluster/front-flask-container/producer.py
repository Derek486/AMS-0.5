import os
import time
import json
import pandas as pd
from kafka import KafkaProducer

KAFKA_BROKER = os.getenv('KAFKA_BROKER')
KAFKA_TOPIC = os.getenv('KAFKA_TOPIC')
EXCEL_ACCELERATION_PATH = './data/aceleracion_total.xlsx'
EXCEL_TEMPERATURE_PATH = './data/temperatura_total.xlsx'
EXCEL_VELOCITY_PATH = './data/velocidad_total.xlsx'


def send_to_kafka(broker, topic, message):
  producer = KafkaProducer(bootstrap_servers=broker)
  producer.send(topic, json.dumps(message).encode('utf-8'))
  producer.flush()

def read_excel(file_path):
    return pd.read_excel(file_path)

def get_excel_file(type):
    file_path = None
    if type == 'acceleration':
        file_path = EXCEL_ACCELERATION_PATH
    elif type == 'temperature':
        file_path = EXCEL_TEMPERATURE_PATH
    elif type == 'velocity':
        file_path = EXCEL_VELOCITY_PATH
    df = read_excel(file_path)
    return df

sending_data = {}

def clear_sending_data(motorId):
    motor = sending_data[motorId]
    acc = motor['acceleration']
    vel = motor['velocity']
    tem = motor['temperature']
    if not (acc or vel or tem):
        del sending_data[motorId]

def comprobate_sending(motorId, type):
    return motorId in sending_data.keys() and sending_data[motorId][type]

def toggle_sending(msg):
    value = json.loads(msg)
    if value['motorId'] not in sending_data.keys():
        sending_data[value['motorId']] = {
            'acceleration': False,
            'velocity': False,
            'temperature': False
        }
    if value['isSending']:
        df = get_excel_file(value['type'])
        sending_data[value['motorId']][value['type']] = True
        while comprobate_sending(value['motorId'], value['type']):
            for _, row in df.iterrows():
                if comprobate_sending(value['motorId'], value['type']):
                    message = {
                        'Timestamp': row['timestamp'],
                        'Value': row['value'],
                        'Medicion': row['measurement_type'],
                        'Axis': row['axis'],
                        'MotorId': int(value['motorId'])
                    }
                    print(message)
                    send_to_kafka(KAFKA_BROKER, KAFKA_TOPIC, message)
                    time.sleep(1)
                else:
                    break
    else:
        if value['motorId'] in sending_data.keys():
            sending_data[value['motorId']][value['type']] = False
            clear_sending_data(value['motorId'])