import os
import threading
import jwt
import requests
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template, redirect
from flask_socketio import SocketIO
from producer import toggle_sending, sending_data

app = Flask(__name__)
socketio = SocketIO(app, manage_session=False, cors_allowed_origins="*")

MOTORES_API_URL = os.getenv('MOTORES_API_URL')

@socketio.on('send_data')
def handle_send_data(msg):
    thread = threading.Thread(target=toggle_sending, args=(msg,))
    thread.start()
    socketio.emit('toggle_data', msg)

@app.route('/testing/<token>', methods=["GET"])
def index(token):
    try:
        if token is None:
            return redirect("/", code=302)
        decoded = jwt.decode(token, options={"verify_signature": False})
        userId = decoded['sub']
        url = f'{MOTORES_API_URL}/api/motores/{userId}'
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            motors = response.json()
            return render_template('index.html', motors=motors, metrics=sending_data)
        return redirect("/", code=302)
    except Exception as e:
        return redirect("/", code=302)


if __name__ == '__main__':
    socketio.run(app, debug=True)