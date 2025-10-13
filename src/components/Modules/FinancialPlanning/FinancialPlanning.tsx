
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { FinancialPlanningForm } from './FinancialPlanningForm';
import { FinancialPlanningList } from './FinancialPlanningList';
import { ExampleTemplates } from '../ExampleTemplates';
import { 
  Eye, 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Calculator, 
  BarChart3,
  CreditCard,
  Wallet,
  Target,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Download,
  Share2,
  Briefcase,
  Calendar,
  Filter,
  Zap
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface FinancialPlanningProps {
  project: Project | null;
}

export const FinancialPlanning: React.FC<FinancialPlanningProps> = ({ project }) => {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // Sample financial data
  const [financialMetrics] = useState([
    {
      title: 'Projected Revenue',
      value: '$125,000',
      change: '+18.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      description: 'Annual revenue projection'
    },
    {
      title: 'Operating Costs',
      value: '$78,500',
      change: '+5.2%',
      trend: 'up',
      icon: CreditCard,
      color: 'red',
      description: 'Monthly operating expenses'
    },
    {
      title: 'Profit Margin',
      value: '37.2%',
      change: '+3.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue',
      description: 'Current profit margin'
    },
    {
      title: 'Break-even Point',
      value: '14 months',
      change: '-2 months',
      trend: 'down',
      icon: Target,
      color: 'purple',
      description: 'Time to profitability'
    }
  ]);

  const [financialInsights] = useState([
    {
      id: 1,
      type: 'opportunity',
      title: 'Cost Optimization Opportunity',
      description: 'Your marketing spend could be optimized to reduce CAC by 25% while maintaining growth.',
      impact: '$15,000 annual savings',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Cash Flow Risk',
      description: 'Q3 projections show potential cash flow shortage. Consider securing bridge funding.',
      impact: '$35,000 shortfall risk',
      priority: 'high'
    },
    {
      id: 3,
      type: 'trend',
      title: 'Revenue Growth Acceleration',
      description: 'Current growth rate exceeds industry average by 12%. Scaling opportunity identified.',
      impact: '40% faster growth potential',
      priority: 'medium'
    }
  ]);

  const [budgetBreakdown] = useState([
    { category: 'Marketing & Sales', amount: 28500, percentage: 36.3, color: 'blue' },
    { category: 'Personnel', amount: 25200, percentage: 32.1, color: 'green' },
    { category: 'Operations', amount: 12800, percentage: 16.3, color: 'yellow' },
    { category: 'Technology', amount: 8400, percentage: 10.7, color: 'purple' },
    { category: 'Administrative', amount: 3600, percentage: 4.6, color: 'gray' }
  ]);

  const fetchPlans = async () => {
    if (!project) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('financial_planning')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching financial plans:', error);
      } else {
        setPlans(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) {
      fetchPlans();
    }
  }, [project]);

  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedPlan(null);
    fetchPlans();
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this financial plan?')) {
      const { error } = await supabase.from('financial_planning').delete().eq('id', planId);
      if (error) {
        console.error('Error deleting financial plan:', error);
      } else {
        fetchPlans();
      }
    }
  };

  const renderFinancialDashboard = () => (
    <div className="space-y-6">
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metric.color === 'green' ? 'bg-green-100' :
                  metric.color === 'red' ? 'bg-red-100' :
                  metric.color === 'blue' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'red' ? 'text-red-600' :
                    metric.color === 'blue' ? 'text-blue-600' :
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
                <p className="text-sm font-medium text-gray-700 mb-1">{metric.title}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            Budget Breakdown
          </h3>
          <span className="text-sm text-gray-500">Monthly allocation</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {budgetBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    item.color === 'blue' ? 'bg-blue-500' :
                    item.color === 'green' ? 'bg-green-500' :
                    item.color === 'yellow' ? 'bg-yellow-500' :
                    item.color === 'purple' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${item.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">$78.5K</p>
                <p className="text-sm text-gray-600">Total Budget</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            AI Financial Insights
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Insights
          </button>
        </div>
        
        <div className="space-y-4">
          {financialInsights.map((insight) => (
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
                  {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  {insight.type === 'trend' && <TrendingUp className="w-5 h-5 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setSelectedPlan(null);
              setShowForm(true);
            }}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Calculator className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">New Financial Plan</p>
              <p className="text-sm text-gray-600">Create budget & projections</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">ROI Calculator</p>
              <p className="text-sm text-gray-600">Calculate returns</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Cash Flow</p>
              <p className="text-sm text-gray-600">Track cash position</p>
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
          Choose a project from the Projects tab to start your financial planning.
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
              <DollarSign className="w-8 h-8 mr-3 text-green-600" />
              Financial Planning
            </h1>
            <p className="text-gray-600 text-lg">
              Plan your pricing, costs, revenue projections, and financial strategy
            </p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="font-medium">Project:</span>
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
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
              New Financial Plan
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Financial Dashboard', icon: BarChart3 },
              { id: 'plans', label: 'Plans & Budgets', icon: Calculator },
              { id: 'analysis', label: 'Financial Analysis', icon: PieChart }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`group flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-green-500 text-green-600'
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading financial data...</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {showForm ? (
              <FinancialPlanningForm
                project={project}
                financialPlan={selectedPlan}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedPlan(null);
                }}
              />
            ) : (
              activeView === 'dashboard' ? renderFinancialDashboard() :
              activeView === 'plans' ? (
                <FinancialPlanningList
                  plans={plans}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={loading}
                />
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Financial Analysis</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Revenue Projections</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Q1 2024</span>
                          <span className="font-medium">$25,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Q2 2024</span>
                          <span className="font-medium">$32,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Q3 2024</span>
                          <span className="font-medium">$41,250</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Q4 2024</span>
                          <span className="font-medium">$52,500</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Key Ratios</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gross Margin</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Operating Margin</span>
                          <span className="font-medium">28%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Ratio</span>
                          <span className="font-medium">2.4</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI</span>
                          <span className="font-medium">24%</span>
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
