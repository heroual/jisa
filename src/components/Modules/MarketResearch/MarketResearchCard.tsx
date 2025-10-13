
import React from 'react';
import { TrendingUp, Users, Target, BarChart3, Calendar, Edit2, Trash2 } from 'lucide-react';

export const MarketResearchCard = ({ research, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const segmentCount = research.target_segments?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <TrendingUp className="w-5 h-5 text-white" />
          <span className="text-xs text-blue-100 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(research.created_at)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{research.title}</h3>
        
        <div className="space-y-2 mb-4">
          {research.market_size_analysis && (
            <div className="flex items-start">
              <BarChart3 className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">
                {research.market_size_analysis.substring(0, 100)}...
              </p>
            </div>
          )}
          
          {research.positioning_strategy && (
            <div className="flex items-start">
              <Target className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">
                {research.positioning_strategy.substring(0, 100)}...
              </p>
            </div>
          )}
          
          <div className="flex items-center">
            <Users className="w-4 h-4 text-purple-500 mr-2" />
            <span className="text-sm text-gray-600">
              {segmentCount} target segment{segmentCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {research.market_trends_tracking && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Market Trends
            </span>
          )}
          {research.competitor_identification && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Competitors
            </span>
          )}
          {segmentCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Segments
            </span>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(research)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(research.id)}
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
