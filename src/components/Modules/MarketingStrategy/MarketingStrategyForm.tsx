
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Target, Megaphone, Users, TrendingUp, DollarSign, Eye, Info, Plus, Trash2, Filter } from 'lucide-react';

export const MarketingStrategyForm = ({ project, marketingStrategy, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    marketing_channels: {
      digital_channels: [],
      traditional_channels: [],
      content_marketing: {
        strategy: '',
        content_types: [],
        publishing_schedule: ''
      }
    },
    campaign_goals: '',
    funnel_strategies: {
      awareness_stage: '',
      consideration_stage: '',
      decision_stage: '',
      retention_stage: ''
    },
    retention_tactics: '',
    budget_allocation: {
      total_budget: '',
      channel_allocation: [],
      timeline: 'monthly'
    },
  });
  const [loading, setLoading] = useState(false);
  const [showExamples, setShowExamples] = useState({});

  useEffect(() => {
    if (marketingStrategy) {
      setFormData({
        title: marketingStrategy.title || '',
        marketing_channels: marketingStrategy.marketing_channels || {
          digital_channels: [],
          traditional_channels: [],
          content_marketing: {
            strategy: '',
            content_types: [],
            publishing_schedule: ''
          }
        },
        campaign_goals: marketingStrategy.campaign_goals || '',
        funnel_strategies: marketingStrategy.funnel_strategies || {
          awareness_stage: '',
          consideration_stage: '',
          decision_stage: '',
          retention_stage: ''
        },
        retention_tactics: marketingStrategy.retention_tactics || '',
        budget_allocation: marketingStrategy.budget_allocation || {
          total_budget: '',
          channel_allocation: [],
          timeline: 'monthly'
        },
      });
    }
  }, [marketingStrategy]);

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

  const addChannel = (type) => {
    const newChannel = { name: '', budget: '', kpi: '', description: '' };
    setFormData((prev) => ({
      ...prev,
      marketing_channels: {
        ...prev.marketing_channels,
        [type]: [...prev.marketing_channels[type], newChannel]
      }
    }));
  };

  const removeChannel = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      marketing_channels: {
        ...prev.marketing_channels,
        [type]: prev.marketing_channels[type].filter((_, i) => i !== index)
      }
    }));
  };

  const updateChannel = (type, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      marketing_channels: {
        ...prev.marketing_channels,
        [type]: prev.marketing_channels[type].map((channel, i) =>
          i === index ? { ...channel, [field]: value } : channel
        )
      }
    }));
  };

  const addBudgetAllocation = () => {
    const newAllocation = { channel: '', amount: '', percentage: '', notes: '' };
    setFormData((prev) => ({
      ...prev,
      budget_allocation: {
        ...prev.budget_allocation,
        channel_allocation: [...prev.budget_allocation.channel_allocation, newAllocation]
      }
    }));
  };

  const removeBudgetAllocation = (index) => {
    setFormData((prev) => ({
      ...prev,
      budget_allocation: {
        ...prev.budget_allocation,
        channel_allocation: prev.budget_allocation.channel_allocation.filter((_, i) => i !== index)
      }
    }));
  };

  const updateBudgetAllocation = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      budget_allocation: {
        ...prev.budget_allocation,
        channel_allocation: prev.budget_allocation.channel_allocation.map((allocation, i) =>
          i === index ? { ...allocation, [field]: value } : allocation
        )
      }
    }));
  };

  const addContentType = () => {
    const contentTypes = [...(formData.marketing_channels.content_marketing.content_types || [])];
    contentTypes.push({ type: '', frequency: '', platform: '', objective: '' });
    handleNestedChange('marketing_channels', 'content_marketing', {
      ...formData.marketing_channels.content_marketing,
      content_types: contentTypes
    });
  };

  const removeContentType = (index) => {
    const contentTypes = formData.marketing_channels.content_marketing.content_types.filter((_, i) => i !== index);
    handleNestedChange('marketing_channels', 'content_marketing', {
      ...formData.marketing_channels.content_marketing,
      content_types: contentTypes
    });
  };

  const updateContentType = (index, field, value) => {
    const contentTypes = formData.marketing_channels.content_marketing.content_types.map((type, i) =>
      i === index ? { ...type, [field]: value } : type
    );
    handleNestedChange('marketing_channels', 'content_marketing', {
      ...formData.marketing_channels.content_marketing,
      content_types: contentTypes
    });
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
    if (marketingStrategy) {
      ({ error } = await supabase.from('marketing_strategy').update(dataToSubmit).eq('id', marketingStrategy.id));
    } else {
      ({ error } = await supabase.from('marketing_strategy').insert(dataToSubmit));
    }

    if (error) {
      console.error('Error saving marketing strategy:', error);
      alert('Failed to save marketing strategy.');
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
          className="flex items-center text-xs text-purple-600 hover:text-purple-800"
        >
          <Eye className="w-3 h-3 mr-1" />
          {showExamples[name] ? 'Hide' : 'Show'} Example
        </button>
      </div>
      
      {showExamples[name] && (
        <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-purple-700">
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
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
      />
    </div>
  );

  const renderChannelSection = (type, title, icon) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="flex items-center font-medium text-gray-800">
          {icon}
          <span className="ml-2">{title}</span>
        </h5>
        <button
          type="button"
          onClick={() => addChannel(type)}
          className="flex items-center px-2 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Channel
        </button>
      </div>
      
      {formData.marketing_channels[type].map((channel, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Channel {index + 1}</span>
            <button
              type="button"
              onClick={() => removeChannel(type, index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Channel name"
              value={channel.name || ''}
              onChange={(e) => updateChannel(type, index, 'name', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Budget allocation"
              value={channel.budget || ''}
              onChange={(e) => updateChannel(type, index, 'budget', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Key KPI"
              value={channel.kpi || ''}
              onChange={(e) => updateChannel(type, index, 'kpi', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <input
            type="text"
            placeholder="Strategy description"
            value={channel.description || ''}
            onChange={(e) => updateChannel(type, index, 'description', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Megaphone className="w-6 h-6 mr-2" />
          {marketingStrategy ? 'Edit' : 'New'} Marketing Strategy
        </h3>
        <p className="text-purple-100 text-sm mt-1">
          Define your marketing channels, campaigns, and growth tactics
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Marketing Strategy Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., 2024 Q1 Go-to-Market Strategy"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <Megaphone className="w-5 h-5 mr-2" />
            Marketing Channels
          </h4>
          
          {renderChannelSection('digital_channels', 'Digital Channels', <Target className="w-4 h-4" />)}
          {renderChannelSection('traditional_channels', 'Traditional Channels', <Megaphone className="w-4 h-4" />)}

          <div className="space-y-4">
            <h5 className="flex items-center font-medium text-gray-800">
              <Filter className="w-4 h-4 mr-2" />
              Content Marketing Strategy
            </h5>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Strategy</label>
              <textarea
                value={formData.marketing_channels.content_marketing.strategy}
                onChange={(e) => handleNestedChange('marketing_channels', 'content_marketing', {
                  ...formData.marketing_channels.content_marketing,
                  strategy: e.target.value
                })}
                placeholder="Describe your overall content marketing approach, themes, and messaging..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-700">Content Types</label>
                <button
                  type="button"
                  onClick={addContentType}
                  className="flex items-center px-2 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Content Type
                </button>
              </div>

              {(formData.marketing_channels.content_marketing.content_types || []).map((contentType, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Content Type {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeContentType(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Content type (e.g., Blog posts)"
                      value={contentType.type || ''}
                      onChange={(e) => updateContentType(index, 'type', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g., 2x per week)"
                      value={contentType.frequency || ''}
                      onChange={(e) => updateContentType(index, 'frequency', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Platform (e.g., Company blog)"
                      value={contentType.platform || ''}
                      onChange={(e) => updateContentType(index, 'platform', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Objective (e.g., SEO, thought leadership)"
                      value={contentType.objective || ''}
                      onChange={(e) => updateContentType(index, 'objective', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publishing Schedule</label>
              <input
                type="text"
                value={formData.marketing_channels.content_marketing.publishing_schedule}
                onChange={(e) => handleNestedChange('marketing_channels', 'content_marketing', {
                  ...formData.marketing_channels.content_marketing,
                  publishing_schedule: e.target.value
                })}
                placeholder="e.g., Mondays: Blog posts, Wednesdays: Social media, Fridays: Newsletter"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {renderField(
          'campaign_goals',
          'Campaign Goals & Objectives',
          <Target className="w-4 h-4" />,
          'Define specific, measurable campaign goals and success metrics...',
          'Primary goals: 1) Generate 500 qualified leads per month, 2) Achieve 15% conversion rate from lead to trial, 3) Increase brand awareness by 40% (measured by branded search volume), 4) Build email list to 10,000 subscribers, 5) Achieve $50 CAC (Customer Acquisition Cost) across all channels.'
        )}

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Marketing Funnel Strategies
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Awareness Stage</label>
              <textarea
                value={formData.funnel_strategies.awareness_stage}
                onChange={(e) => handleNestedChange('funnel_strategies', 'awareness_stage', e.target.value)}
                placeholder="Top-of-funnel strategies to create awareness..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consideration Stage</label>
              <textarea
                value={formData.funnel_strategies.consideration_stage}
                onChange={(e) => handleNestedChange('funnel_strategies', 'consideration_stage', e.target.value)}
                placeholder="Middle-of-funnel strategies to nurture interest..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Decision Stage</label>
              <textarea
                value={formData.funnel_strategies.decision_stage}
                onChange={(e) => handleNestedChange('funnel_strategies', 'decision_stage', e.target.value)}
                placeholder="Bottom-of-funnel strategies to drive conversions..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Stage</label>
              <textarea
                value={formData.funnel_strategies.retention_stage}
                onChange={(e) => handleNestedChange('funnel_strategies', 'retention_stage', e.target.value)}
                placeholder="Post-purchase strategies to retain customers..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {renderField(
          'retention_tactics',
          'Customer Retention Tactics',
          <Users className="w-4 h-4" />,
          'Describe your customer retention and loyalty strategies...',
          'Retention tactics: 1) Weekly product tips email series, 2) Customer success onboarding program (90-day journey), 3) Referral program with 20% discount, 4) Quarterly user feedback surveys with feature voting, 5) Advanced users community forum, 6) Loyalty tier system with premium features unlock.'
        )}

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Budget Allocation
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Marketing Budget</label>
              <input
                type="text"
                value={formData.budget_allocation.total_budget}
                onChange={(e) => handleNestedChange('budget_allocation', 'total_budget', e.target.value)}
                placeholder="e.g., $50,000 monthly"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Timeline</label>
              <select
                value={formData.budget_allocation.timeline}
                onChange={(e) => handleNestedChange('budget_allocation', 'timeline', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-700">Channel Budget Allocation</label>
              <button
                type="button"
                onClick={addBudgetAllocation}
                className="flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Allocation
              </button>
            </div>

            {formData.budget_allocation.channel_allocation.map((allocation, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Allocation {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeBudgetAllocation(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Channel name"
                    value={allocation.channel || ''}
                    onChange={(e) => updateBudgetAllocation(index, 'channel', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Amount ($)"
                    value={allocation.amount || ''}
                    onChange={(e) => updateBudgetAllocation(index, 'amount', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Percentage (%)"
                    value={allocation.percentage || ''}
                    onChange={(e) => updateBudgetAllocation(index, 'percentage', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Notes and rationale"
                  value={allocation.notes || ''}
                  onChange={(e) => updateBudgetAllocation(index, 'notes', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ))}
          </div>
        </div>

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
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Marketing Strategy'}
          </button>
        </div>
      </form>
    </div>
  );
};
