import IconComponent from "./IconComponent";

export default function AlertCard({ alert }) {
  return (
      <article className="flex flex-col bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200 ease-in-out">
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
            <IconComponent icon="alert" className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-800">Alerta</h3>
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium"><strong>Tipo:</strong></span> {alert.errorType}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium"><strong>Fecha:</strong></span> {new Date(alert.timestamp).toUTCString()}
          </p>
        </div>
      </article>
    );
}