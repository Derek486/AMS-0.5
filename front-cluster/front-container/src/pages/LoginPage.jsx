import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import api from "../api";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import IconComponent from "../components/IconComponent";
import { Input } from "@material-tailwind/react";

export function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false)
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
    <AuthLayout 
      title="Login page" 
      buttonText="Login" 
      link="/auth/register" 
      linkText="Register here" 
      onSubmit={handleSubmit}
      footerText="Don't have an account?"
    >
      <>
        <div className="flex flex-col gap-4">
          <section>
            <Input 
              variant="standard" 
              label="Email" 
              type="email"
              name="email"
              value={form.email || ''} 
              onChange={handleForm}
              color="black"
              required
            />
          </section>
          <section>
            <Input 
              variant="standard" 
              label="Password" 
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={form.password || ''} 
              onChange={handleForm}
              color="black"
              icon={
                <IconComponent 
                  onClick={() => setPasswordVisible(prev => !prev)} 
                  icon={passwordVisible ? 'eye-slash' : 'eye'}
                />
              }
              required
            />
          </section>
        </div>
      </>
    </AuthLayout>
  );
}
