export default function AlertFeed({alerts}){

  return(

    <div className="p-4 space-y-3 overflow-y-auto h-full">

      <h2 className="text-xl font-bold">
      Alerts
      </h2>

      {alerts.map((a,i)=>{

        let color="border-green-500";

        if(a.type==="COLLISION_WARNING") color="border-red-500";
        if(a.type==="BRAKE_HAZARD") color="border-orange-500";
        if(a.type==="SOS") color="border-red-900";

        return(

          <div
          key={i}
          className={`border-l-4 ${color} bg-gray-800 p-3`}
          >

            <div className="font-bold">
              {a.type}
            </div>

            <div>
              {a.message}
            </div>

            <div className="text-xs text-gray-400">
              {new Date(a.timestamp).toLocaleTimeString()}
            </div>

          </div>

        )

      })}

    </div>

  )

}