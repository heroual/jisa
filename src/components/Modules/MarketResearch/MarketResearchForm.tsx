
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { TrendingUp, Users, Target, BarChart3, Eye, Info } from 'lucide-react';

export const MarketResearchForm = ({ project, marketResearch, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    market_size_analysis: '',
    market_trends_tracking: '',
    competitor_identification: '',
    positioning_strategy: '',
    target_segments: [],
  });
  const [loading, setLoading] = useState(false);
  const [showExamples, setShowExamples] = useState({});

  useEffect(() => {
    if (marketResearch) {
      setFormData({
        title: marketResearch.title || '',
        market_size_analysis: marketResearch.market_size_analysis || '',
        market_trends_tracking: marketResearch.market_trends_tracking || '',
        competitor_identification: marketResearch.competitor_identification || '',
        positioning_strategy: marketResearch.positioning_strategy || '',
        target_segments: marketResearch.target_segments || [],
      });
    }
  }, [marketResearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSegmentChange = (index, field, value) => {
    const newSegments = [...formData.target_segments];
    newSegments[index] = { ...newSegments[index], [field]: value };
    setFormData((prev) => ({ ...prev, target_segments: newSegments }));
  };

  const addSegment = () => {
    setFormData((prev) => ({
      ...prev,
      target_segments: [...prev.target_segments, { name: '', description: '', size: '', characteristics: '' }]
    }));
  };

  const removeSegment = (index) => {
    setFormData((prev) => ({
      ...prev,
      target_segments: prev.target_segments.filter((_, i) => i !== index)
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
    if (marketResearch) {
      ({ error } = await supabase.from('market_research').update(dataToSubmit).eq('id', marketResearch.id));
    } else {
      ({ error } = await supabase.from('market_research').insert(dataToSubmit));
    }

    if (error) {
      console.error('Error saving market research:', error);
      alert('Failed to save market research.');
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
          className="flex items-center text-xs text-blue-600 hover:text-blue-800"
        >
          <Eye className="w-3 h-3 mr-1" />
          {showExamples[name] ? 'Hide' : 'Show'} Example
        </button>
      </div>
      
      {showExamples[name] && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-700">
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
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          {marketResearch ? 'Edit' : 'New'} Market Research
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          Analyze your market opportunity and competitive landscape
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Research Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Q1 2024 SaaS Market Analysis"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {renderField(
          'market_size_analysis',
          'Market Size Analysis',
          <BarChart3 className="w-4 h-4" />,
          'Analyze total addressable market (TAM), serviceable addressable market (SAM), and serviceable obtainable market (SOM)...',
          'The global project management software market is valued at $5.37 billion in 2023, with a CAGR of 10.67%. Our TAM is $2.1B (SMB segment), SAM is $450M (under 500 employees), and our realistic SOM is $15M (3% market share in target regions).'
        )}

        {renderField(
          'market_trends_tracking',
          'Market Trends & Opportunities',
          <TrendingUp className="w-4 h-4" />,
          'Identify key market trends, growth drivers, and emerging opportunities...',
          'Key trends: 1) 73% increase in remote work driving collaboration tool adoption, 2) AI integration becoming standard (40% of tools adding AI features), 3) Integration-first approach (APIs and workflow automation), 4) Mobile-first design requirements increasing 60% YoY.'
        )}

        {renderField(
          'competitor_identification',
          'Competitive Analysis',
          <Target className="w-4 h-4" />,
          'Identify direct and indirect competitors, their strengths, weaknesses, and market positioning...',
          'Direct competitors: Asana ($3.2B valuation, strong UI/UX), Monday.com ($4.2B, visual project tracking), Trello (acquired by Atlassian, simple kanban). Indirect: Microsoft Project (enterprise), Notion (all-in-one workspace). Gap identified: No solution effectively serves creative agencies with client collaboration needs.'
        )}

        {renderField(
          'positioning_strategy',
          'Market Positioning Strategy',
          <Users className="w-4 h-4" />,
          'Define your unique value proposition and competitive differentiation...',
          'Position as "The Creative Agency\'s Command Center" - combining project management with client collaboration, asset management, and approval workflows. Differentiation: Built-in proofing tools, client portal, time tracking with creative-specific features, and integrations with design tools (Adobe, Figma).'
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Users className="w-4 h-4 mr-2" />
              Target Market Segments
            </label>
            <button
              type="button"
              onClick={addSegment}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              + Add Segment
            </button>
          </div>

          {formData.target_segments.length === 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No target segments defined yet</p>
              <p className="text-gray-400 text-sm">Click "Add Segment" to define your target market segments</p>
            </div>
          )}

          {formData.target_segments.map((segment, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-800">Segment {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSegment(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Segment name (e.g., Creative Agencies)"
                  value={segment.name || ''}
                  onChange={(e) => handleSegmentChange(index, 'name', e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Market size (e.g., $2.5M, 1,200 companies)"
                  value={segment.size || ''}
                  onChange={(e) => handleSegmentChange(index, 'size', e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <textarea
                placeholder="Description and characteristics (e.g., Small to medium creative agencies (10-50 employees) specializing in brand design and digital marketing campaigns...)"
                value={segment.description || ''}
                onChange={(e) => handleSegmentChange(index, 'description', e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center"
          >
            {loading ? 'Saving...' : 'Save Research'}
          </button>
        </div>
      </form>
    </div>
  );
};
