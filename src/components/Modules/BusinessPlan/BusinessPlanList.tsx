
import React from 'react';
import { BusinessPlanCard } from './BusinessPlanCard';

export const BusinessPlanList = ({ businessPlans, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (businessPlans.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700">No business plans found.</h3>
        <p className="text-sm text-gray-500">Get started by creating a new business plan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businessPlans.map((plan) => (
        <BusinessPlanCard key={plan.id} businessPlan={plan} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
