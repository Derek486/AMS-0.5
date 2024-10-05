import { useState } from "react";
import './MotorsStyles.css'
import { Link } from "react-router-dom";
import useMotores from "../hooks/useMotores";
import api from "../api";
import toast from "react-hot-toast";
import clsx from "clsx";

export function MotorsPage() {
  const { motores, loading, error, fetchMotores, setMotores } = useMotores();
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    tipo: ""
  });

  const [motorEditing, setMotorEditing] = useState(null);

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (motorEditing !== null) {
      toast.promise(api.put('/api/motores', {
        MotorId: motorEditing,
        Nombre: form.nombre,
        Descripcion: form.descripcion,
        Tipo: form.tipo
      }), {
        loading: 'Actualizando motor',
        success: 'Motor actualizado exitosamente',
        error: 'Error al intentar actualizar el motor'
      }).then((_) => {
        setMotores(prev => prev.map(m => m.id == motorEditing ? ({
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
    }
    resetForm();
  };

  const handleEdit = (motor) => {
    setForm(motor);
    setMotorEditing(motor.id);
  };

  const handleDelete = (id) => {
    toast.promise(api.delete(`/api/motores/${id}`), {
      loading: 'Eliminando motor',
      success: 'Motor eliminado correctamente',
      error: 'Error al intentar eliminar el motor'
    }).then((res) => {
      setMotores(prev => prev.filter(m => m.id != id))
    }).catch(err => {
      console.log(err);
    })
  };

  const resetForm = () => {
    setForm({
      id: null,
      nombre: "",
      descripcion: "",
      tipo: ""
    });
    setMotorEditing(null);
  };

  return (
    <div className="crud-container">
      <h1>Gestión de Activos</h1>
      <br />
      <form className="motor-form" onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label>Tipo:</label>
          <input
            type="text"
            name="tipo"
            value={form.tipo}
            onChange={handleFormChange}
            required
          />
        </div>
        <button type="submit">{motorEditing !== null ? "Actualizar" : "Agregar"} Motor</button>
        {motorEditing !== null && <button type="button" onClick={resetForm}>Cancelar</button>}
      </form>

      <div className="motor-table--container">
        <table className="motor-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {motores.map((motor) => (
              <tr key={motor.id} className={clsx({
                'motor--editing': motorEditing == motor.id
              })}>
                <td>{motor.nombre}</td>
                <td>{motor.descripcion}</td>
                <td>{motor.tipo}</td>
                <td className="td--actions">
                  <button onClick={() => handleEdit(motor)} className="action action--success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(motor.id)} className="action action--wrong">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                  <Link to={`/${motor.id}`} className="action action--neutral">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
