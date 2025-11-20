import React from 'react';
import { Instagram } from 'lucide-react'; // Import Instagram icon
import { Testimonial } from '../../server/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-2 flex justify-between items-center">
        <p className="font-medium text-gray-900">{testimonial.customerName}</p>
        <Instagram className="w-4 h-4 text-gray-500" />
      </div>
      <p className="text-gray-700 italic">"{testimonial.content}"</p>
    </div>
  );
};

export default TestimonialCard;