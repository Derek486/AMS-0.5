import ReactApexChart from 'react-apexcharts'
import useData from "../../hooks/useData";
import { useEffect, useState } from 'react';

export default function Temperature({ motor }) {
  const [ data ] = useData({ type: 'temperatura', motor })
  const [ options, setOptions ] = useState({
    series: [
      {
        name: "Temperatura",
        data: []
      }
    ],
    chart: {
      height: 350,
      type: "line"
    },
    stroke: {
      width: 7,
      curve: "smooth"
    },
    xaxis: {
      type: "datetime",
      categories: []
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 1,
        gradientToColors: ["#00FF00", "#FFA500", "#FF0000"],
        stops: [0, 50, 100]
      }
    },
    markers: {
      size: 0
    },
    yaxis: {
      min: -10,
      max: 40,
      decimalsInFloat: 3,
      title: {
        text: "Temperatura"
      }
    },
  })

  useEffect(() => {
    const newData = data.map(({ value, timestamp }) => {
      return {
        x: new Date(timestamp).getTime(),
        y: value,
      };
    });
    console.log(newData);
    
    setOptions(prev => ({
      ...prev,
      series: [
        {
          name: "Temperatura",
          data: newData
        }
      ],
    }))
  }, [data])

  return (
    <>
      <ReactApexChart options={options} series={options.series} type="area" height={350} />
    </>
  )
}