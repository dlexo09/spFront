import Banner from "../components/Banner";

const Home = () => {
  return (
    <div>
      <Banner />
      <section className="p-6 text-center">
        <h2 className="text-2xl font-bold">Bienvenido a Siscoprint</h2>
        <p>Servicios de impresión y diseño gráfico</p>
      </section>
    </div>
  );
};

export default Home;
