
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { MarketResearchForm } from './MarketResearchForm';
import { MarketResearchList } from './MarketResearchList';
import { ExampleTemplates } from '../ExampleTemplates';
import { 
  Eye, 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3, 
  Globe, 
  Search,
  Filter,
  Download,
  Share2,
  Plus,
  Briefcase,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface MarketResearchProps {
  project: Project | null;
}

export const MarketResearch: React.FC<MarketResearchProps> = ({ project }) => {
  const [researches, setResearches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [activeView, setActiveView] = useState('list');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    dateRange: '30d'
  });

  // Sample analytics data for market research
  const [marketMetrics] = useState([
    {
      title: 'Market Size',
      value: '$2.4B',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Target Audience',
      value: '1.2M',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Competition Level',
      value: 'Medium',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'yellow'
    },
    {
      title: 'Growth Rate',
      value: '18.4%',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    }
  ]);

  const [insights] = useState([
    {
      id: 1,
      type: 'opportunity',
      title: 'Growing Market Segment',
      description: 'The premium segment shows 25% year-over-year growth with untapped potential.',
      priority: 'high',
      impact: '$450K potential revenue'
    },
    {
      id: 2,
      type: 'threat',
      title: 'New Competitor Entry',
      description: 'A major player entered your market last quarter with aggressive pricing.',
      priority: 'medium',
      impact: '15% market share risk'
    },
    {
      id: 3,
      type: 'trend',
      title: 'Consumer Behavior Shift',
      description: 'Digital-first approach is becoming the preferred choice for 68% of customers.',
      priority: 'high',
      impact: 'Strategy pivot needed'
    }
  ]);

  const fetchResearches = async () => {
    if (!project) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('market_research')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching market research:', error);
      } else {
        setResearches(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      fetchResearches();
    }
  }, [project]);

  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedResearch(null);
    fetchResearches();
  };

  const handleEdit = (research) => {
    setSelectedResearch(research);
    setShowForm(true);
  };

  const handleDelete = async (researchId) => {
    if (window.confirm('Are you sure you want to delete this market research entry?')) {
      const { error } = await supabase.from('market_research').delete().eq('id', researchId);
      if (error) {
        console.error('Error deleting market research:', error);
      } else {
        fetchResearches();
      }
    }
  };

  const renderAnalyticsDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metric.color === 'green' ? 'bg-green-100' :
                  metric.color === 'blue' ? 'bg-blue-100' :
                  metric.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'yellow' ? 'text-yellow-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {metric.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            AI Market Insights
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Insights
          </button>
        </div>
        
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'opportunity'
                  ? 'bg-green-50 border-green-400'
                  : insight.type === 'threat'
                  ? 'bg-red-50 border-red-400'
                  : 'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-medium text-gray-900 mr-3">{insight.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {insight.priority} priority
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{insight.description}</p>
                  <p className="text-xs text-gray-500 font-medium">{insight.impact}</p>
                </div>
                <div className="ml-4">
                  {insight.type === 'opportunity' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {insight.type === 'threat' && <AlertCircle className="w-5 h-5 text-red-500" />}
                  {insight.type === 'trend' && <TrendingUp className="w-5 h-5 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setSelectedResearch(null);
              setShowForm(true);
            }}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">New Research</p>
              <p className="text-sm text-gray-600">Start market analysis</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowExamples(true)}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">View Templates</p>
              <p className="text-sm text-gray-600">Explore examples</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-600">Download insights</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <Briefcase className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Project</h3>
        <p className="text-gray-500 text-center max-w-md">
          Choose a project from the Projects tab to start your market research analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f5f0e6] min-h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
              <TrendingUp className="w-8 h-8 mr-3 text-blue-600" />
              Market Research
            </h1>
            <p className="text-gray-600 text-lg">
              Analyze your market opportunity, competitive landscape, and consumer insights
            </p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="font-medium">Project:</span>
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {project.name}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowExamples(true)}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Examples
            </button>
            <button
              onClick={() => {
                setSelectedResearch(null);
                setShowForm(true);
              }}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] text-white rounded-lg hover:shadow-lg hover:shadow-[#d6c2a3]/30 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Research
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
              { id: 'list', label: 'Research Library', icon: Globe },
              { id: 'insights', label: 'Market Insights', icon: Zap }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`group flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-lg shadow-sm min-h-96">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading market research data...</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {showForm ? (
              <MarketResearchForm
                project={project}
                marketResearch={selectedResearch}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedResearch(null);
                }}
              />
            ) : (
              activeView === 'dashboard' ? renderAnalyticsDashboard() :
              activeView === 'list' ? (
                <MarketResearchList
                  researches={researches}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={loading}
                />
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Market Insights</h3>
                  <div className="grid gap-4">
                    {insights.map((insight) => (
                      <div
                        key={insight.id}
                        className={`p-6 rounded-xl border-l-4 ${
                          insight.type === 'opportunity'
                            ? 'bg-green-50 border-green-400'
                            : insight.type === 'threat'
                            ? 'bg-red-50 border-red-400'
                            : 'bg-blue-50 border-blue-400'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <h4 className="font-semibold text-gray-900 mr-3">{insight.title}</h4>
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                insight.priority === 'high' 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {insight.priority} priority
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{insight.description}</p>
                            <p className="text-sm text-gray-600 font-medium">{insight.impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <ExampleTemplates 
        isOpen={showExamples} 
        onClose={() => setShowExamples(false)} 
      />
    </div>
  );
};
