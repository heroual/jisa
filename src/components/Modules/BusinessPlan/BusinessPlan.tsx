
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { BusinessPlanForm } from './BusinessPlanForm';
import { BusinessPlanList } from './BusinessPlanList';
import { ExampleTemplates } from '../ExampleTemplates';
import { 
  Eye, 
  FileText, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Briefcase,
  Map,
  Plus,
  Download,
  Share2,
  Calendar,
  Zap,
  Building,
  Globe,
  Award
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface BusinessPlanProps {
  project: Project | null;
}

export const BusinessPlan: React.FC<BusinessPlanProps> = ({ project }) => {
  const [businessPlans, setBusinessPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // Sample business plan metrics
  const [planMetrics] = useState([
    {
      title: 'Plan Completion',
      value: '78%',
      change: '+12%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'green',
      description: 'Overall plan progress'
    },
    {
      title: 'Financial Projections',
      value: '$2.4M',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
      description: '5-year revenue projection'
    },
    {
      title: 'Market Opportunity',
      value: '$15B',
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'purple',
      description: 'Total addressable market'
    },
    {
      title: 'Time to Market',
      value: '8 months',
      change: '-2 months',
      trend: 'down',
      icon: Clock,
      color: 'orange',
      description: 'Estimated launch timeline'
    }
  ]);

  const [planSections] = useState([
    { name: 'Executive Summary', progress: 90, status: 'completed', priority: 'high' },
    { name: 'Market Analysis', progress: 85, status: 'completed', priority: 'high' },
    { name: 'Business Model', progress: 70, status: 'in-progress', priority: 'high' },
    { name: 'Marketing Strategy', progress: 65, status: 'in-progress', priority: 'medium' },
    { name: 'Financial Projections', progress: 80, status: 'completed', priority: 'high' },
    { name: 'Operations Plan', progress: 45, status: 'in-progress', priority: 'medium' },
    { name: 'Risk Analysis', progress: 30, status: 'pending', priority: 'low' },
    { name: 'Implementation Timeline', progress: 55, status: 'in-progress', priority: 'medium' }
  ]);

  const [businessInsights] = useState([
    {
      id: 1,
      type: 'opportunity',
      title: 'Market Gap Identified',
      description: 'Your business model addresses a significant gap in the mid-market segment with 40% growth potential.',
      priority: 'high',
      impact: '$800K revenue opportunity'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Competitive Threat Analysis',
      description: 'Three new competitors launched similar products. Differentiation strategy needs refinement.',
      priority: 'high',
      impact: '15% market share at risk'
    },
    {
      id: 3,
      type: 'trend',
      title: 'Technology Advancement',
      description: 'AI integration could reduce operational costs by 30% and improve customer experience.',
      priority: 'medium',
      impact: '30% cost reduction potential'
    }
  ]);

  const fetchBusinessPlans = async () => {
    if (!project) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_plans')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching business plans:', error);
      } else {
        setBusinessPlans(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      fetchBusinessPlans();
    }
  }, [project]);

  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedPlan(null);
    fetchBusinessPlans();
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this business plan?')) {
      const { error } = await supabase.from('business_plans').delete().eq('id', planId);
      if (error) {
        console.error('Error deleting business plan:', error);
      } else {
        fetchBusinessPlans();
      }
    }
  };

  const renderBusinessPlanDashboard = () => (
    <div className="space-y-6">
      {/* Key Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metric.color === 'green' ? 'bg-green-100' :
                  metric.color === 'blue' ? 'bg-blue-100' :
                  metric.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
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

      {/* Plan Progress */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Map className="w-5 h-5 mr-2 text-blue-600" />
            Business Plan Progress
          </h3>
          <span className="text-sm text-gray-500">8 sections total</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {planSections.map((section, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">{section.name}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    section.priority === 'high' ? 'bg-red-100 text-red-800' :
                    section.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {section.priority}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    section.status === 'completed' ? 'bg-green-100 text-green-800' :
                    section.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {section.status}
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-600">{section.progress}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    section.progress >= 80 ? 'bg-green-500' :
                    section.progress >= 60 ? 'bg-blue-500' :
                    section.progress >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${section.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            AI Strategic Insights
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Insights
          </button>
        </div>
        
        <div className="space-y-4">
          {businessInsights.map((insight) => (
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

      {/* Business Plan Tools */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Planning Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setSelectedPlan(null);
              setShowForm(true);
            }}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">New Business Plan</p>
              <p className="text-sm text-gray-600">Create comprehensive plan</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Financial Model</p>
              <p className="text-sm text-gray-600">Build projections</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Pitch Deck</p>
              <p className="text-sm text-gray-600">Create presentation</p>
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
          Choose a project from the Projects tab to start creating your comprehensive business plan.
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
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Business Plan
            </h1>
            <p className="text-gray-600 text-lg">
              Create comprehensive business plans with financial projections, market analysis, and strategic roadmaps
            </p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="font-medium">Project:</span>
              <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
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
              Templates
            </button>
            <button
              onClick={() => {
                setSelectedPlan(null);
                setShowForm(true);
              }}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] text-white rounded-lg hover:shadow-lg hover:shadow-[#d6c2a3]/30 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Business Plan
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Planning Dashboard', icon: BarChart3 },
              { id: 'plans', label: 'Business Plans', icon: FileText },
              { id: 'strategy', label: 'Strategic Analysis', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`group flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading business plan data...</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {showForm ? (
              <BusinessPlanForm
                project={project}
                businessPlan={selectedPlan}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedPlan(null);
                }}
              />
            ) : (
              activeView === 'dashboard' ? renderBusinessPlanDashboard() :
              activeView === 'plans' ? (
                <BusinessPlanList
                  businessPlans={businessPlans}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={loading}
                />
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Strategic Analysis</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Building className="w-5 h-5 mr-2 text-blue-600" />
                        SWOT Analysis
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-2">Strengths</h5>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Strong technical team</li>
                            <li>• Unique value proposition</li>
                            <li>• Market timing</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                          <h5 className="font-medium text-red-800 mb-2">Weaknesses</h5>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• Limited capital</li>
                            <li>• Small team size</li>
                            <li>• Brand awareness</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-2">Opportunities</h5>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Growing market</li>
                            <li>• Technology trends</li>
                            <li>• Strategic partnerships</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                          <h5 className="font-medium text-yellow-800 mb-2">Threats</h5>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• New competitors</li>
                            <li>• Economic downturn</li>
                            <li>• Regulatory changes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-purple-600" />
                        Market Position
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Market Share</span>
                          <span className="font-medium">2.3%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Growth Rate</span>
                          <span className="font-medium text-green-600">+18% YoY</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Competitive Advantage</span>
                          <span className="font-medium">Technology</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Customer Retention</span>
                          <span className="font-medium">89%</span>
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
