import os
import threading
import time
from flask import Flask, jsonify, render_template
import pandas as pd
from producer import send_to_kafka
from dotenv import load_dotenv
import requests

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# Variables de entorno
EXCEL_ACCELERATION_PATH = './data/aceleracion_total.xlsx'
EXCEL_TEMPERATURE_PATH = './data/temperatura_total.xlsx'
EXCEL_VELOCITY_PATH = './data/velocidad_total.xlsx'
KAFKA_BROKER = os.getenv('KAFKA_BROKER')
KAFKA_TOPIC = os.getenv('KAFKA_TOPIC')
MOTORES_API_URL = os.getenv('MOTORES_API_URL')

def read_excel(file_path):
    return pd.read_excel(file_path)

# Diccionario para controlar el envío de datos
sending_data = {
    'acceleration': False,
    'temperature': False,
    'velocity': False
}

# Función para iniciar el envío de datos a Kafka
def start_sending(type, motor_id):
    file_path = None
    if type == 'acceleration':
        file_path = EXCEL_ACCELERATION_PATH
    elif type == 'temperature':
        file_path = EXCEL_TEMPERATURE_PATH
    elif type == 'velocity':
        file_path = EXCEL_VELOCITY_PATH

    if file_path:
        df = read_excel(file_path)

        # Enviar datos cada segundo
        while sending_data[type]:
            for index, row in df.iterrows():
                if sending_data[type]:
                    # Convertir la fila a un dict para enviarlo
                    message = {
                        'Timestamp': row['timestamp'],
                        'Value': row['value'],
                        'Medicion': row['measurement_type'],
                        'Axis': row['axis'],
                        'MotorId': motor_id
                    }
                    print(message)
                    send_to_kafka(KAFKA_BROKER, KAFKA_TOPIC, message)
                    time.sleep(1)
                else:
                    break

# Ruta para iniciar el envío
@app.route('/start_sending/<measurement_type>/<motor_id>')
def start_measurement(measurement_type, motor_id):
    sending_data[measurement_type] = True
    thread = threading.Thread(target=start_sending, args=(measurement_type, motor_id))
    thread.start()
    return 'Sending started', 200

# Ruta para detener el envío
@app.route('/stop_sending/<measurement_type>')
def stop_measurement(measurement_type):
    sending_data[measurement_type] = False
    return 'Sending stopped', 200

# Ruta para obtener los motores desde el endpoint
@app.route('/get_motors')
def get_motors():
    response = requests.get(MOTORES_API_URL)
    if response.status_code == 200:
        return jsonify(response.json())
    return 'Error al obtener motores', 500

@app.route('/')
def index():
    return render_template('index.html')

# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
