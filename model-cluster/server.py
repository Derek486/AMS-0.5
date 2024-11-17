from fastapi import FastAPI,WebSocket
from dotenv import load_dotenv
from persistence.websockets import websocket_endpoint
from persistence.kafka_consumer import start_consumer
from persistence.kafka_model_consumer import start_model_consumer
import logging

load_dotenv()

app = FastAPI()

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
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")