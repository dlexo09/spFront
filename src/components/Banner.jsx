import { useState, useEffect } from "react";
import banners from "../data/banners.json";

const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64">
      <img 
        src={banners[index].image} 
        alt={banners[index].alt} 
        className="w-full h-full object-cover transition-opacity duration-500"
      />
    </div>
  );
};

export default Banner;
