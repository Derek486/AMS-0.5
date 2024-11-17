import os
import redis
import json
from datetime import datetime

redis_host = os.getenv("REDIS_HOST", "redis")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_db = int(os.getenv("REDIS_DB", 0))

redis_client = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db, decode_responses=True)

async def guardar_alerta(motor_id, motor_name, alerta):
    """
    Guarda una alerta en Redis bajo la clave del motor.
    """
    clave = f"motor:{motor_id}:alertas"
    timestamp = datetime.now().isoformat()
    alerta_new = {
      "errorType": alerta['Tipo_fallo'],
      "timestamp": timestamp
    }

    motor_data = redis_client.get(clave)
    if motor_data:
      motor_data = json.loads(motor_data)
    else:
      motor_data = {
        "motorId": motor_id,
        "motorName": motor_name,
        "alertas": []
      }
    motor_data["alertas"].append(alerta_new)
    print(f"Alerta guardada para motor {motor_id}: {alerta['Tipo_fallo']}")
    if motor_data:
      redis_client.set(clave, json.dumps(motor_data))
    else:
      redis_client.rpush(clave, json.dumps(motor_data))

def index_alertas():
    """
    Recupera todas las alertas almacenadas en Redis para todos los motores.
    """
    # Buscar todas las claves de alertas
    pattern = "motor:*:alertas"
    keys = redis_client.keys(pattern)
    motores = {}

    for key in keys:
        motor_id = key.split(":")[1]
        motor_data = redis_client.get(key)
        if motor_data:
            motor_data = json.loads(motor_data)
            motores[motor_id] = motor_data

    # Convertir a una lista de objetos para la respuesta
    return list(motores.values())


def obtener_alertas(motor_id):
    """
    Obtiene todas las alertas asociadas a un motor específico.
    """
    clave = f"motor:{motor_id}:alertas"
    motor_data = redis_client.get(clave)
    if motor_data:
        motor_data = json.loads(motor_data)
        return motor_data.get("alertas", [])
    return []