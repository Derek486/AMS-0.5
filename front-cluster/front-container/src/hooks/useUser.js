import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function useUser() {
  const [ user, setUser ] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwtDecode(token) 
      setUser(user)
    } else {
      navigate('/auth')
    }
  }, [])

  return user
}