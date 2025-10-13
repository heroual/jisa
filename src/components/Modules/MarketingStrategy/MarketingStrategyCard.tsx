
import React from 'react';
import { Megaphone, Target, Users, DollarSign, Calendar, Edit2, Trash2, Filter, TrendingUp } from 'lucide-react';

export const MarketingStrategyCard = ({ strategy, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const digitalChannels = strategy.marketing_channels?.digital_channels?.length || 0;
  const traditionalChannels = strategy.marketing_channels?.traditional_channels?.length || 0;
  const totalBudget = strategy.budget_allocation?.total_budget;
  const budgetAllocations = strategy.budget_allocation?.channel_allocation?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <Megaphone className="w-5 h-5 text-white" />
          <span className="text-xs text-purple-100 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(strategy.created_at)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{strategy.title}</h3>
        
        <div className="space-y-2 mb-4">
          {strategy.campaign_goals && (
            <div className="flex items-start">
              <Target className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">
                {strategy.campaign_goals.substring(0, 100)}...
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-gray-600">{digitalChannels} digital</span>
            </div>
            <div className="flex items-center">
              <Megaphone className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-gray-600">{traditionalChannels} traditional</span>
            </div>
          </div>
          
          {totalBudget && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-600 font-medium">{totalBudget}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {digitalChannels > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Digital
            </span>
          )}
          {traditionalChannels > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Traditional
            </span>
          )}
          {strategy.retention_tactics && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Retention
            </span>
          )}
          {budgetAllocations > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Budget Plan
            </span>
          )}
          {Object.keys(strategy.funnel_strategies || {}).some(key => strategy.funnel_strategies[key]) && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Funnel
            </span>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(strategy)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(strategy.id)}
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
