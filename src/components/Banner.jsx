import { useState, useEffect } from "react";
import './Banner.css'; // Importar el archivo CSS personalizado

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('/banners.json')
      .then(response => response.json())
      .then(data => setBanners(data))
      .catch(error => console.error('Error fetching banners:', error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) {
    return <div>Loading...</div>;
  }

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