import React from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  onClose: () => void;
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-lg w-full relative"
        onClick={e => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold mb-4">¿Cómo medir tu jean?</h3>
        <p className="text-gray-600 mb-4">
          Usa un jean que te quede perfecto y mídela sobre una superficie plana para comparar con nuestras medidas.
        </p>
        <img 
          src="https://i.ibb.co/6rC3h6B/how-to-measure.png" // He subido una imagen de ejemplo. Reemplázala con la tuya.
          alt="Diagrama de cómo medir un jean" 
          className="w-full h-auto rounded"
        />
      </div>
    </div>
  );
};

export default SizeGuideModal;