import { useCallback } from "react";
import useForm from "../hooks/useForm";
import './FormStyles.css'
import { Link } from "react-router-dom";

export function LoginPage() {
  const [form, handleForm] = useForm();

  const login = useCallback((form) => {
    console.log(form);
  }, []);

  return (
    <form className="form-container" onSubmit={() => login(form)}>
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
