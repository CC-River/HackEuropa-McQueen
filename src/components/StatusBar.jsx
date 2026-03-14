export default function StatusBar({vehicles,alerts,connected}){

  return(

    <div className="flex justify-between bg-gray-900 p-4 border-b border-gray-700">

      <div>
        Vehicles: {Object.keys(vehicles).length}
      </div>

      <div>
        Alerts: {alerts.length}
      </div>

      <div>
        Network:
        <span className={connected ? "text-green-500":"text-red-500"}>
          {connected ? " Online":" Offline"}
        </span>
      </div>

    </div>

  )
}