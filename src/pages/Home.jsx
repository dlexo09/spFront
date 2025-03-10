import Banner from "../components/Banner";
import About from "../components/About";
import Swiper2 from "../components/Swiper2";


const Home = () => {
  return (
    <div>
      <About />
      <Swiper2 />
      <Banner />
     
      
      <section className="p-6 text-center">
        <h2 className="text-2xl font-bold">Bienvenido a Siscoprint</h2>
        <p>Servicios de impresión y diseño gráfico</p>
      </section>
    </div>
  );
};

export default Home;
