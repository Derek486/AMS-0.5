import ReactApexChart from 'react-apexcharts'
import useData from "../../hooks/useData";
import { useEffect, useState } from 'react';

export default function Velocity({ motor }) {
  const [ data ] = useData({ type: 'velocidad', motor })
  const [ options, setOptions ] = useState({
    series: [
      {
        name: 'X Axis',
        data: []
      },
      {
        name: 'Y Axis',
        data: []
      },
      {
        name: 'Z Axis',
        data: []
      }
    ],
    chart: {
      type: "area",
      height: 350
    },
    xaxis: {
      type: 'numeric'
    },
    yaxis: {
      title: {
        text: 'Magnitud'
      },
      decimalsInFloat: 3,
    }
  })

  useEffect(() => {
    const newData = data.map(({ value, timestamp }) => {
      return {
        x: new Date(timestamp).getTime(),
        y: value,
      };
    });
    console.log(newData);
    
  }, [data])

  return (
    <>
      <ReactApexChart options={options} series={options.series} type="area" height={350} />
    </>
  )
}