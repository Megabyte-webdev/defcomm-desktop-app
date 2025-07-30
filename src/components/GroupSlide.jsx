import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { AiOutlineShopping, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FaMusic, FaPlus, FaRegEnvelope } from 'react-icons/fa';
import { GiGooExplosion } from 'react-icons/gi';
import { GrTechnology } from 'react-icons/gr';
import { IoHomeOutline } from 'react-icons/io5';
import { LuNotebook } from 'react-icons/lu';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { TbArrowsSort } from 'react-icons/tb';
import { motion } from "framer-motion";
import mainLogo from "../assets/logo-icon.png";


const GroupSlide = ({ groups, setSelectedGroup, forceSingleView=false }) => {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);


    return (
        <div className="relative w-full mb-5">
            {/* Swiper Slider */}
            <Swiper
                spaceBetween={15}
                navigation={{
                    nextEl: '.next-btn',
                    prevEl: '.prev-btn'
                }}
                modules={[Navigation]}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                breakpoints={
                    forceSingleView
                        ? {
                              320: { slidesPerView: 1 }, // Mobile always 1
                              640: { slidesPerView: 2 },
                              }
                              : {
                              320: { slidesPerView: 1 }, // Mobile always 1
                              640: { slidesPerView: 2 },
                              1024: { slidesPerView: 3 },
                              
                          }
                        
                }
                className="p-3"
            >
                {groups?.map((group, index) => (
                    <SwiperSlide key={group.id}  onClick={() => setSelectedGroup(group)} className="w-[80%] md:min-w-60">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center gap-4 p-3 rounded-lg shadow-md my-2 bg-oliveLight/50 hover:bg-oliveLight cursor-pointer"
                           
                        >
                            <figure className="w-14 h-14 bg-gray-600 rounded-full overflow-hidden">
                                <img src={group.image || mainLogo} alt="Group" className="w-full h-full object-cover" />
                            </figure>
                            <section>
                                <p className="text-lg font-semibold">{group.group_name}</p>
                                <p className="text-sm text-gray-400">{group.company_name}</p>
                            </section>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-4">
                <button
                    className={`prev-btn p-2 border border-white rounded-full transition-all duration-300 ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'
                        }`}
                    disabled={isBeginning}
                >
                    <AiOutlineLeft size={20} />
                </button>
                <button
                    className={`next-btn p-2 border border-white rounded-full transition-all duration-300 ${isEnd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'
                        }`}
                    disabled={isEnd}
                >
                    <AiOutlineRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default GroupSlide;
