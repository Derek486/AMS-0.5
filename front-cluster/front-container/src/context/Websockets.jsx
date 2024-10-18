import { createContext, useEffect } from "react";
import toast from "react-hot-toast";

const WebsocketsContext = createContext()

export function WebsocketsProvider({ children }) {
  let socket;

  useEffect(() => {
    socket = new WebSocket('ws://localhost:8000/ws');

    socket.onopen = () => {
      console.log('Conectado al WebSocket')
    };

    socket.onmessage = (event) => {
      let jsonString = event.data.replace(/'/g, '"');
      const data = JSON.parse(jsonString)
      toast.success(`${data['message']} para el motor ${data['idMotor']}`)
    };

    socket.onclose = () => {
      console.log('Conexion Websocket cerrada')
    };

    return () => {
      socket.close();
    };
 
  }, []);

  return (
    <WebsocketsContext.Provider value={[socket]}>
      {children}
    </WebsocketsContext.Provider>
  )
}