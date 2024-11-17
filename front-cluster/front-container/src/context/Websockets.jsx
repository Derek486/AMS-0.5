import { createContext, useEffect } from "react";
import toast from "react-hot-toast";
import { MODEL_HOST } from "../config";

const WebsocketsContext = createContext()

export function WebsocketsProvider({ children }) {
  let socket;

  useEffect(() => {
    socket = new WebSocket(`ws://${MODEL_HOST}/ws`);

    socket.onopen = () => {
      console.log('Conectado al WebSocket')
    };

    socket.onmessage = (event) => {
      let jsonString = event.data.replace(/'/g, '"');
      const data = JSON.parse(jsonString)
      if (data.hasOwnProperty('Tipo_fallo')) {
        toast.error(`${data['Tipo_fallo']} detectado para el motor ${data['motorName']} (${data['motorId']})`)
      } else {
        toast.success(`Ningún fallo detectado en el motor ${data['motorName']} (${data['motorId']})`)
      }
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