import React from 'react';
import WhatsAppLogo from '../assets/whatsapp-logo.png'; // Added import for custom logo

const WhatsAppButton: React.FC<{ message?: string }> = ({ message: propMessage }) => {
  const phoneNumber = '5493541374915'; 
  const defaultMessage = 'Hola tengo una duda sobre el talle';
  const finalMessage = propMessage || defaultMessage;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <img src={WhatsAppLogo} alt="WhatsApp Logo" style={{ height: '28px', width: '28px' }} /> {/* Replaced icon with image */}
    </a>
  );
};

export default WhatsAppButton;