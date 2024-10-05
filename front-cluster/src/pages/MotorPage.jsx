import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './MotorStyles.css'

export function MotorPage() {
  const { id } = useParams();
  const [datos, setDatos] = useState({ velocidad: [], temperatura: [], aceleracion: [] });

  useEffect(() => {
    const datosSimulados = [
      { IdMotor: id, Value: '1200', Timestamp: '2024-10-01 12:00', Axis: 'X', Medicion: 'V' },
      { IdMotor: id, Value: '1000', Timestamp: '2024-10-01 12:05', Axis: 'Y', Medicion: 'A' },
      { IdMotor: id, Value: '75', Timestamp: '2024-10-01 12:10', Axis: 'Z', Medicion: 'T' },
    ];

    const velocidad = datosSimulados.filter(d => d.Medicion === 'V');
    const temperatura = datosSimulados.filter(d => d.Medicion === 'T');
    const aceleracion = datosSimulados.filter(d => d.Medicion === 'A');

    setDatos({ velocidad, temperatura, aceleracion });
  }, [id]);

  return (
    <div className="motor-wrapper">
      <h1 className="motor-title">Motor {id}</h1>
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
