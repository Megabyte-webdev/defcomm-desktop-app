import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { dashboardTabs } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { DashboardContext } from "../../context/DashboardContext";  // Import DashboardContext

function DashTabs() {
    const { state, dispatch } = useContext(DashboardContext);

    const tabOptions= state?.type === "CHAT" ? dashboardTabs?.filter(item=>item.view !== "chat" ) : dashboardTabs ;
    const navigate=useNavigate();
    return (
      <motion.ul className="flex gap-2 item-center w-full md:w-[80%] mt-10 ml-auto bg-gray-400/50 p-2 border-l-[5px] border-l-olive overflow-x-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {tabOptions?.map((item, idx) => (
        <motion.li key={idx} title={item?.title} onClick={() =>{dispatch({...item}); navigate(item?.route)}} className={`${state?.route !== item?.route ? "bg-oliveDark/70" : "bg-white"} cursor-pointer p-3 rounded-xl flex-shrink-0`} whileHover={{ scale: 1.1 }}>
          <img src={item?.img} alt="img" className={`${state?.route === item?.route && item?.view !== "call" && "filter invert"} w-8 h-8`} />
        </motion.li>
      ))}
    </motion.ul>

    )
}
export default DashTabs