
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { MarketingStrategyForm } from './MarketingStrategyForm';
import { MarketingStrategyList } from './MarketingStrategyList';
import { ExampleTemplates } from '../ExampleTemplates';
import { 
  Eye, 
  Target, 
  TrendingUp, 
  Users, 
  Megaphone, 
  BarChart3,
  Globe,
  Mail,
  Share2,
  MousePointer,
  Heart,
  Zap,
  Plus,
  Download,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Activity,
  DollarSign
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface MarketingStrategyProps {
  project: Project | null;
}

export const MarketingStrategy: React.FC<MarketingStrategyProps> = ({ project }) => {
  const [strategies, setStrategies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // Sample marketing metrics
  const [marketingMetrics] = useState([
    {
      title: 'Customer Acquisition Cost',
      value: '$45',
      change: '-12%',
      trend: 'down',
      icon: DollarSign,
      color: 'green',
      description: 'Cost to acquire new customer'
    },
    {
      title: 'Conversion Rate',
      value: '3.8%',
      change: '+24%',
      trend: 'up',
      icon: MousePointer,
      color: 'blue',
      description: 'Website conversion rate'
    },
    {
      title: 'Brand Awareness',
      value: '67%',
      change: '+18%',
      trend: 'up',
      icon: Megaphone,
      color: 'purple',
      description: 'Brand recognition score'
    },
    {
      title: 'Customer Lifetime Value',
      value: '$890',
      change: '+31%',
      trend: 'up',
      icon: Heart,
      color: 'red',
      description: 'Average customer value'
    }
  ]);

  const [marketingChannels] = useState([
    { name: 'Digital Advertising', budget: 35000, performance: 'excellent', roi: '4.2x', color: 'blue' },
    { name: 'Content Marketing', budget: 18000, performance: 'good', roi: '3.1x', color: 'green' },
    { name: 'Social Media', budget: 12000, performance: 'good', roi: '2.8x', color: 'purple' },
    { name: 'Email Marketing', budget: 8000, performance: 'excellent', roi: '5.4x', color: 'yellow' },
    { name: 'Events & PR', budget: 15000, performance: 'average', roi: '2.1x', color: 'red' }
  ]);

  const [campaignInsights] = useState([
    {
      id: 1,
      type: 'opportunity',
      title: 'Email Campaign Optimization',
      description: 'Your email campaigns show 40% higher engagement than industry average. Scale this channel.',
      priority: 'high',
      impact: '25% increase in leads'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Ad Spend Efficiency Drop',
      description: 'Social media ad performance declined 15% this month. Review targeting and creative.',
      priority: 'medium',
      impact: '$3,200 budget reallocation needed'
    },
    {
      id: 3,
      type: 'trend',
      title: 'Video Content Surge',
      description: 'Video content generates 3x more engagement. Consider increasing video marketing budget.',
      priority: 'high',
      impact: '60% engagement improvement'
    }
  ]);

  const fetchStrategies = async () => {
    if (!project) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketing_strategy')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching marketing strategies:', error);
      } else {
        setStrategies(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      fetchStrategies();
    }
  }, [project]);

  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedStrategy(null);
    fetchStrategies();
  };

  const handleEdit = (strategy) => {
    setSelectedStrategy(strategy);
    setShowForm(true);
  };

  const handleDelete = async (strategyId) => {
    if (window.confirm('Are you sure you want to delete this marketing strategy?')) {
      const { error } = await supabase.from('marketing_strategy').delete().eq('id', strategyId);
      if (error) {
        console.error('Error deleting marketing strategy:', error);
      } else {
        fetchStrategies();
      }
    }
  };

  const renderMarketingDashboard = () => (
    <div className="space-y-6">
      {/* Key Marketing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketingMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metric.color === 'green' ? 'bg-green-100' :
                  metric.color === 'blue' ? 'bg-blue-100' :
                  metric.color === 'purple' ? 'bg-purple-100' :
                  'bg-red-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'purple' ? 'text-purple-600' :
                    'text-red-600'
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
                <p className="text-sm font-medium text-gray-700 mb-1">{metric.title}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Marketing Channels Performance */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Marketing Channels Performance
          </h3>
          <span className="text-sm text-gray-500">Monthly budget allocation</span>
        </div>
        
        <div className="space-y-4">
          {marketingChannels.map((channel, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    channel.color === 'blue' ? 'bg-blue-500' :
                    channel.color === 'green' ? 'bg-green-500' :
                    channel.color === 'purple' ? 'bg-purple-500' :
                    channel.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{channel.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    channel.performance === 'excellent' ? 'bg-green-100 text-green-800' :
                    channel.performance === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {channel.performance}
                  </span>
                  <span className="font-semibold text-gray-900">${channel.budget.toLocaleString()}</span>
                  <span className="text-sm text-green-600 font-medium">{channel.roi}</span>
                </div>
              </div>
              <div className="ml-7">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      channel.color === 'blue' ? 'bg-blue-500' :
                      channel.color === 'green' ? 'bg-green-500' :
                      channel.color === 'purple' ? 'bg-purple-500' :
                      channel.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(channel.budget / 88000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Insights */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            AI Campaign Insights
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Insights
          </button>
        </div>
        
        <div className="space-y-4">
          {campaignInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'opportunity'
                  ? 'bg-green-50 border-green-400'
                  : insight.type === 'warning'
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
                  {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-red-500" />}
                  {insight.type === 'trend' && <TrendingUp className="w-5 h-5 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setSelectedStrategy(null);
              setShowForm(true);
            }}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">New Strategy</p>
              <p className="text-sm text-gray-600">Create marketing plan</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Campaign Analytics</p>
              <p className="text-sm text-gray-600">Track performance</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Audience Builder</p>
              <p className="text-sm text-gray-600">Define target segments</p>
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
          Choose a project from the Projects tab to start developing your marketing strategy.
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
              <Target className="w-8 h-8 mr-3 text-purple-600" />
              Marketing Strategy
            </h1>
            <p className="text-gray-600 text-lg">
              Define your marketing channels, campaigns, and growth tactics for maximum impact
            </p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="font-medium">Project:</span>
              <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
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
                setSelectedStrategy(null);
                setShowForm(true);
              }}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] text-white rounded-lg hover:shadow-lg hover:shadow-[#d6c2a3]/30 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Strategy
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Marketing Dashboard', icon: BarChart3 },
              { id: 'strategies', label: 'Strategy Library', icon: Target },
              { id: 'campaigns', label: 'Campaign Manager', icon: Megaphone }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`group flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-purple-500 text-purple-600'
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading marketing data...</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {showForm ? (
              <MarketingStrategyForm
                project={project}
                marketingStrategy={selectedStrategy}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedStrategy(null);
                }}
              />
            ) : (
              activeView === 'dashboard' ? renderMarketingDashboard() :
              activeView === 'strategies' ? (
                <MarketingStrategyList
                  strategies={strategies}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={loading}
                />
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Campaign Manager</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Active Campaigns</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Q1 Launch Campaign</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Social Media Boost</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Running</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Email Newsletter</span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Scheduled</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Click-through Rate</span>
                          <span className="font-medium">4.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost per Click</span>
                          <span className="font-medium">$1.85</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Return on Ad Spend</span>
                          <span className="font-medium">3.8x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Brand Engagement</span>
                          <span className="font-medium">+28%</span>
                        </div>
                      </div>
                    </div>
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
