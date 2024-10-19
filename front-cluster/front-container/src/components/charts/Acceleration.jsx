import ReactApexChart from 'react-apexcharts'
import useData from "../../hooks/useData";

export default function Acceleration({ motor }) {
  const [ data ] = useData({ type: 'aceleracion', motor })

  const options = {
    series: [{
      name: "RMS",
      data: [12, 34, 22, 45, 30, 60, 75, 85, 100]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          tools: {
            download: false
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
      }
    },
  };

  return (
    <>
      <ReactApexChart options={options.options} series={options.series} type="area" height={350} />
    </>
  )
}