import React from "react";

// Reemplaza estos imports por los logos reales de tus marcas
import logo1 from "../assets/img/logos/epson.png";
import logo2 from "../assets/img/logos/canon.png";
import logo3 from "../assets/img/logos/gbc.png";
import logo4 from "../assets/img/logos/graphtec.png";
import logo5 from "../assets/img/logos/konica.png";
import logo6 from "../assets/img/logos/lsinc.png";
import logo7 from "../assets/img/logos/stratojet.png";

const logos = [
  { src: logo1, alt: "Epson" },
  { src: logo2, alt: "Canon" },
  { src: logo3, alt: "gbc" },
  { src: logo4, alt: "Graphtec" },
  { src: logo5, alt: "konica" },
  { src: logo6, alt: "Lsinc" },
  { src: logo7, alt: "Stratojet" },
];

const AliadosTecnologia = () => (
  <section className="w-full py-16 bg-white">
    <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-8">
      Nuestros aliados de tecnología
    </h2>
    <div className="overflow-x-auto">
      <div className="flex items-center justify-center gap-8 px-6 py-4">
        {logos.map((logo, idx) => (
          <div key={idx} className="flex-shrink-0 flex items-center justify-center h-24">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-16 md:h-20 w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
              style={{ maxWidth: 160 }}
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);


export default AliadosTecnologia;