import { createContext, useEffect, useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter } from '@material-tailwind/react'
import { MODEL_HOST } from "../config";
import IconComponent from '../components/IconComponent'
import toast from "react-hot-toast";

const WebsocketsContext = createContext()

export function WebsocketsProvider({ children }) {
  let socket;
  const [lastError, setLastError] = useState(null)

  useEffect(() => {
    socket = new WebSocket(`ws://${MODEL_HOST}/ws`);

    socket.onopen = () => {
      console.log('Conectado al WebSocket')
    };

    socket.onmessage = (event) => {
      let jsonString = event.data.replace(/'/g, '"');
      const data = JSON.parse(jsonString)
      if (data.hasOwnProperty('Tipo_fallo')) {
        setLastError(({
          errorType: data['Tipo_fallo'],
          motorId: data['motorId'],
          motorName: data['motorName'],
        }))
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
      <>
        <Dialog open={lastError !== null} handler={() => setLastError(null)} size="sm">
          <DialogBody>
            <div className="flex flex-col items-center gap-3 text-black text-opacity-70">
              <IconComponent className="fill-red-500 w-10 h-10" icon="alert" />
              <h2 className="font-semibold text-lg">{lastError?.motorName} ({lastError?.motorId})</h2>
              <center className="px-4">
                <p>Ha sufrido un error por: <span className="font-semibold">{lastError?.errorType}</span></p>
              </center>
            </div>
          </DialogBody>
          <DialogFooter className="!p-0 !m-0">
            <Button onClick={() => setLastError(null)} className="w-full rounded-none bg-red-500">
              Cerrar
            </Button>
          </DialogFooter>
        </Dialog>
        {children}
      </>
    </WebsocketsContext.Provider>
  )
}