import { Button, Input, Textarea } from "@material-tailwind/react";
import useForm from "../hooks/useForm"
import toast from "react-hot-toast";
import api from "../api";

export default function FormMotor({ motor, setMotores }) {
  const [form, handleForm, _, resetForm] = useForm(motor || {
    id: null,
    nombre: '',
    descripcion: '',
    tipo: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (motor !== undefined) {
      toast.promise(api.put('/api/motores', {
        MotorId: motor.id,
        Nombre: form.nombre,
        Descripcion: form.descripcion,
        Tipo: form.tipo
      }), {
        loading: 'Actualizando motor',
        success: 'Motor actualizado exitosamente',
        error: 'Error al intentar actualizar el motor'
      }).then((_) => {
        setMotores(prev => prev.map(m => m.id == motor.id ? ({
          id: m.id,
          nombre: form.nombre,
          descripcion: form.descripcion,
          tipo: form.tipo
        }) : m))
      }).catch(err => {
        console.log(err);
      })
    } else {
      toast.promise(api.post('/api/motores', {
        Nombre: form.nombre,
        Descripcion: form.descripcion,
        Tipo: form.tipo
      }), {
        loading: 'Guardando motor',
        success: 'Motor creado exitosamente',
        error: 'Error al intentar crear el motor'
      }).then((res) => {
        setMotores(prev => prev.concat(res.data))
      }).catch(err => {
        console.log(err);
      })
      resetForm()
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-light-smoke dark:bg-midnight shadow-md rounded-md p-8 flex flex-col gap-4 w-96 max-h-max">
        <h1 className="font-semibold text-lg text-center">Motor {motor ? `ID (${motor.id})` : 'Form'}</h1>
        <div className="flex flex-col gap-3">
          <section>
            <Input
              variant="outlined"
              color="black"
              label="Motor Name"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleForm}
              required
            />
          </section>
          <section>
            <Textarea
              variant="outlined"
              label="Description"
              type="text"
              name="descripcion"
              value={form.descripcion}
              onChange={handleForm}
              required
            />
          </section>
          <section>
            <Input
              variant="outlined"
              color="black"
              label="Motor Type"
              type="text"
              name="tipo"
              value={form.tipo}
              onChange={handleForm}
              required
            />
          </section>
          <footer className="flex flex-col gap-3">
            <Button type="submit" className="bg-sky rounded-sm py-2.5 w-full">
              {motor ? 'Update motor' : 'Create motor'}
            </Button>
          </footer>
        </div>
      </form>
    </>
  )
}