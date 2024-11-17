from fastapi import FastAPI,WebSocket,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

from persistence.database import obtener_alertas, index_alertas
from persistence.websockets import websocket_endpoint
from persistence.kafka_model_consumer import start_model_consumer
import logging
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

HOST = os.getenv('MODEL_DEV_HOST', '0.0.0.0')
PORT = int(os.getenv('MODEL_DEV_PORT', '4321'))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("Iniciando el servidor fastapi")

@app.get("/")
async def read_root():
    logger.info("Solicitud recibida en el endpoint raíz")
    return {"message": "Bienvenido al servidor FastAPI"}

@app.get("/alertas/{motor_id}")
async def get_alertas_motor(motor_id: str):
    """
    Recupera las alertas asociadas a un motor específico.
    """
    try:
        alertas = obtener_alertas(motor_id)
        if not alertas:
            raise HTTPException(status_code=404, detail="No se encontraron alertas para el motor especificado")
        return {"motorId": motor_id, "alertas": alertas}
    except Exception as e:
        logger.error(f"Error al recuperar alertas para el motor {motor_id}: {e}")
        raise HTTPException(status_code=404, detail="Motor no encontrado")
    
@app.get("/alertas/")
async def get_alertas_index():
    """
    Recupera las alertas asociadas a un motor específico.
    """
    try:
        alertas = index_alertas()
        return alertas
    except Exception as e:
        logger.error(f"Error al recuperar alertas para motores: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.websocket("/ws")
async def websocket_route(websocket : WebSocket):
    await websocket_endpoint(websocket) 

if __name__ == "__main__":
    import uvicorn
    start_model_consumer()
    uvicorn.run(app, host=HOST, port=PORT, log_level="debug")