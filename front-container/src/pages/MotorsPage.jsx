import { useState } from "react";
import useMotores from "../hooks/useMotores";
import IconComponent from "../components/IconComponent";
import FormMotor from "../components/FormMotor";
import TableHeader from "../components/TableHeader";
import TableCell from "../components/TableCell.jsx";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Switch, Tooltip } from "@material-tailwind/react";
import toast from "react-hot-toast";
import api from "../api.js";

export function MotorsPage() {
  const { motores, setMotores } = useMotores();
  const [ metricsMode, setMetricsMode ] = useState(false)
  const [ dialogState, setDialogState ] = useState({
    motorEditing: null,
    openEdit: false,
    motorDeleting: null,
    openDelete: false,
  });
  
  const handleOpenEdit = () => setDialogState((prev) => ({ ...prev, openEdit: !prev.openEdit }));
  const handleOpenDelete = () => setDialogState((prev) => ({ ...prev, openDelete: !prev.openDelete }));

  const handleEdit = (motor) => {
    setDialogState(prev => ({ ...prev, motorEditing: motor, openEdit: true }));
  };

  const handleDelete = (motor) => {
    setDialogState(prev => ({ ...prev, motorDeleting: motor, openDelete: true }));
  };
  
  const deleteMotor = () => {
    toast.promise(api.delete(`/api/motores/${dialogState.motorDeleting.id}`), {
      loading: 'Eliminando motor',
      success: 'Motor eliminado correctamente',
      error: 'Error al intentar eliminar el motor'
    }).then((_) => {
      setMotores(prev => prev.filter(m => m.id != dialogState.motorDeleting.id))
      handleOpenDelete()
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <>
      <Dialog open={dialogState.openEdit && dialogState.motorEditing !== null} handler={handleOpenEdit} className="!min-w-0 !w-auto">
        <DialogBody className="p-0">
          <FormMotor motor={dialogState.motorEditing} setMotores={setMotores}></FormMotor>
        </DialogBody>
      </Dialog>

      <Dialog open={dialogState.openDelete && dialogState.motorDeleting !== null} handler={handleOpenDelete} className="!min-w-0 !w-auto">
        <DialogHeader>
          <p className="font-inter text-lg text-center mx-auto">Confirm Deletion</p>
        </DialogHeader>
        <DialogBody className="p-0 flex justify-center font-inter text-base font-semibold text-center flex-col gap-2 px-4">
          <p>Are you sure you want to delete Motor ID ({dialogState.motorDeleting?.id})?</p>
          <p>This action cannot be undone</p>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-4 justify-center mx-auto">
            <Button onClick={() => deleteMotor()} type="submit" className="bg-red-500 rounded-sm py-2.5">
              Delete motor
            </Button>
            <Button onClick={handleOpenDelete} type="submit" className="bg-sky rounded-sm py-2.5">
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      <div className="bg-smoke flex flex-col w-full h-full">
        <header className="flex justify-between p-4 bg-obsidian">
          <div className="flex items-center gap-2">
            <IconComponent className="text-white w-8 h-8" viewBox="0 0 24 24" icon="motor" />
            <h1 className="text-white">Motor <strong className="text-light-sky">Manager</strong></h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-white">
            <Switch defaultChecked className="checked:bg-sky checked:bg-opacity-100 bg-smoke bg-opacity-80" onChange={() => setMetricsMode(!metricsMode)} label="Edit mode" labelProps={{className: 'text-white'}} />
          </div>
        </header>
        <div className="flex gap-4 p-4 justify-center flex-1 h-0">
          <FormMotor setMotores={setMotores} />
          <article  className="bg-light-smoke dark:bg-midnight shadow-md rounded-md flex flex-col gap-4 w-[720px] overflow-auto h-max max-h-full">
            <table className="min-w-full shadow-sm rounded-lg">
              <thead>
                <tr>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Motor name</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Motor type</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {motores.map((motor) => (
                  <tr key={motor.id} className="even:bg-smoke">
                    <TableCell>{motor.id}</TableCell>
                    <TableCell>{motor.nombre}</TableCell>
                    <TableCell>{motor.descripcion}</TableCell>
                    <TableCell>{motor.tipo}</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </div>
      </div>
    </>
  );
}
