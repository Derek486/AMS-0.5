import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import api from "../api";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import { Input } from "@material-tailwind/react";
import IconComponent from "../components/IconComponent";

export function RegisterPage() {
  const [passwordVisible, setPasswordVisible] = useState(false)
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
    <AuthLayout 
      title="Register page" 
      buttonText="Register" 
      link="/auth/login" 
      linkText="Login here" 
      onSubmit={handleSubmit}
      footerText="Already have an account?"
    >
      <>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 max-w-72">
            <section>
              <Input 
                variant="standard" 
                label="First name"
                type="text"
                name="nombre"
                value={form.nombre || ''} 
                onChange={handleForm}
                color="black"
                containerProps={{
                  className: '!min-w-0'
                }}
                required
              />
            </section>
            <section>
              <Input 
                variant="standard" 
                label="Last name" 
                type="text"
                name="apellidos"
                value={form.apellidos || ''} 
                onChange={handleForm}
                color="black"
                containerProps={{
                  className: '!min-w-0'
                }}
                required
              />
            </section>
          </div>
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
