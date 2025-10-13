
import React from 'react';
import { MarketingStrategyCard } from './MarketingStrategyCard';

export const MarketingStrategyList = ({ strategies, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (strategies.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700">No marketing strategies found.</h3>
        <p className="text-sm text-gray-500">Get started by creating a new marketing strategy.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {strategies.map((strategy) => (
        <MarketingStrategyCard key={strategy.id} strategy={strategy} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
