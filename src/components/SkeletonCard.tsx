import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="block text-left animate-pulse">
      <div className="overflow-hidden bg-gray-200">
        <div className="w-full aspect-[3/4] bg-gray-200"></div>
      </div>
      <div className="pt-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
