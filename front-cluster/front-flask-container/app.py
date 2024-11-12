import os
import threading
import jwt
import requests
from dotenv import load_dotenv
load_dotenv()
import logging

from flask import Flask, render_template, redirect,jsonify,request
from flask_socketio import SocketIO
from producer import toggle_sending, sending_data
from producer_model import process_and_print_data_in_batches

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
socketio = SocketIO(app, manage_session=False, cors_allowed_origins="*")
logger.info("Aplicación Flask iniciada correctamente")

MOTORES_API_URL = os.getenv('MOTORES_API_URL')

@socketio.on('send_data')
def handle_send_data(msg):
    thread = threading.Thread(target=toggle_sending, args=(msg,))
    thread.start()
    socketio.emit('toggle_data', msg)

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

# Nuevo enddpoint para manejar la solicitud desde los botones del frontend 
@app.route('/send_prediction_data', methods=["POST"])
def handle_prediction_data():
    logger.info("La función handle_prediction_data ha sido llamada.")  # Mensaje de depuración
    try:
        data = request.json
        logger.info(f"Datos recibidos desde el cliente: {data}")  # Para verificar los datos recibidos
        data_type = data.get("data_type")
        logger.info(f"Tipo de datos recibido: {data_type}")  # Asegurarse de que `data_type` tenga un valor

        if not data_type:
            logger.error("Error: 'data_type' no está presente en los datos recibidos.")
            return jsonify({"error": "Tipo de dato no especificado"}), 400

        # Crear un hilo para manejar la impresión del head sin bloquear el servidor
        thread = threading.Thread(target=process_and_print_data_in_batches, args=(data_type, 200))
        thread.start()
        
        return jsonify({"message": f"Head de datos para {data_type} impreso en los logs"}), 200
    except Exception as e:
        logger.error(f"Error en el servidor: {e}")  # Capturar el error específico
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
