import { useState, useEffect } from "react";
import banners from "../data/banners.json";
import './Banner.css'; // Importar el archivo CSS personalizado

const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-container">
      <img 
        src={banners[index].image} 
        alt={banners[index].alt} 
        className="banner-image"
      />
    </div>
  );
};

export default Banner;