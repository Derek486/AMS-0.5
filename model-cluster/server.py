from fastapi import FastAPI,WebSocket
from dotenv import load_dotenv

load_dotenv()

from persistence.websockets import websocket_endpoint
from persistence.kafka_model_consumer import start_model_consumer
import logging
import os


app = FastAPI()

HOST = os.getenv('MODEL_DEV_HOST', '0.0.0.0')
PORT = int(os.getenv('MODEL_DEV_PORT', '8000'))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("Iniciando el servidor fastapi")

@app.get("/")
async def read_root():
    logger.info("Solicitud recibida en el endpoint raíz")
    return {"message": "Bienvenido al servidor FastAPI"}

@app.websocket("/ws")
async def websocket_route(websocket : WebSocket):
    await websocket_endpoint(websocket) 

if __name__ == "__main__":
    import uvicorn
    start_model_consumer()
    uvicorn.run(app, host=HOST, port=PORT, log_level="debug")