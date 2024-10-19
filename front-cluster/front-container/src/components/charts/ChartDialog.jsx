import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";

export default function ChartDialog({ title, handlerOpen, metricOpen, metricsMode, children }) {
  return (
    <>
      {metricsMode ? (
        <Dialog open={metricOpen} className="!min-w-0 !w-auto" handler={handlerOpen}>
          <DialogHeader>
            <p className="font-inter text-lg text-center mx-auto">{title}</p>
          </DialogHeader>
          <DialogBody>
            { children }
          </DialogBody>
        </Dialog>
      ) : null}
    </>
  )
}