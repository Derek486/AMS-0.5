import ReactApexChart from 'react-apexcharts'
import useData from "../../hooks/useData";
import { useEffect, useState } from 'react';

export default function Acceleration({ motor }) {
  const [ data ] = useData({ type: 'aceleracion', motor })
  const [options, setOptions] = useState({
    series: [{
      name: "RMS",
      data: []
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
        type: 'datetime',
        labels: {
          format: 'HH:mm:ss'
        },
        title: {
          text: 'Tiempo'
        }
      },
      yaxis: {
        title: {
          text: 'Magnitud'
        },
        decimalsInFloat: 3
      },
    },
  })

  useEffect(() => {
    const newData = data.map(({ value, timestamp }) => ({
      x: timestamp,
      y: value
    }));
    
    setOptions(prev => ({
      ...prev,
      series: [
        {
          name: 'RMS',
          data: newData
        }
      ]
    }));
  }, [data])

  return (
    <>
      <ReactApexChart options={options.options} series={options.series} type="area" height={350} />
    </>
  )
}