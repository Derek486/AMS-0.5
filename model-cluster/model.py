import math

def get_velocity_data(idMotor:str, vibration_data_list):
  velocity_data = [d for d in vibration_data_list if d[0] == idMotor and d[3] == 'velocity']

  if not velocity_data:
     return None
  
  picos = [d for d in velocity_data if d[1] > 12 ]

  result = {
    "idMotor": idMotor,
    "picos": picos,
    "message": f"Se encontraron {len(picos)} picos en la velocidad" 
  }

  return result


def get_aceleration_data(idMotor:str, vibration_data_list):
  aceleration_data = [d for d in vibration_data_list if d[0] == idMotor and d[3] == 'acceleration']

  if not aceleration_data:
     return None

  # Logica para calcular Rms
  rms = math.sqrt(sum([d[1]**2 for d in aceleration_data]) / len(aceleration_data))

  result = {
      "idMotor": idMotor,
      "rms": rms,
      "message": f"Se encontro que el valor de rms para el motor {idMotor} es de {rms}"
  }

  return result


def get_temperature_data(idMotor:str, vibration_data_list):
  temperature_data = [d for d in vibration_data_list if d[0] == idMotor and d[3] == 'temperature']

  if not temperature_data:
     return None

  promedio = sum(map(lambda x: x[1], temperature_data)) / len(temperature_data)

  result = {
    "idMotor":idMotor,
    "promedio": promedio,
    "message":f"Se encontro que la temperatura promedio es {promedio}"
  }

  return result
