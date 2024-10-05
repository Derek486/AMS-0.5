import { useCallback } from "react";
import useForm from "../hooks/useForm";
import './FormStyles.css'
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export function LoginPage() {
  const [form, handleForm] = useForm();
  const navigate = useNavigate()

  const login = useCallback(async (form) => {
    toast.promise(api.post('/api/login', {
      Password: form.password,
      Email: form.email
    }), {
      loading: 'Loading',
      success: 'Inicio de sesión exitoso',
      error: 'Error al iniciar sesión',
    }).then((res) => {
      if (res.status === 200) {
        localStorage.setItem('token', res.data)
        navigate("/")
      }
    }).catch((err) => {
      if (err.response?.data) {
        toast.error(err.response.data)
      }
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    login(form)
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h1>Login Page</h1>
      </div>
      <div className="form-body">
        <section className="form-section">
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
          Login
        </button>
        <p>Don't have an account? <Link to="/auth/register">Register here</Link></p>
      </footer>
    </form>
  );
}
