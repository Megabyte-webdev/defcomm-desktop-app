import React from 'react'
import { FaMicrophone } from 'react-icons/fa6'
import military from "../../assets/military.png";
import { MdMarkChatUnread } from "react-icons/md";
import AudioVisualizer from "../charts/AudioVisualizer";
import { FiPlus } from 'react-icons/fi';
const CommInterface = () => {
    return (

        <div
            className="bg-oliveLight min-h-full w-full min-w-[320px] max-w-[400px] py-4 px-4 text-white flex flex-col items-center"
            style={{
                background: `linear-gradient(to bottom, #36460A 10%, #000000 65%)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}>

            {/* Emergency Room Header */}
            <div className="bg-oliveHover w-full mt-6 px-3 py-1 rounded-3xl">
                <div className="flex items-center justify-between bg-lightGreen text-black p-2 rounded-md">
                    <span className="font-semibold flex items-center gap-2"><MdMarkChatUnread size={20} /> Emergency Room</span>
                    <span>0.00</span>
                </div>
            </div>
            <p className="self-start text-sm mt-4 flex items-center gap-2">
                <img src={military} alt="military" className="w-8 h-8 p-1 bg-white rounded-full" />
                <sup>10:00 GMT 08-12-2025</sup>
            </p>

            <div className="self-stretch flex justify-end items-center gap-2 my-6">
                <div>
                    <p className="text-xs text-gray-400">SGT A176527DHS</p>
                    <p className="text-lg text-gray-500">Talked 00:30</p>
                </div>
                <figure className="w-24 h-32 rounded-3xl bg-gradient-to-b to-gray-400 from-oliveGreen text-xs font-medium flex justify-center p-2 py-4">
                    <p>A176527DHS</p>
                </figure>
            </div>

            <div className="my-4 mx-auto">
                <AudioVisualizer progress={40} width={200} height={60} />
            </div>

            <div className="flex items-center gap-3 my-4">
                {/* Participants */}
                <div className="mt-3 relative flex justify-center w-[77px]">
                    {/* Host Participant */}
                    <div className="w-10 h-10 bg-green-600 rounded-full border border-oliveHover absolute bottom-0 right-0"></div>

                    {/* Top Participant */}
                    <div className="w-9 h-9 bg-gray-600 rounded-full border border-gray-400 absolute bottom-3 left-0"></div>
                    
                    {/* Bottom Participant */}
                    <div className="w-9 h-9 bg-gray-400 rounded-full border border-gray-400 absolute top-0"></div>
                    {/* more icon */}
                    <div className="w-8 h-8 bg-gray-300 flex items-center justify-center text-black rounded-full border border-gray-400 absolute -bottom-5 left-3">
                        <FiPlus size={12} />
                    </div>
                </div>

                <div>
                    <p className="text-sm mt-1">Emergency Situation Room</p>
                    <p className="text-xs text-gray-400">+ 70 Live *************</p>
                </div>

            </div>
            {/* Mic Button */}
            <button className="mt-6 bg-red-600 p-4 rounded-full">
                <FaMicrophone size={30} />
            </button>
            <p className="text-xs mt-2">Press & hold to talk</p>

        </div>

    )
}

export default CommInterface
