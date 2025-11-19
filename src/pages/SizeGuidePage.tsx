import React from "react";
import { Ruler, ArrowLeft, Heart, Scale } from "lucide-react";
import WhatsAppLogo from '../assets/whatsapp-logo.png';
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
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver a la tienda
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="bg-gray-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Ruler className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold mb-4">¡Encontrá tu Talle Ideal!</h1>
            {/* Removed the introductory paragraph as requested */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                ¿Cómo tomar tus medidas?
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Cintura (¡donde usás el jean!)</h3>
                    <p className="text-gray-600 text-sm">
                      Medí la parte más estrecha de tu cintura natural. Después, medí dónde te gustaría que la cintura del jean se asiente (si es tiro alto, medio o bajo). ¡Que la cinta ajuste, pero sin apretar!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Cadera (la parte más linda)</h3>
                    <p className="text-gray-600 text-sm">
                      Parate derecha con los pies juntos. Medí alrededor de la parte más generosa de tus caderas y glúteos. Asegurate de que la cinta esté bien paralela al piso.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tiro Delantero (¡clave del calce!)</h3>
                    <p className="text-gray-600 text-sm">
                      Medí desde la costura de la entrepierna hacia arriba, hasta dónde querés que llegue la parte superior del jean en tu abdomen. ¡Esto hace la diferencia en cómo te queda!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Largo de Entrepierna (¡para que no arrastre!)</h3>
                    <p className="text-gray-600 text-sm">
                      Medí desde la costura de la entrepierna hasta dónde deseás que termine el ruedo del jean en tu pierna. Podés tomar como referencia un jean tuyo que te quede perfecto.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Nuestra Tabla de Talles</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                        Talle
                      </th>
                      <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                        Cintura
                      </th>
                      <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                        Cadera
                      </th>
                      <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                        Tiro
                      </th>
                      <th className="border border-gray-300 p-2 text-left text-xs sm:text-sm">
                        Largo Entrepierna
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 font-medium text-xs sm:text-sm">
                        36
                      </td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">68-72</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">94-98</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">28-30</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">74-78</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 font-medium text-xs sm:text-sm">
                        38
                      </td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">72-76</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">98-102</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">29-31</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">75-79</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 font-medium text-xs sm:text-sm">
                        40
                      </td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">76-80</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">102-106</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">30-32</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">76-80</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">
                        42
                      </td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">80-84</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">106-110</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">31-33</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">77-81</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">
                        44
                      </td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">84-88</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">110-114</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">32-34</td>
                      <td className="border border-gray-300 p-2 text-xs sm:text-sm">78-82</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <Heart className="inline mr-2 text-gray-500" size={16} />
                  <strong>¡Dato importante!:</strong> Si tus medidas están entre dos tallas,
                  siempre te recomendamos elegir la más grande para mayor comodidad, ¡especialmente en jeans sin mucho stretch!
                </p>
              </div>
            </div>
          </div>

          <div className="text-center bg-gray-100 p-8 rounded-lg mt-12">
            <h3 className="text-xl font-bold mb-4">¿Te quedó alguna duda?</h3>
            {/* Removed descriptive paragraph as requested */}
            <a
              href="https://wa.me/543541374915?text=Hola%20tengo%20una%20duda%20sobre%20el%20talle"
              className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              <img src={WhatsAppLogo} alt="WhatsApp Logo" className="inline mr-2" style={{ height: '18px', width: '18px' }} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;