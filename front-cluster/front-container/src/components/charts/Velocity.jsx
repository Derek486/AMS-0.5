import ReactApexChart from 'react-apexcharts';
import useData from "../../hooks/useData";
import { useEffect, useState } from 'react';

export default function Velocity({ motor }) {
  const [data] = useData({ type: 'velocidad', motor });
  const [options, setOptions] = useState({
    series: [
      {
        name: 'Magnitud',
        data: []
      }
    ],
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false
      }
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
    dataLabels: {
      enabled: false
    }
  });

  useEffect(() => {
    const newData = data.map(({ value, timestamp }) => ({
      x: timestamp,
      y: value
    }));
    
    setOptions(prev => ({
      ...prev,
      series: [
        {
          name: 'Magnitud',
          data: newData
        }
      ]
    }));
  }, [data]);

  return (
    <ReactApexChart options={options} series={options.series} type="area" height={350} />
  );
}
