import { useState } from "react";

export default function useForm(initial) {
  const [form, setForm] = useState(initial || {})
  const handleForm = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  return [form, handleForm]
}