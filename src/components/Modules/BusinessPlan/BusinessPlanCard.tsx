
import React from 'react';
import { FileText, Target, User, DollarSign, TrendingUp, Calendar, Edit2, Trash2, Award, Users } from 'lucide-react';

export const BusinessPlanCard = ({ businessPlan, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const milestones = businessPlan.milestones?.length || 0;
  const hasFinancialProjections = businessPlan.financial_projections && 
    (businessPlan.financial_projections.year_1?.revenue || 
     businessPlan.financial_projections.year_2?.revenue || 
     businessPlan.financial_projections.year_3?.revenue);

  const getFirstYearRevenue = () => {
    if (businessPlan.financial_projections?.year_1?.revenue) {
      return businessPlan.financial_projections.year_1.revenue;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <FileText className="w-5 h-5 text-white" />
          <span className="text-xs text-indigo-100 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(businessPlan.created_at)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{businessPlan.title}</h3>
        
        <div className="space-y-2 mb-4">
          {businessPlan.executive_summary && (
            <div className="flex items-start">
              <FileText className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">
                {businessPlan.executive_summary.substring(0, 100)}...
              </p>
            </div>
          )}
          
          {businessPlan.value_proposition && (
            <div className="flex items-start">
              <Target className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-1">
                {businessPlan.value_proposition.substring(0, 80)}...
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {getFirstYearRevenue() && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-gray-600 font-medium">{getFirstYearRevenue()}</span>
              </div>
            )}
            <div className="flex items-center">
              <Award className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm text-gray-600">{milestones} milestone{milestones !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {businessPlan.executive_summary && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Executive Summary
            </span>
          )}
          {businessPlan.value_proposition && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Value Prop
            </span>
          )}
          {businessPlan.revenue_model && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Revenue Model
            </span>
          )}
          {hasFinancialProjections && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Financials
            </span>
          )}
          {businessPlan.team_structure && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Team
            </span>
          )}
          {milestones > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Milestones
            </span>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(businessPlan)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(businessPlan.id)}
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
