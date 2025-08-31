import React from 'react';

const AnnouncementBar: React.FC = () => {
  const MarqueeContent = () => (
    <div className="flex-shrink-0 flex items-center whitespace-nowrap">
      <span className="mx-16">A PARTIR DE $35.000 ENVÍO GRATIS</span>
      <span className="text-white">❀</span>
      <span className="mx-16">3 CUOTAS SIN INTERÉS</span>
      <span className="text-white">❀</span>
    </div>
  );

  return (
    <div className="bg-brand-pink text-white py-2.5 overflow-hidden font-poppins text-sm font-medium tracking-wider">
      <div className="flex animate-marquee-ltr">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
};

export default AnnouncementBar;