import { useNavigate } from 'react-router-dom'
import { MdQueueMusic, MdMoreVert } from "react-icons/md";
import { LuAudioLines } from "react-icons/lu";
const calls = [
  { title: "Opps. 14 - Weapon Tracking", time: "32:40" },
  { title: "Opps. 15 - Special Ops", time: "45:14" },
];

function RecentCalls() {
  const navigate= useNavigate()
  return (
    <div className="p-2">
      <div className="font-medium flex items-center justify-between gap-2">
        <h2 className="text-lg font-medium flex items-center space-x-2">
          <MdQueueMusic size={20} className="text-green-400" />
          <span>Recently</span>
        </h2>
        <MdMoreVert size={20} className="text-gray-400 cursor-pointer ml-auto" />
      </div>
      {calls?.map((call, index) => (
        <div onClick={()=>navigate("/dashboard/comm")} key={index} className="text-sm flex gap-2 items-center mt-2 bg-gray-800 text-white even:text-gray-900 even:bg-oliveGreen min-h-[70px] p-2">
          <figure className="w-12 h-12 rounded-full bg-gray-50 cursor-pointer">

          </figure>
          <section className="flex flex-col justify-center p-2">
            <p className="font-semibold truncate">{call?.title}</p>
            <span className="font-medium mt-1 opacity-50 truncate">CAPKA7C6612 - XXXXXXXX</span>
          </section>
          <section className="flex flex-col items-end ml-auto gap-2">
            <LuAudioLines className="size-4 md:size-6" />
            <span className="font-semibold">{call.time}</span>
          </section>
        </div>
      ))}
    </div>
  );
}
export default RecentCalls;
