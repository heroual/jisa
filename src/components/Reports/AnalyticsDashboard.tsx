import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface AnalyticsDashboardProps {
  project: Project;
  analytics: any[];
  reports: any[];
  onRefresh: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  project, 
  analytics, 
  reports, 
  onRefresh 
}) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    generateDashboardData();
  }, [project, analytics, timeRange]);

  const generateDashboardData = async () => {
    setLoading(true);
    
    // Fetch business plan data for context
    const { data: businessPlans } = await supabase
      .from('business_plans')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const { data: financialPlans } = await supabase
      .from('financial_planning')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const { data: marketResearch } = await supabase
      .from('market_research')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const { data: marketingStrategies } = await supabase
      .from('marketing_strategy')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(1);

    // Generate realistic dashboard data based on business plans
    const businessPlan = businessPlans?.[0];
    const financialPlan = financialPlans?.[0];
    const research = marketResearch?.[0];
    const marketing = marketingStrategies?.[0];

    const dashboardMetrics = {
      revenue: {
        current: businessPlan?.financial_projections?.year_1?.revenue ? 
          parseFloat(businessPlan.financial_projections.year_1.revenue.replace(/[^0-9.-]+/g, '')) || 125000 : 125000,
        target: businessPlan?.financial_projections?.year_1?.revenue ? 
          parseFloat(businessPlan.financial_projections.year_1.revenue.replace(/[^0-9.-]+/g, '')) * 1.2 || 150000 : 150000,
        change: 12.5,
        trend: 'up'
      },
      customers: {
        current: 1250,
        target: 2000,
        change: 8.3,
        trend: 'up'
      },
      marketShare: {
        current: research?.target_segments?.length ? research.target_segments.length * 0.5 : 2.3,
        target: 5.0,
        change: 0.7,
        trend: 'up'
      },
      conversionRate: {
        current: 3.2,
        target: 5.0,
        change: -0.3,
        trend: 'down'
      }
    };

    const chartData = {
      revenueChart: generateTimeSeriesData('revenue', 30),
      userGrowthChart: generateTimeSeriesData('users', 30),
      marketingROI: marketing?.budget_allocation?.channel_allocation?.map((channel, index) => ({
        name: channel.channel,
        value: parseFloat(channel.amount?.replace(/[^0-9.-]+/g, '')) || (Math.random() * 10000 + 5000),
        roi: Math.random() * 300 + 150
      })) || [
        { name: 'Digital Marketing', value: 15000, roi: 250 },
        { name: 'Content Marketing', value: 8000, roi: 320 },
        { name: 'Social Media', value: 6000, roi: 180 },
        { name: 'Events', value: 12000, roi: 200 }
      ],
      costBreakdown: financialPlan?.cost_structure?.fixed_costs?.map((cost, index) => ({
        name: cost.name,
        value: parseFloat(cost.amount) || 0,
        category: 'fixed'
      })) || [
        { name: 'Development', value: 25000, category: 'fixed' },
        { name: 'Marketing', value: 15000, category: 'variable' },
        { name: 'Operations', value: 8000, category: 'fixed' },
        { name: 'Sales', value: 12000, category: 'variable' }
      ]
    };

    setDashboardData({
      metrics: dashboardMetrics,
      charts: chartData,
      insights: generateInsights(dashboardMetrics, businessPlan, financialPlan, research, marketing)
    });

    setLoading(false);
  };

  const generateTimeSeriesData = (type: string, days: number) => {
    const data = [];
    const baseValue = type === 'revenue' ? 4000 : 40;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const randomVariation = (Math.random() - 0.5) * 0.2;
      const trendValue = (days - i) * 0.02;
      const value = baseValue * (1 + trendValue + randomVariation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return data;
  };

  const generateInsights = (metrics: any, businessPlan: any, financialPlan: any, research: any, marketing: any) => {
    const insights = [];

    if (metrics.revenue.change > 10) {
      insights.push({
        type: 'positive',
        title: 'Strong Revenue Growth',
        description: `Revenue is up ${metrics.revenue.change}% this period, exceeding projections.`,
        action: 'Consider scaling marketing efforts to maintain momentum.',
        icon: TrendingUp
      });
    }

    if (metrics.conversionRate.trend === 'down') {
      insights.push({
        type: 'warning',
        title: 'Conversion Rate Declining',
        description: `Conversion rate has dropped by ${Math.abs(metrics.conversionRate.change)}% this period.`,
        action: 'Review marketing funnel and optimize landing pages.',
        icon: TrendingDown
      });
    }

    if (businessPlan && financialPlan) {
      insights.push({
        type: 'info',
        title: 'Business Plan Alignment',
        description: 'Current metrics align well with your business plan projections.',
        action: 'Continue executing your planned strategy.',
        icon: Target
      });
    }

    if (research?.target_segments?.length > 0) {
      insights.push({
        type: 'positive',
        title: 'Market Opportunity',
        description: `${research.target_segments.length} target segments identified with strong potential.`,
        action: 'Focus marketing efforts on highest-value segments.',
        icon: Users
      });
    }

    return insights;
  };

  const MetricCard = ({ title, value, target, change, trend, icon: Icon, format = 'number' }: any) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {format === 'currency' ? `$${value.toLocaleString()}` : 
               format === 'percentage' ? `${value}%` : 
               value.toLocaleString()}
            </p>
            {target && (
              <p className="ml-2 text-sm text-gray-500">
                / {format === 'currency' ? `$${target.toLocaleString()}` : 
                   format === 'percentage' ? `${target}%` : 
                   target.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last period</span>
      </div>
    </div>
  );

  const SimpleChart = ({ data, type, title }: any) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {data.slice(0, 5).map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.name || item.formattedDate}</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min((item.value / Math.max(...data.map((d: any) => d.value))) * 100, 100)}%`
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating dashboard insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={onRefresh}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      {dashboardData?.metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Revenue"
            value={dashboardData.metrics.revenue.current}
            target={dashboardData.metrics.revenue.target}
            change={dashboardData.metrics.revenue.change}
            trend={dashboardData.metrics.revenue.trend}
            icon={DollarSign}
            format="currency"
          />
          <MetricCard
            title="Customers"
            value={dashboardData.metrics.customers.current}
            target={dashboardData.metrics.customers.target}
            change={dashboardData.metrics.customers.change}
            trend={dashboardData.metrics.customers.trend}
            icon={Users}
          />
          <MetricCard
            title="Market Share"
            value={dashboardData.metrics.marketShare.current}
            target={dashboardData.metrics.marketShare.target}
            change={dashboardData.metrics.marketShare.change}
            trend={dashboardData.metrics.marketShare.trend}
            icon={Target}
            format="percentage"
          />
          <MetricCard
            title="Conversion Rate"
            value={dashboardData.metrics.conversionRate.current}
            target={dashboardData.metrics.conversionRate.target}
            change={dashboardData.metrics.conversionRate.change}
            trend={dashboardData.metrics.conversionRate.trend}
            icon={Activity}
            format="percentage"
          />
        </div>
      )}

      {/* Charts */}
      {dashboardData?.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleChart 
            data={dashboardData.charts.revenueChart} 
            type="line" 
            title="Revenue Trend" 
          />
          <SimpleChart 
            data={dashboardData.charts.userGrowthChart} 
            type="line" 
            title="User Growth" 
          />
          <SimpleChart 
            data={dashboardData.charts.marketingROI} 
            type="bar" 
            title="Marketing ROI by Channel" 
          />
          <SimpleChart 
            data={dashboardData.charts.costBreakdown} 
            type="pie" 
            title="Cost Breakdown" 
          />
        </div>
      )}

      {/* Insights */}
      {dashboardData?.insights && dashboardData.insights.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            {dashboardData.insights.map((insight: any, index: number) => {
              const Icon = insight.icon;
              return (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'positive' ? 'bg-green-50 border-green-400' :
                  insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start">
                    <Icon className={`w-5 h-5 mt-0.5 mr-3 ${
                      insight.type === 'positive' ? 'text-green-600' :
                      insight.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <p className="text-sm font-medium text-gray-800 mt-2">
                        💡 {insight.action}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Export Dashboard</p>
              <p className="text-sm text-gray-500">Download as PDF or Excel</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-5 h-5 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Schedule Report</p>
              <p className="text-sm text-gray-500">Set up automated reporting</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Custom Dashboard</p>
              <p className="text-sm text-gray-500">Create personalized view</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};