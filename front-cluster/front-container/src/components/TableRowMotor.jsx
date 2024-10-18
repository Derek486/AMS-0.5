import { Accordion, AccordionBody, Drawer, IconButton, Tooltip } from "@material-tailwind/react"
import IconComponent from "./IconComponent"
import TableCell from "./TableCell.jsx"
import clsx from "clsx"
import { useState } from "react"
import Acceleration from "./charts/Acceleration.jsx"
import Velocity from "./charts/Velocity.jsx"
import Temperature from "./charts/Temperature.jsx"
import TableHeader from "./TableHeader.jsx"

export default function TableRowMotor({ motor, handleEdit, handleDelete, metricsMode }) {
  const [metricOpen, setMetricOpen] = useState(null)
  const number = parseInt(Math.random()*10)
  return (
    <>
      {metricsMode ? (
        <Drawer open={metricOpen === 3} onClose={() => setMetricOpen(null)} placement="right" className="shadow-none">
          asdasdasd
        </Drawer>
      ) : null}

      <Acceleration motor={motor} handlerOpen={() => setMetricOpen(null)} metricOpen={metricOpen === 0} metricsMode={metricsMode} />
      <Velocity motor={motor} handlerOpen={() => setMetricOpen(null)} metricOpen={metricOpen === 1} metricsMode={metricsMode}  />
      <Temperature motor={motor} handlerOpen={() => setMetricOpen(null)} metricOpen={metricOpen === 2} metricsMode={metricsMode}  />

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
                      'fill-green-700': number >= 0 && number <= 3,
                      'fill-amber-600': number >= 4 && number <= 7,
                      'fill-red-500': number >= 8
                    }])
                  } 
                />
              </TableCell>
              <TableCell className="max-w-64">
                <div className="flex gap-2">
                  <IconComponent icon="activity" className="w-5 h-5 text-sky" />
                  {parseInt(Math.random()*1000)}
                </div>
              </TableCell>
              <TableCell className="max-w-64">
                <div className="flex gap-2">
                  <IconComponent icon="lightning" className="w-5 h-5 text-sky" />
                  {parseInt(Math.random()*1000)}
                </div>
              </TableCell>
              <TableCell className="max-w-64">
                <div className="flex gap-2">
                  <IconComponent icon="thermometer" className="w-5 h-5 text-sky" />
                  {parseInt(Math.random()*1000)}
                </div>
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