import React from "react";
import { Ruler, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const SizeGuidePage: React.FC = () => {
  const contentRef = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div
        ref={contentRef}
        className="container mx-auto px-4 max-w-4xl scroll-animate"
      >
        <Link
          to="/tienda"
          className="inline-flex items-center text-gray-600 hover:text-[#D8A7B1] mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver a la tienda
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-12">
            <div className="bg-[#D8A7B1] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Ruler className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Guía de Tallas</h1>
            <p className="text-xl text-gray-600">
              Encuentra tu calce perfecto siguiendo estos simples pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                ¿Cómo medir tu jean perfecto?
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-[#D8A7B1] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Toma tu jean favorito
                    </h3>
                    <p className="text-gray-600">
                      Busca el jean que mejor te queda y tenlo a mano para
                      medir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#D8A7B1] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Mide la cintura</h3>
                    <p className="text-gray-600">
                      Con el jean cerrado, mide de extremo a extremo la parte
                      superior y multiplica x2.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#D8A7B1] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Mide la cadera</h3>
                    <p className="text-gray-600">
                      Mide la parte más ancha del jean (generalmente 20cm abajo
                      de la cintura) y multiplica x2.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#D8A7B1] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Compara con nuestra tabla
                    </h3>
                    <p className="text-gray-600">
                      Usa las medidas que obtuviste para encontrar tu talle en
                      la tabla de la derecha.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Tabla de Tallas</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-[#D8A7B1] text-white">
                      <th className="border border-gray-300 p-3 text-left">
                        Talle
                      </th>
                      <th className="border border-gray-300 p-3 text-left">
                        Cintura (cm)
                      </th>
                      <th className="border border-gray-300 p-3 text-left">
                        Cadera (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">
                        36
                      </td>
                      <td className="border border-gray-300 p-3">70</td>
                      <td className="border border-gray-300 p-3">98</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">
                        38
                      </td>
                      <td className="border border-gray-300 p-3">74</td>
                      <td className="border border-gray-300 p-3">102</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">
                        40
                      </td>
                      <td className="border border-gray-300 p-3">78</td>
                      <td className="border border-gray-300 p-3">106</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">
                        42
                      </td>
                      <td className="border border-gray-300 p-3">82</td>
                      <td className="border border-gray-300 p-3">110</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">
                        44
                      </td>
                      <td className="border border-gray-300 p-3">86</td>
                      <td className="border border-gray-300 p-3">114</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Tip:</strong> Si tus medidas están entre dos tallas,
                  te recomendamos elegir la talla mayor para mayor comodidad.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">¿Sigues con dudas?</h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo está aquí para ayudarte a encontrar tu talle
              perfecto
            </p>
            <a
              href="https://wa.me/1234567890"
              className="inline-block bg-[#D8A7B1] hover:bg-[#c69ba5] text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
