import { useCallback } from "react";
import { Link } from "react-router-dom";
import useForm from "../hooks/useForm";
import './FormStyles.css';

export function RegisterPage() {
  const [form, handleForm] = useForm();

  const register = useCallback((form) => {
    console.log(form);
  }, []);

  return (
    <form className="form-container" onSubmit={() => register(form)}>
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
