import { useState, useEffect } from "react";
import './MotorsStyles.css'
import { Link, redirect } from "react-router-dom";

export function MotorsPage() {
  const [motors, setMotors] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    tipo: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const initialMotors = [
      { id: 1, nombre: "Motor A", descripcion: "Descripción A", tipo: "Tipo A" },
      { id: 2, nombre: "Motor B", descripcion: "Descripción B", tipo: "Tipo B" }
    ];
    setMotors(initialMotors);
  }, []);

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setMotors(
        motors.map((motor) => (motor.id === form.id ? form : motor))
      );
    } else {
      setMotors([...motors, { ...form, id: motors.length + 1 }]);
    }
    resetForm();
  };

  const handleEdit = (motor) => {
    setForm(motor);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setMotors(motors.filter((motor) => motor.id !== id));
  };

  const handleShow = (id) => {
    redirect(`/${id}`)
  }

  const resetForm = () => {
    setForm({
      id: null,
      nombre: "",
      descripcion: "",
      tipo: ""
    });
    setIsEditing(false);
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
        <button type="submit">{isEditing ? "Actualizar" : "Agregar"} Motor</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancelar</button>}
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
            {motors.map((motor) => (
              <tr key={motor.id}>
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
