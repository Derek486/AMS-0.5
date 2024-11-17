import { useEffect, useState } from "react";
import api from "../api";

export default function useData({ type, motor }) {
  const [ data, setData ] = useState([])

  useEffect(() => {
    api.get(`api/motores/${type}/${motor.id}`)
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return [ data ]
}