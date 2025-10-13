
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { DollarSign, TrendingUp, Calculator, PieChart, Target, Eye, Info, Plus, Trash2 } from 'lucide-react';

export const FinancialPlanningForm = ({ project, financialPlan, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    pricing_strategy: '',
    cost_structure: {
      fixed_costs: [],
      variable_costs: [],
      one_time_costs: []
    },
    revenue_forecasts: {
      monthly_projections: [],
      revenue_streams: [],
      growth_assumptions: ''
    },
    profit_margins: {
      gross_margin: '',
      net_margin: '',
      break_even_point: '',
      margin_analysis: ''
    },
    break_even_analysis: '',
  });
  const [loading, setLoading] = useState(false);
  const [showExamples, setShowExamples] = useState({});

  useEffect(() => {
    if (financialPlan) {
      setFormData({
        title: financialPlan.title || '',
        pricing_strategy: financialPlan.pricing_strategy || '',
        cost_structure: financialPlan.cost_structure || {
          fixed_costs: [],
          variable_costs: [],
          one_time_costs: []
        },
        revenue_forecasts: financialPlan.revenue_forecasts || {
          monthly_projections: [],
          revenue_streams: [],
          growth_assumptions: ''
        },
        profit_margins: financialPlan.profit_margins || {
          gross_margin: '',
          net_margin: '',
          break_even_point: '',
          margin_analysis: ''
        },
        break_even_analysis: financialPlan.break_even_analysis || '',
      });
    }
  }, [financialPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const addCostItem = (type) => {
    const newItem = { name: '', amount: '', frequency: 'monthly', description: '' };
    setFormData((prev) => ({
      ...prev,
      cost_structure: {
        ...prev.cost_structure,
        [type]: [...prev.cost_structure[type], newItem]
      }
    }));
  };

  const removeCostItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      cost_structure: {
        ...prev.cost_structure,
        [type]: prev.cost_structure[type].filter((_, i) => i !== index)
      }
    }));
  };

  const updateCostItem = (type, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      cost_structure: {
        ...prev.cost_structure,
        [type]: prev.cost_structure[type].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addRevenueStream = () => {
    const newStream = { name: '', pricing_model: '', projected_revenue: '', description: '' };
    setFormData((prev) => ({
      ...prev,
      revenue_forecasts: {
        ...prev.revenue_forecasts,
        revenue_streams: [...prev.revenue_forecasts.revenue_streams, newStream]
      }
    }));
  };

  const removeRevenueStream = (index) => {
    setFormData((prev) => ({
      ...prev,
      revenue_forecasts: {
        ...prev.revenue_forecasts,
        revenue_streams: prev.revenue_forecasts.revenue_streams.filter((_, i) => i !== index)
      }
    }));
  };

  const updateRevenueStream = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      revenue_forecasts: {
        ...prev.revenue_forecasts,
        revenue_streams: prev.revenue_forecasts.revenue_streams.map((stream, i) =>
          i === index ? { ...stream, [field]: value } : stream
        )
      }
    }));
  };

  const toggleExample = (field) => {
    setShowExamples(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      project_id: project.id,
    };

    let error;
    if (financialPlan) {
      ({ error } = await supabase.from('financial_planning').update(dataToSubmit).eq('id', financialPlan.id));
    } else {
      ({ error } = await supabase.from('financial_planning').insert(dataToSubmit));
    }

    if (error) {
      console.error('Error saving financial plan:', error);
      alert('Failed to save financial plan.');
    } else {
      onSubmit();
    }

    setLoading(false);
  };

  const renderField = (name, label, icon, placeholder, example, rows = 5) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-700">
          {icon}
          <span className="ml-2">{label}</span>
        </label>
        <button
          type="button"
          onClick={() => toggleExample(name)}
          className="flex items-center text-xs text-green-600 hover:text-green-800"
        >
          <Eye className="w-3 h-3 mr-1" />
          {showExamples[name] ? 'Hide' : 'Show'} Example
        </button>
      </div>
      
      {showExamples[name] && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-green-700">
              <strong>Example:</strong>
              <p className="mt-1 italic">{example}</p>
            </div>
          </div>
        </div>
      )}
      
      <textarea
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
      />
    </div>
  );

  const renderCostSection = (type, title, icon) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center font-medium text-gray-800">
          {icon}
          <span className="ml-2">{title}</span>
        </h4>
        <button
          type="button"
          onClick={() => addCostItem(type)}
          className="flex items-center px-2 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Item
        </button>
      </div>
      
      {formData.cost_structure[type].map((item, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
            <button
              type="button"
              onClick={() => removeCostItem(type, index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Cost name"
              value={item.name || ''}
              onChange={(e) => updateCostItem(type, index, 'name', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Amount ($)"
              value={item.amount || ''}
              onChange={(e) => updateCostItem(type, index, 'amount', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
            <select
              value={item.frequency || 'monthly'}
              onChange={(e) => updateCostItem(type, index, 'frequency', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
              <option value="one-time">One-time</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Description"
            value={item.description || ''}
            onChange={(e) => updateCostItem(type, index, 'description', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <DollarSign className="w-6 h-6 mr-2" />
          {financialPlan ? 'Edit' : 'New'} Financial Plan
        </h3>
        <p className="text-green-100 text-sm mt-1">
          Plan your pricing, costs, and revenue projections
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Financial Plan Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., 2024 Financial Plan - SaaS Platform"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
        </div>

        {renderField(
          'pricing_strategy',
          'Pricing Strategy',
          <Target className="w-4 h-4" />,
          'Define your pricing model, tiers, and strategy rationale...',
          'Freemium model: Free tier (up to 5 projects), Pro ($15/month, unlimited projects + advanced features), Team ($45/month for 5 users), Enterprise (custom pricing). Price anchored against Asana ($10.99) and Monday.com ($8-16). Value-based pricing focusing on time savings and ROI.'
        )}

        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Cost Structure
          </h4>
          
          {renderCostSection('fixed_costs', 'Fixed Costs', <DollarSign className="w-4 h-4" />)}
          {renderCostSection('variable_costs', 'Variable Costs', <TrendingUp className="w-4 h-4" />)}
          {renderCostSection('one_time_costs', 'One-time Costs', <Target className="w-4 h-4" />)}
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Revenue Forecasting
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-700">Revenue Streams</label>
              <button
                type="button"
                onClick={addRevenueStream}
                className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Stream
              </button>
            </div>

            {formData.revenue_forecasts.revenue_streams.map((stream, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Revenue Stream {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeRevenueStream(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Stream name"
                    value={stream.name || ''}
                    onChange={(e) => updateRevenueStream(index, 'name', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Pricing model"
                    value={stream.pricing_model || ''}
                    onChange={(e) => updateRevenueStream(index, 'pricing_model', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Projected revenue ($)"
                    value={stream.projected_revenue || ''}
                    onChange={(e) => updateRevenueStream(index, 'projected_revenue', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description and assumptions"
                  value={stream.description || ''}
                  onChange={(e) => updateRevenueStream(index, 'description', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Growth Assumptions</label>
              <textarea
                value={formData.revenue_forecasts.growth_assumptions}
                onChange={(e) => handleNestedChange('revenue_forecasts', 'growth_assumptions', e.target.value)}
                placeholder="Describe your growth assumptions, seasonality, market factors..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Profit Margins & Analysis
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gross Margin (%)</label>
              <input
                type="number"
                value={formData.profit_margins.gross_margin}
                onChange={(e) => handleNestedChange('profit_margins', 'gross_margin', e.target.value)}
                placeholder="e.g., 75"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Net Margin (%)</label>
              <input
                type="number"
                value={formData.profit_margins.net_margin}
                onChange={(e) => handleNestedChange('profit_margins', 'net_margin', e.target.value)}
                placeholder="e.g., 25"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Break-even Point</label>
              <input
                type="text"
                value={formData.profit_margins.break_even_point}
                onChange={(e) => handleNestedChange('profit_margins', 'break_even_point', e.target.value)}
                placeholder="e.g., 200 customers, Month 8"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Margin Analysis</label>
            <textarea
              value={formData.profit_margins.margin_analysis}
              onChange={(e) => handleNestedChange('profit_margins', 'margin_analysis', e.target.value)}
              placeholder="Analyze your margin structure, compare to industry benchmarks..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {renderField(
          'break_even_analysis',
          'Break-Even Analysis',
          <Calculator className="w-4 h-4" />,
          'Detailed break-even analysis including scenarios and sensitivity analysis...',
          'Fixed costs: $15,000/month. Variable cost per customer: $2.50. Average revenue per customer: $22. Break-even = 15,000 ÷ (22 - 2.50) = 769 customers. At 20% monthly growth, break-even reached in month 7. Sensitivity: +/-10% in pricing changes break-even by 2 months.'
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Financial Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};
