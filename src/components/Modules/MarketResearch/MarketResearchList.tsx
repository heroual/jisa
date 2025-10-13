
import React from 'react';
import { MarketResearchCard } from './MarketResearchCard';

export const MarketResearchList = ({ researches, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (researches.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700">No market research entries found.</h3>
        <p className="text-sm text-gray-500">Get started by creating a new research entry.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {researches.map((research) => (
        <MarketResearchCard key={research.id} research={research} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
