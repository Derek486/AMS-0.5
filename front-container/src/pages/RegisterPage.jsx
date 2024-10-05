import { useCallback } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import api from "../api";
import toast from "react-hot-toast";
import './FormStyles.css';

export function RegisterPage() {
  const [form, handleForm] = useForm();
  const navigate = useNavigate()

  const register = useCallback(async (form) => {
    toast.promise(api.post('/api/register', {
      Apellido: form.apellidos,
      Nombre: form.nombre,
      Password: form.password,
      Email: form.email
    }), {
      loading: 'Loading',
      success: 'Usuario registrado',
      error: 'Error al registrar al usuario',
    }).then((res) => {
      if (res.status === 200) {
        navigate("/auth/login")
      }
    }).catch((err) => {
      toast.error(err.response.data)
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    register(form)
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h1>Register Page</h1>
      </div>
      <div className="form-body">
        <section className="form-section">
          <div className="form-section--row">
            <div className="input-group">
              <label htmlFor="input_nombre">Nombre</label>
              <input
                id="input_nombre"
                type="text"
                value={form.nombre || ""}
                name="nombre"
                onInput={handleForm}
                className="form-input"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="input_apellidos">Apellidos</label>
              <input
                id="input_apellidos"
                type="text"
                value={form.apellidos || ""}
                name="apellidos"
                onInput={handleForm}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="input_email">Email</label>
            <input
              id="input_email"
              type="email"
              value={form.email || ""}
              name="email"
              onInput={handleForm}
              className="form-input"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="input_password">Password</label>
            <input
              id="input_password"
              type="password"
              value={form.password || ""}
              name="password"
              onInput={handleForm}
              className="form-input"
              required
            />
          </div>
        </section>
      </div>
      <footer className="form-footer">
        <button className="form-button" type="submit">
          Register
        </button>
        <p>Already have an account? <Link to="/auth/login">Login here</Link></p>
      </footer>
    </form>
  );
}
