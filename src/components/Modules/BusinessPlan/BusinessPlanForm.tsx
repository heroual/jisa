
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { FileText, Target, Users, DollarSign, TrendingUp, Calendar, Eye, Info, Plus, Trash2, Award } from 'lucide-react';

export const BusinessPlanForm = ({ project, businessPlan, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    executive_summary: '',
    value_proposition: '',
    target_audience: '',
    revenue_model: '',
    go_to_market_strategy: '',
    financial_projections: {
      year_1: { revenue: '', expenses: '', profit: '' },
      year_2: { revenue: '', expenses: '', profit: '' },
      year_3: { revenue: '', expenses: '', profit: '' },
      key_assumptions: ''
    },
    team_structure: '',
    milestones: []
  });
  const [loading, setLoading] = useState(false);
  const [showExamples, setShowExamples] = useState({});

  useEffect(() => {
    if (businessPlan) {
      setFormData({
        title: businessPlan.title || '',
        executive_summary: businessPlan.executive_summary || '',
        value_proposition: businessPlan.value_proposition || '',
        target_audience: businessPlan.target_audience || '',
        revenue_model: businessPlan.revenue_model || '',
        go_to_market_strategy: businessPlan.go_to_market_strategy || '',
        financial_projections: businessPlan.financial_projections || {
          year_1: { revenue: '', expenses: '', profit: '' },
          year_2: { revenue: '', expenses: '', profit: '' },
          year_3: { revenue: '', expenses: '', profit: '' },
          key_assumptions: ''
        },
        team_structure: businessPlan.team_structure || '',
        milestones: businessPlan.milestones || []
      });
    }
  }, [businessPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinancialChange = (year, field, value) => {
    setFormData((prev) => ({
      ...prev,
      financial_projections: {
        ...prev.financial_projections,
        [year]: {
          ...prev.financial_projections[year],
          [field]: value
        }
      }
    }));
  };

  const handleAssumptionsChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      financial_projections: {
        ...prev.financial_projections,
        key_assumptions: value
      }
    }));
  };

  const addMilestone = () => {
    const newMilestone = {
      title: '',
      description: '',
      target_date: '',
      success_criteria: '',
      status: 'planned'
    };
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const removeMilestone = (index) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const updateMilestone = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone
      )
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
    if (businessPlan) {
      ({ error } = await supabase.from('business_plans').update(dataToSubmit).eq('id', businessPlan.id));
    } else {
      ({ error } = await supabase.from('business_plans').insert(dataToSubmit));
    }

    if (error) {
      console.error('Error saving business plan:', error);
      alert('Failed to save business plan.');
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
          className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
        >
          <Eye className="w-3 h-3 mr-1" />
          {showExamples[name] ? 'Hide' : 'Show'} Example
        </button>
      </div>
      
      {showExamples[name] && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-md p-3">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-indigo-700">
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
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          {businessPlan ? 'Edit' : 'New'} Business Plan
        </h3>
        <p className="text-indigo-100 text-sm mt-1">
          Create a comprehensive business plan with financial projections and milestones
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Business Plan Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., TaskFlow Pro - Project Management Platform Business Plan 2024"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {renderField(
          'executive_summary',
          'Executive Summary',
          <FileText className="w-4 h-4" />,
          'Provide a concise overview of your business, its mission, and key success factors...',
          'TaskFlow Pro is a project management platform designed specifically for creative agencies. Founded in 2024, we address the unique challenges of managing creative projects with client collaboration, asset management, and approval workflows. Our platform combines traditional project management with creative-specific tools, targeting the $2.1B creative services market. With a proven team and $500K initial investment, we project $2M ARR by year 2 and profitability by month 18.'
        )}

        {renderField(
          'value_proposition',
          'Value Proposition',
          <Target className="w-4 h-4" />,
          'Clearly articulate the unique value your business provides to customers...',
          'TaskFlow Pro eliminates the chaos of creative project management by providing: 1) Integrated client collaboration portals that reduce email back-and-forth by 70%, 2) Built-in proofing and approval tools that accelerate project timelines by 40%, 3) Creative asset management with version control, 4) Time tracking designed for creative workflows, 5) One platform solution replacing 3-4 separate tools, saving agencies $200+/month per team member.'
        )}

        {renderField(
          'target_audience',
          'Target Audience',
          <Users className="w-4 h-4" />,
          'Define your primary customer segments and their characteristics...',
          'Primary: Creative agencies (10-50 employees) specializing in brand design, digital marketing, and content creation. Secondary: Freelance creative teams and in-house creative departments at mid-market companies. Characteristics: Currently using fragmented toolsets (Slack + Trello + Google Drive + email), spending 15+ hours/week on project administration, annual revenue $500K-$5M, tech-forward but not developer-focused.'
        )}

        {renderField(
          'revenue_model',
          'Revenue Model',
          <DollarSign className="w-4 h-4" />,
          'Explain how your business will generate revenue...',
          'SaaS subscription model: 1) Starter: $29/month (up to 5 users, basic features), 2) Professional: $89/month (up to 15 users, client portals, advanced reporting), 3) Agency: $199/month (unlimited users, white-label, API access). Additional revenue: Implementation services ($2,500), custom integrations ($5,000-$15,000), and premium support ($500/month). 95% revenue from subscriptions, 5% from services.'
        )}

        {renderField(
          'go_to_market_strategy',
          'Go-to-Market Strategy',
          <TrendingUp className="w-4 h-4" />,
          'Outline your strategy for reaching and acquiring customers...',
          'Phase 1 (Months 1-6): Content marketing + SEO targeting "creative project management" keywords, industry conference sponsorships, strategic partnerships with design tool vendors. Phase 2 (Months 7-12): Paid acquisition (Google Ads, LinkedIn), affiliate program with consultants, customer referral program. Phase 3 (Year 2+): Inside sales team, enterprise outbound, international expansion. Key channels: Inbound marketing (40%), partnerships (30%), paid acquisition (20%), referrals (10%).'
        )}

        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Financial Projections (3-Year)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['year_1', 'year_2', 'year_3'].map((year, index) => (
              <div key={year} className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h5 className="font-medium text-gray-800">Year {index + 1}</h5>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Revenue</label>
                    <input
                      type="text"
                      placeholder="e.g., $500,000"
                      value={formData.financial_projections[year]?.revenue || ''}
                      onChange={(e) => handleFinancialChange(year, 'revenue', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Expenses</label>
                    <input
                      type="text"
                      placeholder="e.g., $350,000"
                      value={formData.financial_projections[year]?.expenses || ''}
                      onChange={(e) => handleFinancialChange(year, 'expenses', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Net Profit</label>
                    <input
                      type="text"
                      placeholder="e.g., $150,000"
                      value={formData.financial_projections[year]?.profit || ''}
                      onChange={(e) => handleFinancialChange(year, 'profit', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Financial Assumptions</label>
            <textarea
              value={formData.financial_projections.key_assumptions}
              onChange={(e) => handleAssumptionsChange(e.target.value)}
              placeholder="List your key assumptions for the financial projections..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {renderField(
          'team_structure',
          'Team Structure & Key Personnel',
          <Users className="w-4 h-4" />,
          'Describe your team structure, key roles, and hiring plan...',
          'Founding team: CEO (Product/Strategy, 10+ years PM experience), CTO (Engineering, former senior dev at Asana), VP Marketing (Creative agency background, 8 years growth marketing). Year 1 hires: 2 full-stack developers, 1 UX designer, 1 customer success manager. Year 2 expansion: Sales director, 2 additional developers, content marketer. Advisory board: 3 agency owners, 1 former VP at Monday.com.'
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Key Milestones & Timeline
            </h4>
            <button
              type="button"
              onClick={addMilestone}
              className="flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Milestone
            </button>
          </div>

          {formData.milestones.length === 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No milestones defined yet</p>
              <p className="text-gray-400 text-sm">Click "Add Milestone" to define key business milestones</p>
            </div>
          )}

          {formData.milestones.map((milestone, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-800 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Milestone {index + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Milestone title"
                  value={milestone.title || ''}
                  onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Target date (e.g., Q2 2024)"
                  value={milestone.target_date || ''}
                  onChange={(e) => updateMilestone(index, 'target_date', e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={milestone.status || 'planned'}
                  onChange={(e) => updateMilestone(index, 'status', e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              
              <textarea
                placeholder="Description and context"
                value={milestone.description || ''}
                onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              
              <input
                type="text"
                placeholder="Success criteria (how you'll measure completion)"
                value={milestone.success_criteria || ''}
                onChange={(e) => updateMilestone(index, 'success_criteria', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
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
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Business Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};
