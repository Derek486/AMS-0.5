import { useState } from "react";
import useMotores from "../hooks/useMotores";
import IconComponent from "../components/IconComponent";
import FormMotor from "../components/FormMotor";
import TableHeader from "../components/TableHeader";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Switch } from "@material-tailwind/react";
import toast from "react-hot-toast";
import api from "../api.js";
import TableRowMotor from "../components/TableRowMotor.jsx";
import clsx from "clsx";
import { Link } from "react-router-dom";

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
        <DialogBody className="p-0 flex justify-center font-inter text-base font-medium text-center flex-col gap-2 px-4">
          <p>Are you sure you want to delete Motor ID ({dialogState.motorDeleting?.id})?</p>
          <p className="font-bold">This action cannot be undone</p>
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

      <div className="bg-smoke flex flex-col w-full h-full overflow-auto">
        <header className="flex justify-between p-4 bg-obsidian top-0 w-full">
          <div className="flex items-center gap-2">
            <IconComponent className="text-white w-8 h-8" viewBox="0 0 24 24" icon="motor" />
            <h1 className="text-white w-0 xs:w-auto overflow-clip">Motor <strong className="text-light-sky">Manager</strong></h1>
          </div>
          <div className="flex flex-col items-end justify-center sm:flex-row sm:items-center sm:gap-4">
            <Switch className="checked:bg-sky checked:bg-opacity-100 bg-smoke bg-opacity-80" onChange={() => setMetricsMode(!metricsMode)} label={<i class="text-white font-normal"><span class="text-light-sky">Metrics</span> mode</i>} labelProps={{className: 'text-white'}} />
            <span className="border-[1px] border-white h-full rounded-full"></span>
            <a href="/testing">
              <i className="text-white">Go test &gt; </i>
            </a>
          </div>
        </header>
        <div className="flex flex-col md:flex-row gap-4 p-4 justify-center md:flex-1 md:h-0">
          <section className="sm:mx-auto sm:w-96 md:w-auto md:m-0">
            <FormMotor setMotores={setMotores} />
          </section>
          <section  className={clsx(["dark:bg-midnight rounded-md flex flex-col gap-4 overflow-auto max-h-[420px] md:h-max md:max-h-full", { 'shadow-md': !metricsMode }])}>
            <div className="shadow-sm rounded-lg w-[720px]">
              <header className="flex w-full">
                <TableHeader className="max-w-24">ID</TableHeader>
                <TableHeader className="max-w-64">Motor name</TableHeader>
                <TableHeader className="max-w-64">Description</TableHeader>
                <TableHeader className="max-w-64">Motor type</TableHeader>
                <TableHeader className="max-w-64 text-center">{metricsMode ? 'Metric charts' : 'Actions'}</TableHeader>
              </header>
              <div className="flex flex-col">
                {motores.map((motor) => (
                  <TableRowMotor 
                    key={motor.id}
                    motor={motor} 
                    handleDelete={handleDelete} 
                    handleEdit={handleEdit} 
                    metricsMode={metricsMode}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
