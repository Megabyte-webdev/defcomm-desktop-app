import React, { useState, useEffect } from 'react';
import top from "../assets/top.png";

const BackToTopButton = () => {
  const [isAtTop, setIsAtTop] = useState(true);

  const handleScroll = () => {
    setIsAtTop(window.scrollY < 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: isAtTop ? document.body.scrollHeight : 0, behavior: 'smooth' });
    setIsAtTop(!isAtTop);
  };

  return (
    <p onClick={scrollToTop} className="fixed bottom-[10%] right-[10%] cursor-pointer">
      <img
        src={top}
        alt="Back_to_top"
        className={`w-16 rounded-full transition-transform duration-500 ${!isAtTop ? 'rotate-0' : 'rotate-180'} hover:scale-110`}
      />
    </p>
  );
};

export default BackToTopButton;
