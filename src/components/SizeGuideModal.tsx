import React from "react";
import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  onClose: () => void;
}

const sizeData = [
  { size: "36", waist: "70-74 cm", hip: "96-100 cm" },
  { size: "38", waist: "74-78 cm", hip: "100-104 cm" },
  { size: "40", waist: "78-82 cm", hip: "104-108 cm" },
  { size: "42", waist: "82-86 cm", hip: "108-112 cm" },
  { size: "44", waist: "86-90 cm", hip: "112-116 cm" },
];

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-lg w-full relative transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <Ruler size={24} className="text-brand-pink" />
          <h3 className="text-2xl font-bold">Guía de Talles</h3>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Te recomendamos medir un jean que te quede bien y compararlo con
          nuestra tabla. Las medidas son aproximadas y pueden variar levemente.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 font-semibold text-sm border-b">Talle</th>
                <th className="p-3 font-semibold text-sm border-b">Cintura</th>
                <th className="p-3 font-semibold text-sm border-b">Cadera</th>
              </tr>
            </thead>
            <tbody>
              {sizeData.map((row) => (
                <tr key={row.size} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-medium">
                    {row.size}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700">
                    {row.waist}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700">
                    {row.hip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <b>Tip:</b> Si estás entre dos talles, te recomendamos elegir el más
          grande para un calce más cómodo y relajado.
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
