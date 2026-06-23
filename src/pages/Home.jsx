import HeroSection from "../components/HeroSection";
import Banner from "../components/Banner";
import AboutContent from "../components/AboutContent";
import Swiper2 from "../components/Swiper2";
import SobreNosotrosSection from "../components/SobreNosotrosSection";
import AliadosTecnologia from "../components/AliadosTecnologia";
import CtaDudas from "../components/CtaDudas";




const Home = () => {
  return (
    <div>
      <HeroSection />
      <Swiper2 />
      <SobreNosotrosSection />
      <AliadosTecnologia />
      <CtaDudas />
      {/* <AboutContent /> */}
      {/* <Banner /> */}
      

      {/* <section className="p-6 text-center">
        <h2 className="text-2xl font-bold">Bienvenido a Siscoprint</h2>
        <p>Servicios de impresión y diseño gráfico</p>
      </section> */}
    </div>
  );
};

export default Home;
