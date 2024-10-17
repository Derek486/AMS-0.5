import { useState } from "react";

export default function useForm(initial) {
  const [form, setForm] = useState(initial || {})
  const handleForm = ({ target }) => {
    setForm(prev => ({
      ...prev,
      [target.name]: target.value
    }))
  }
  const resetForm = () => {
    setForm(initial || {})
  }
  const clearForm = () => {
    setForm({})
  }
  return [form, handleForm, clearForm, resetForm]
}