import React from 'react';
import { Product } from '../types';
import { Ruler, Sparkles, Shirt } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | undefined }> = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="text-gris-oscuro/80 mt-0.5">{icon}</div>
      <div>
        <span className="font-bold">{label}:</span> {value}
      </div>
    </div>
  );
};

const MeasurementsTable: React.FC<{ measurements: Product['measurements'] }> = ({ measurements }) => {
  if (!measurements) return null;
  return (
    <div className="mt-2 text-sm">
      <p className="font-bold mb-1">Medidas en plano:</p>
      <ul className="list-disc list-inside pl-2">
        {measurements.cintura && <li>Cintura (de lado a lado): {measurements.cintura}cm</li>}
        {measurements.cadera && <li>Cadera: {measurements.cadera}cm</li>}
        {measurements.largo && <li>Largo: {measurements.largo}cm</li>}
        {measurements.tiro && <li>Tiro: {measurements.tiro}cm</li>}
      </ul>
    </div>
  );
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const hasDetails = product.measurements;

  if (!hasDetails) return null;

  return (
    <div className="mt-8 py-6 border-y border-arena/50 space-y-4">
      {product.measurements && (
        <div className="flex items-start gap-3 text-sm">
          <div className="text-gris-oscuro/80 mt-0.5"><Ruler size={18} /></div>
          <MeasurementsTable measurements={product.measurements} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
