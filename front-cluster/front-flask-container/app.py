import os
import threading
import jwt
import requests
from dotenv import load_dotenv
load_dotenv()
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, render_template, redirect, jsonify, request
from flask_socketio import SocketIO
from producer import toggle_sending, sending_data
from producer_model import process_data_type

# Configuración del registro de logs
log_file = 'app.log'
log_handler = RotatingFileHandler(log_file, maxBytes=100000, backupCount=3)
log_handler.setLevel(logging.INFO)
log_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
log_handler.setFormatter(log_formatter)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(log_handler)

app = Flask(__name__)
app.logger.addHandler(log_handler)  # Añadir el manejador de logs a la aplicación Flask
socketio = SocketIO(app, manage_session=False, cors_allowed_origins="*")
app.logger.info("Aplicación Flask iniciada correctamente")

MOTORES_API_URL = os.getenv('MOTORES_API_URL')

"""
@socketio.on('send_data')
def handle_send_data(msg):
    thread = threading.Thread(target=toggle_sending, args=(msg,))
    thread.start()
    socketio.emit('toggle_data', msg)
"""

@app.route('/testing/<token>', methods=["GET"])
def index(token):
    # Desactivar temporalmente la verificación del token y la llamada a la API
    try:
        # if token is None:
        #     return redirect("/", code=302)
        # decoded = jwt.decode(token, options={"verify_signature": False})
        # userId = decoded['sub']
        # url = f'{MOTORES_API_URL}/api/motores/{userId}'
        # headers = {
        #     "Authorization": f"Bearer {token}",
        #     "Content-Type": "application/json"
        # }
        # response = requests.get(url, headers=headers)
        # if response.status_code == 200:
        #     motors = response.json()
        #     return render_template('index.html', motors=motors, metrics=sending_data)

        # Proporcionar un acceso directo sin autenticación a `index.html`
        motors = [{"id": 1, "nombre": "Motor de Prueba", "tipo": "Tipo A"}]  # Ejemplo de datos de motor
        return render_template('index.html', motors=motors, metrics=sending_data)
    except Exception as e:
        return redirect("/", code=302)

@app.route('/send_prediction_data', methods=["POST"])
def handle_prediction_data():
    logger.info("La función handle_prediction_data ha sido llamada.")
    
    try:
        data = request.json
        data_type = data.get("data_type")
        
        if not data_type:
            logger.error("Error: 'data_type' no está presente en los datos recibidos.")
            return jsonify({"error": "Tipo de dato no especificado"}), 400

        # Llamar a la función para procesar el data_type y enviar los datos en batch a Kafka
        process_data_type(data_type, batch_size=200)
        return jsonify({"message": f"Datos para {data_type} enviados en batch a Kafka"}), 200
    
    except Exception as e:
        logger.error(f"Error en el servidor: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Iniciando la aplicación Flask.")
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
