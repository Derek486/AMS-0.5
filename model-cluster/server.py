from fastapi import FastAPI,WebSocket
from dotenv import load_dotenv
from persistence.websockets import websocket_endpoint
from persistence.kafka_consumer import start_consumer
from persistence.kafka_model_consumer import start_model_consumer

load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {"messsage":"Bienvenido al servidor FastAPI"}

@app.websocket("/ws")
async def websocket_route(websocket : WebSocket):
    await websocket_endpoint(websocket) 

if __name__ == "__main__":
    import uvicorn
    start_consumer()
    start_model_consumer()
    uvicorn.run(app,host = "localhost",port=8000)