import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './MotorStyles.css'
import toast from "react-hot-toast";
import api from "../api";

export function MotorPage() {
  const { id } = useParams();
  const [datos, setDatos] = useState({ velocidad: [], temperatura: [], aceleracion: [] });

  useEffect(() => {
    toast.promise(api.get(`motores/${id}`), {
      loading: 'Cargando datos de motor',
      success: 'Datos obtenidos correctamente',
      error: 'Error al obtener los datos'
    }).then(res => {
      const data = res.data.datos

      const velocidad = data.filter(d => d?.Medicion === 'V');
      const temperatura = data.filter(d => d?.Medicion === 'T');
      const aceleracion = data.filter(d => d?.Medicion === 'A');
  
      setDatos({ velocidad, temperatura, aceleracion });
    }).catch(err => {
      console.log(err);
    })

  }, [id]);

  return (
    <div className="motor-wrapper">
      <header>
        <Link to={'/'} className="action--link">Volver</Link>
        <h1 className="motor-title">Motor {id}</h1>
      </header>
      <div className="motor-container">
        <section className="motor-section">
          <h2>Velocidad</h2>
          <article>
            <h2>Gráfico</h2>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0' }}>
              Contenedor de gráfico (pendiente de implementación)
            </div>
          </article>
          <table className="motor-chart">
            <thead>
              <tr>
                <th>Valor</th>
                <th>Timestamp</th>
                <th>Eje</th>
              </tr>
            </thead>
            <tbody>
              {datos.velocidad.map((dato, index) => (
                <tr key={index}>
                  <td>{dato.Value}</td>
                  <td>{dato.Timestamp}</td>
                  <td>{dato.Axis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="motor-section">
          <h2>Temperatura</h2>
          <article>
            <h2>Gráfico</h2>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0' }}>
              Contenedor de gráfico (pendiente de implementación)
            </div>
          </article>
          <table className="motor-chart">
            <thead>
              <tr>
                <th>Valor</th>
                <th>Timestamp</th>
                <th>Eje</th>
              </tr>
            </thead>
            <tbody>
              {datos.temperatura.map((dato, index) => (
                <tr key={index}>
                  <td>{dato.Value}</td>
                  <td>{dato.Timestamp}</td>
                  <td>{dato.Axis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="motor-section">
          <h2>Aceleración</h2>
          <article>
            <h2>Gráfico</h2>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0' }}>
              Contenedor de gráfico (pendiente de implementación)
            </div>
          </article>
          <table className="motor-chart">
            <thead>
              <tr>
                <th>Valor</th>
                <th>Timestamp</th>
                <th>Eje</th>
              </tr>
            </thead>
            <tbody>
              {datos.aceleracion.map((dato, index) => (
                <tr key={index}>
                  <td>{dato.Value}</td>
                  <td>{dato.Timestamp}</td>
                  <td>{dato.Axis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
