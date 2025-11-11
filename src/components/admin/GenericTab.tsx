import React from 'react';

interface GenericTabProps {
  title: string;
  icon: React.ElementType;
}

export const GenericTab: React.FC<GenericTabProps> = ({ title, icon: Icon }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <Icon size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600">Esta sección está en construcción.</p>
    </div>
  </div>
);