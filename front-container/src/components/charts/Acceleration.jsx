import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import ReactApexChart from 'react-apexcharts'

export default function Acceleration({ motor, metricsMode, metricOpen, handlerOpen }) {
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
      {metricsMode ? (
        <Dialog open={metricOpen} className="!min-w-0 !w-auto" handler={handlerOpen}>
          <DialogHeader>
            <p className="font-inter text-lg text-center mx-auto">Acceleration RMS</p>
          </DialogHeader>
          <DialogBody>
            <ReactApexChart options={options.options} series={options.series} type="area" height={350} />
          </DialogBody>
        </Dialog>
      ) : null}
    </>
  )
}