from fastapi import FastAPI
from dotenv import load_dotenv
from persistence.websockets import websocket_endpoint
from fastapi import WebSocket
load_dotenv()
from persistence.kafka_consumer import start_consumer

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
    uvicorn.run(app,host = "localhost",port=8000)