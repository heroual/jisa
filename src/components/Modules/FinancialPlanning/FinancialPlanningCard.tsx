
import React from 'react';
import { DollarSign, TrendingUp, Calculator, PieChart, Calendar, Edit2, Trash2, Target } from 'lucide-react';

export const FinancialPlanningCard = ({ plan, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const revenueStreams = plan.revenue_forecasts?.revenue_streams?.length || 0;
  const grossMargin = plan.profit_margins?.gross_margin;
  const netMargin = plan.profit_margins?.net_margin;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <DollarSign className="w-5 h-5 text-white" />
          <span className="text-xs text-green-100 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(plan.created_at)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{plan.title}</h3>
        
        <div className="space-y-2 mb-4">
          {plan.pricing_strategy && (
            <div className="flex items-start">
              <Target className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">
                {plan.pricing_strategy.substring(0, 100)}...
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {grossMargin && (
              <div className="flex items-center">
                <PieChart className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Gross: {grossMargin}%</span>
              </div>
            )}
            {netMargin && (
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-sm text-gray-600">Net: {netMargin}%</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <Calculator className="w-4 h-4 text-indigo-500 mr-2" />
            <span className="text-sm text-gray-600">
              {revenueStreams} revenue stream{revenueStreams !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {plan.pricing_strategy && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Pricing
            </span>
          )}
          {plan.break_even_analysis && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Break-even
            </span>
          )}
          {plan.cost_structure?.fixed_costs?.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Cost Structure
            </span>
          )}
          {revenueStreams > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Revenue Streams
            </span>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(plan)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(plan.id)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
