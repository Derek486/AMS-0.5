import { Accordion, AccordionBody, Drawer, IconButton, Tooltip } from "@material-tailwind/react"
import IconComponent from "./IconComponent"
import TableCell from "./TableCell.jsx"
import clsx from "clsx"
import { useState } from "react"
import Acceleration from "./charts/Acceleration.jsx"
import Velocity from "./charts/Velocity.jsx"
import Temperature from "./charts/Temperature.jsx"
import TableHeader from "./TableHeader.jsx"
import ChartDialog from "./charts/ChartDialog.jsx"
import AlertCard from "./AlertCard.jsx"

export default function TableRowMotor({ motor, handleEdit, handleDelete, metricsMode, alerts = {} }) {
  const [metricOpen, setMetricOpen] = useState(null)

  return (
    <>
      {metricsMode ? (
        <Drawer open={metricOpen === 3} onClose={() => setMetricOpen(null)} placement="right" className="shadow-none">
          <div className="h-full flex flex-col">
            <header className="flex justify-center items-center p-4 bg-obsidian w-full">
              <p className="text-white text-center">Listado de alertas <br /> <strong>({motor.nombre})</strong></p>
            </header>
            <div className="p-4 flex flex-col gap-2 overflow-auto flex-1 h-0">
              {
                alerts?.alertas 
                ? (alerts?.alertas || []).map((a, index) => <AlertCard key={index} alert={a} />)
                : <center><p>No hay ningúna alerta</p></center>
              }
            </div>
          </div>
        </Drawer>
      ) : null}

      <ChartDialog title={"Acceleration RMS"} handlerOpen={() => setMetricOpen(null)} metricOpen={metricOpen === 0} metricsMode={metricsMode}>
        {metricOpen === 0 ? (<Acceleration motor={motor} />) : <></>}
      </ChartDialog>
      <ChartDialog title={"Vibration timeline"} handlerOpen={() => setMetricOpen(null)} metricOpen={metricOpen === 1} metricsMode={metricsMode}>
        {metricOpen === 1 ? (<Velocity motor={motor} />) : <></>}
      </ChartDialog>
      <ChartDialog title={"Temperature timeline"} handlerOpen={() => setMetricOpen(null)} metricOpen={metricOpen === 2} metricsMode={metricsMode}>
        {metricOpen === 2 ? (<Temperature motor={motor} />) : <></>}
      </ChartDialog>

      <Accordion open={metricsMode} className={clsx(["w-full", {'odd:bg-light-smoke': !metricsMode}])}>
        <header className={clsx(["flex w-full", { 'bg-light-smoke': metricsMode }])}>
          <TableCell className="max-w-24">{motor.id}</TableCell>
          <TableCell className="max-w-64">{motor.nombre}</TableCell>
          <TableCell className="max-w-64">
            <Tooltip 
              className="bg-obsidian"
              content={<p className="max-w-64">{motor.descripcion}</p>}
              placement="bottom-start"
            >
              {motor.descripcion}
            </Tooltip>
          </TableCell>
          <TableCell className="max-w-48">{motor.tipo}</TableCell>
          <TableCell className="max-w-72 flex justify-center">
            {!metricsMode ? (
              <>
                <Tooltip content="Edit">
                  <IconButton onClick={() => handleEdit(motor)} variant="text" className="rounded-full">
                    <IconComponent icon="pencil" className="w-5 h-5 text-sky" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Delete">
                  <IconButton onClick={() => handleDelete(motor)} variant="text" className="rounded-full" color="red">
                    <IconComponent icon="trash" className="w-5 h-5 text-red-400" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip content="Acceleration">
                  <IconButton onClick={() => setMetricOpen(0)} variant="text" className="rounded-full">
                    <IconComponent icon="activity" className="w-5 h-5 text-sky" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Velocity">
                  <IconButton onClick={() => setMetricOpen(1)} variant="text" className="rounded-full">
                    <IconComponent icon="lightning" className="w-5 h-5 text-sky" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Temperature">
                  <IconButton onClick={() => setMetricOpen(2)} variant="text" className="rounded-full">
                    <IconComponent icon="thermometer" className="w-5 h-5 text-sky" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </TableCell>
        </header>
        <AccordionBody className="p-0 w-full bg-light-smoke mb-4 rounded-b-md">
          <div className="flex flex-col w-full">
            <header className="flex w-full">
              <TableHeader className="bg-opacity-70 max-w-24">Status</TableHeader>
              <TableHeader className="bg-opacity-70 max-w-64">Alerts</TableHeader>
              <TableHeader className="bg-opacity-70 max-w-64">{""}</TableHeader>
              <TableHeader className="bg-opacity-70 max-w-64">{""}</TableHeader>
              <TableHeader className="bg-opacity-70 max-w-64 text-center">Actions</TableHeader>
            </header>
            <div className="flex">
              <TableCell className="justify-center max-w-24">
                <IconComponent 
                  icon="record" 
                  className={
                    clsx(["w-5 h-5", {
                      'fill-green-700': !(alerts?.alertas) || (alerts.alertas.length >= 0 && alerts.alertas.length <= 3),
                      'fill-amber-600': alerts?.alertas && alerts.alertas.length >= 4 && alerts.alertas.length <= 7,
                      'fill-red-500': alerts?.alertas && alerts.alertas.length >= 8
                    }])
                  } 
                />
              </TableCell>
              <TableCell className="max-w-64">
                <Tooltip content="Desalineamiento">
                  <div className="flex gap-2">
                    <IconComponent icon="activity" className="w-5 h-5 text-sky" />
                    {(alerts?.alertas || []).filter(a => a.errorType == "Desalineacion del eje").length}
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell className="max-w-64">
                <Tooltip content="Desgaste">
                  <div className="flex gap-2">
                    <IconComponent icon="steps" className="w-5 h-5 text-sky" />
                    {(alerts?.alertas || []).filter(a => a.errorType == "Desgaste del rodamiento").length}
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell className="max-w-64">
                &nbsp;
              </TableCell>
              <TableCell className="max-w-64 justify-center">
                <Tooltip content="Show alerts">
                  <IconButton onClick={() => setMetricOpen(3)} variant="text" className="rounded-full">
                    <IconComponent icon="alert" className="w-5 h-5 text-sky" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </div>
          </div>
        </AccordionBody>
      </Accordion>
    </>
  )
}