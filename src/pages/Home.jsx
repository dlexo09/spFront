import Banner from "../components/Banner";
import About from "../components/About";
import Swiper from "../components/Swiper";


const Home = () => {
  return (
    <div>
      <About />
      <Banner />
      <Swiper />
      
      <section className="p-6 text-center">
        <h2 className="text-2xl font-bold">Bienvenido a Siscoprint</h2>
        <p>Servicios de impresión y diseño gráfico</p>
      </section>
    </div>
  );
};

export default Home;
