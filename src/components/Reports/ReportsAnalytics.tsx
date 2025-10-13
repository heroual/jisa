import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ReportBuilder } from './ReportBuilder';
import { ReportLibrary } from './ReportLibrary';
import { DataExplorer } from './DataExplorer';
import { ScheduledReports } from './ScheduledReports';
import { 
  BarChart3, 
  FileText, 
  Database, 
  Clock, 
  Settings,
  TrendingUp,
  Plus,
  Download,
  Share2,
  Filter,
  Calendar,
  Zap,
  Eye,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
  Users,
  DollarSign,
  Target,
  Globe,
  Mail,
  Bell,
  Bookmark,
  Search,
  Grid,
  List,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Calculator,
  Layers
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface ReportsAnalyticsProps {
  project: Project | null;
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [insights, setInsights] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: '30d',
    category: 'all',
    status: 'all',
    priority: 'all'
  });

  // Enhanced dashboard metrics
  const [dashboardMetrics, setDashboardMetrics] = useState([
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: '$156,240',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      target: '$200,000',
      progress: 78,
      chartData: [120000, 135000, 142000, 156240]
    },
    {
      id: 'customers',
      title: 'Active Customers',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      target: '3,500',
      progress: 81,
      chartData: [2200, 2450, 2650, 2847]
    },
    {
      id: 'satisfaction',
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.3',
      trend: 'up',
      icon: Target,
      color: 'purple',
      target: '4.9/5',
      progress: 96,
      chartData: [4.2, 4.5, 4.7, 4.8]
    },
    {
      id: 'market_share',
      title: 'Market Share',
      value: '12.3%',
      change: '+2.1%',
      trend: 'up',
      icon: Globe,
      color: 'orange',
      target: '15%',
      progress: 82,
      chartData: [8.5, 9.8, 11.2, 12.3]
    }
  ]);

  // Enhanced performance tracking
  const [performanceData, setPerformanceData] = useState({
    kpis: [
      { name: 'Revenue Growth', current: 18.2, target: 25, status: 'on-track' },
      { name: 'Customer Acquisition', current: 245, target: 300, status: 'behind' },
      { name: 'Retention Rate', current: 89, target: 85, status: 'ahead' },
      { name: 'Profit Margin', current: 24.5, target: 30, status: 'on-track' }
    ],
    departmentMetrics: [
      { department: 'Sales', performance: 92, trend: 'up', budget: 85000, spent: 78500 },
      { department: 'Marketing', performance: 88, trend: 'up', budget: 65000, spent: 61200 },
      { department: 'Product', performance: 94, trend: 'stable', budget: 120000, spent: 115600 },
      { department: 'Operations', performance: 86, trend: 'down', budget: 45000, spent: 42300 }
    ]
  });

  useEffect(() => {
    if (project) {
      fetchData();
      // Set up real-time updates
      const interval = setInterval(refreshDashboardData, 30000); // Refresh every 30 seconds
      const cleanupRealtime = setupRealTimeUpdates();
      
      return () => {
        clearInterval(interval);
        if (cleanupRealtime) cleanupRealtime();
      };
    }
  }, [project]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch data from multiple sources
      const [templatesResult, reportsResult] = await Promise.all([
        supabase
          .from('report_templates')
          .select('*')
          .eq('is_public', true)
          .order('usage_count', { ascending: false }),
        supabase
          .from('generated_reports')
          .select('*')
          .eq('project_id', project?.id)
          .order('created_at', { ascending: false })
      ]);

      if (templatesResult.data) setTemplates(templatesResult.data);
      if (reportsResult.data) setReports(reportsResult.data);
      
      // Generate comprehensive analytics data
      await generateAdvancedAnalytics();
      generateEnhancedInsights();
      generateSmartAlerts();
      generateRealtimeMetrics();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboardData = async () => {
    // Simulate real-time data updates
    setDashboardMetrics(prev => prev.map(metric => ({
      ...metric,
      value: updateMetricValue(metric),
      change: (Math.random() * 20 - 10).toFixed(1) + '%',
      chartData: [...metric.chartData.slice(1), generateNewDataPoint(metric)]
    })));
  };

  const updateMetricValue = (metric) => {
    // Simulate realistic value updates
    const baseValue = parseFloat(metric.value.replace(/[^0-9.-]+/g, ''));
    const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
    const newValue = baseValue * (1 + variation);
    
    if (metric.id === 'revenue') return `$${Math.round(newValue).toLocaleString()}`;
    if (metric.id === 'customers') return Math.round(newValue).toLocaleString();
    if (metric.id === 'satisfaction') return `${newValue.toFixed(1)}/5`;
    if (metric.id === 'market_share') return `${newValue.toFixed(1)}%`;
    
    return metric.value;
  };

  const generateNewDataPoint = (metric) => {
    const lastValue = metric.chartData[metric.chartData.length - 1];
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    return Math.round(lastValue * (1 + variation));
  };

  const generateAdvancedAnalytics = async () => {
    const mockData = [];
    const metrics = [
      'revenue', 'users', 'conversion_rate', 'market_share', 
      'customer_satisfaction', 'retention_rate', 'lead_generation',
      'brand_awareness', 'engagement_rate', 'cost_per_acquisition'
    ];
    const now = new Date();
    
    // Generate comprehensive time series data
    for (let i = 0; i < 90; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      metrics.forEach(metric => {
        const baseValue = getBaseValue(metric);
        const variation = (Math.random() - 0.5) * 0.2;
        const trend = Math.sin(i * 0.1) * 0.1;
        const seasonality = Math.sin((i / 30) * 2 * Math.PI) * 0.05;
        
        mockData.push({
          id: `${metric}_${i}`,
          metric_type: metric,
          metric_value: baseValue * (1 + variation + trend + seasonality),
          recorded_at: date.toISOString(),
          metric_data: {
            change: (Math.random() - 0.5) * 20,
            trend: Math.random() > 0.5 ? 'up' : 'down',
            confidence: 70 + Math.random() * 30,
            forecast: baseValue * (1.1 + Math.random() * 0.2)
          }
        });
      });
    }
    
    setAnalytics(mockData);
  };

  const getBaseValue = (metric) => {
    const baseValues = {
      revenue: 15000,
      users: 1250,
      conversion_rate: 3.5,
      market_share: 2.1,
      customer_satisfaction: 4.2,
      retention_rate: 85,
      lead_generation: 340,
      brand_awareness: 67,
      engagement_rate: 5.8,
      cost_per_acquisition: 45
    };
    return baseValues[metric] || 100;
  };

  const generateEnhancedInsights = () => {
    const enhancedInsights = [
      {
        id: 1,
        type: 'opportunity',
        title: 'Revenue Growth Acceleration',
        description: 'Your conversion rate increased 24% this month. Consider scaling your best-performing marketing channels for maximum impact.',
        impact: 'high',
        confidence: 94,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['revenue', 'growth', 'marketing'],
        action_items: [
          'Increase budget for top-converting channels by 30%',
          'A/B test similar campaigns across other segments',
          'Implement automated scaling workflows'
        ],
        expected_outcome: '+$45K monthly revenue increase',
        timeframe: '4-6 weeks'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Customer Retention Risk',
        description: 'Retention rate dropped 3% compared to last month. Customer feedback indicates pricing concerns and competitor comparisons.',
        impact: 'medium',
        confidence: 82,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['retention', 'pricing', 'competition'],
        action_items: [
          'Conduct customer satisfaction survey',
          'Review pricing strategy vs competitors',
          'Implement loyalty program pilot'
        ],
        expected_outcome: 'Reduce churn by 15%',
        timeframe: '2-3 weeks'
      },
      {
        id: 3,
        type: 'trend',
        title: 'Market Share Expansion',
        description: 'Your market share has grown consistently over 6 weeks, indicating strong product-market fit and brand positioning.',
        impact: 'high',
        confidence: 96,
        created_at: new Date().toISOString(),
        tags: ['market-share', 'growth', 'positioning'],
        action_items: [
          'Document winning strategies for replication',
          'Expand to adjacent market segments',
          'Increase brand awareness campaigns'
        ],
        expected_outcome: '25% market share growth',
        timeframe: '8-12 weeks'
      },
      {
        id: 4,
        type: 'innovation',
        title: 'AI-Powered Customer Experience',
        description: 'Implementation of AI chatbot increased customer satisfaction by 18% and reduced support costs by 32%.',
        impact: 'high',
        confidence: 91,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['ai', 'customer-experience', 'automation'],
        action_items: [
          'Expand AI capabilities to more touchpoints',
          'Train AI on additional product knowledge',
          'Implement predictive customer support'
        ],
        expected_outcome: '40% reduction in support costs',
        timeframe: '6-8 weeks'
      }
    ];
    
    setInsights(enhancedInsights);
  };

  const generateSmartAlerts = () => {
    const smartAlerts = [
      {
        id: 1,
        type: 'performance',
        severity: 'warning',
        title: 'Revenue Target at Risk',
        message: 'Current month revenue is 12% below target. Recommended actions: increase lead generation by 25% and optimize conversion funnel.',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        is_read: false,
        priority: 'high',
        auto_actions_available: true,
        estimated_impact: '$15K revenue recovery',
        confidence: 87
      },
      {
        id: 2,
        type: 'data',
        severity: 'info',
        title: 'Market Intelligence Update',
        message: 'New competitive analysis data shows 3 competitors launched similar features. Strategic review recommended.',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        is_read: false,
        priority: 'medium',
        auto_actions_available: false,
        estimated_impact: 'Strategic advantage preservation',
        confidence: 92
      },
      {
        id: 3,
        type: 'opportunity',
        severity: 'success',
        title: 'Viral Content Detected',
        message: 'Your latest content piece gained 340% more engagement than average. Consider amplifying similar content.',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        priority: 'high',
        auto_actions_available: true,
        estimated_impact: '+25% brand awareness',
        confidence: 95
      }
    ];
    
    setAlerts(smartAlerts);
  };

  const generateInsights = async () => {
    setLoading(true);
    try {
      // AI-powered insights generation
      await generateEnhancedInsights();
      await generateSmartAlerts();
      await generatePredictiveAnalytics();
      await generateBenchmarkingData();
    } finally {
      setLoading(false);
    }
  };

  const generatePredictiveAnalytics = async () => {
    // Simulate advanced predictive analytics
    const predictions = [
      {
        id: 'revenue_forecast',
        title: 'Revenue Prediction',
        prediction: '$187,400',
        confidence: 89,
        timeframe: 'Next Quarter',
        change: '+23.5%',
        factors: ['Seasonal trends', 'Market expansion', 'Product launches']
      },
      {
        id: 'churn_risk',
        title: 'Customer Churn Risk',
        prediction: '8.3%',
        confidence: 76,
        timeframe: 'Next 30 days',
        change: '-2.1%',
        factors: ['Usage patterns', 'Payment history', 'Support interactions']
      },
      {
        id: 'market_opportunity',
        title: 'Market Opportunity Score',
        prediction: '84/100',
        confidence: 92,
        timeframe: 'Current',
        change: '+7 points',
        factors: ['Competition analysis', 'Market size', 'Customer demand']
      }
    ];
    
    // Add predictions to insights
    setInsights(prev => [...prev, ...predictions.map(p => ({
      id: p.id,
      type: 'prediction',
      title: p.title,
      description: `Predicted ${p.prediction} with ${p.confidence}% confidence`,
      impact: 'high',
      confidence: p.confidence,
      created_at: new Date().toISOString(),
      tags: ['ai', 'prediction', 'forecast'],
      action_items: [`Monitor ${p.factors.join(', ')}`],
      expected_outcome: p.prediction,
      timeframe: p.timeframe
    }))]);
  };

  const generateBenchmarkingData = async () => {
    // Industry benchmarking
    const benchmarks = [
      { metric: 'Revenue Growth Rate', your_value: 18.2, industry_avg: 12.5, percentile: 78 },
      { metric: 'Customer Acquisition Cost', your_value: 45, industry_avg: 62, percentile: 85 },
      { metric: 'Lifetime Value', your_value: 1250, industry_avg: 980, percentile: 72 },
      { metric: 'Retention Rate', your_value: 89, industry_avg: 83, percentile: 69 }
    ];
    
    // Store benchmarks for later use
    console.log('Benchmarking data generated:', benchmarks);
  };

  const generateRealtimeMetrics = () => {
    // This would typically connect to real-time data streams
    console.log('Real-time metrics generation initialized');
  };

  const exportData = async (format = 'csv') => {
    setLoading(true);
    try {
      const exportData = {
        metadata: {
          project: project?.name,
          generated_at: new Date().toISOString(),
          date_range: filters.dateRange,
          category: filters.category,
          export_format: format
        },
        executive_summary: {
          total_revenue: dashboardMetrics.find(m => m.id === 'revenue')?.value,
          customer_growth: dashboardMetrics.find(m => m.id === 'customers')?.change,
          satisfaction_score: dashboardMetrics.find(m => m.id === 'satisfaction')?.value,
          market_share: dashboardMetrics.find(m => m.id === 'market_share')?.value
        },
        metrics: dashboardMetrics,
        insights: insights,
        performance: performanceData,
        alerts: alerts,
        analytics_data: analytics.slice(0, 100), // Last 100 data points
        charts_data: {
          revenue_trend: dashboardMetrics[0]?.chartData || [],
          customer_trend: dashboardMetrics[1]?.chartData || [],
          satisfaction_trend: dashboardMetrics[2]?.chartData || [],
          market_share_trend: dashboardMetrics[3]?.chartData || []
        }
      };
      
      if (format === 'csv') {
        await exportToCSV(exportData);
      } else if (format === 'json') {
        await exportToJSON(exportData);
      } else if (format === 'pdf') {
        await exportToPDF(exportData);
      } else if (format === 'excel') {
        await exportToExcel(exportData);
      }
      
      // Log export for analytics
      await logExportActivity(format, exportData.metadata);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async (data) => {
    const sections = [
      ['EXECUTIVE SUMMARY'],
      ['Metric', 'Value'],
      ['Total Revenue', data.executive_summary.total_revenue],
      ['Customer Growth', data.executive_summary.customer_growth],
      ['Satisfaction Score', data.executive_summary.satisfaction_score],
      ['Market Share', data.executive_summary.market_share],
      [''],
      ['PERFORMANCE METRICS'],
      ['Metric', 'Value', 'Change', 'Trend', 'Target', 'Progress'],
      ...data.metrics.map(metric => [
        metric.title,
        metric.value,
        metric.change,
        metric.trend,
        metric.target,
        `${metric.progress}%`
      ]),
      [''],
      ['AI INSIGHTS'],
      ['Type', 'Title', 'Description', 'Impact', 'Confidence', 'Created'],
      ...data.insights.map(insight => [
        insight.type,
        insight.title,
        insight.description,
        insight.impact,
        `${insight.confidence}%`,
        new Date(insight.created_at).toLocaleDateString()
      ]),
      [''],
      ['PERFORMANCE BY DEPARTMENT'],
      ['Department', 'Performance', 'Trend', 'Budget', 'Spent', 'Utilization'],
      ...data.performance.departmentMetrics.map(dept => [
        dept.department,
        `${dept.performance}%`,
        dept.trend,
        `$${dept.budget.toLocaleString()}`,
        `$${dept.spent.toLocaleString()}`,
        `${((dept.spent / dept.budget) * 100).toFixed(1)}%`
      ])
    ];
    
    const csvContent = sections.map(row => 
      Array.isArray(row) ? row.map(cell => `"${cell}"`).join(',') : row
    ).join('\n');
    
    downloadFile(csvContent, `markewin-analytics-${Date.now()}.csv`, 'text/csv');
  };

  const exportToJSON = async (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `markewin-analytics-${Date.now()}.json`, 'application/json');
  };

  const exportToPDF = async (data) => {
    // Create PDF content
    const pdfContent = generatePDFContent(data);
    
    // This would typically use a library like jsPDF or Puppeteer
    // For now, we'll create a detailed HTML report that can be printed as PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MarkeWin Analytics Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #d6c2a3; padding-bottom: 20px; }
          .section { margin-bottom: 30px; }
          .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .insight { border-left: 4px solid #d6c2a3; padding: 15px; margin: 10px 0; background: #f9f9f9; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f5f0e6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MarkeWin Analytics Report</h1>
          <p>Project: ${data.metadata.project}</p>
          <p>Generated: ${new Date(data.metadata.generated_at).toLocaleString()}</p>
        </div>
        
        <div class="section">
          <h2>Executive Summary</h2>
          <div class="metric-grid">
            ${data.metrics.map(metric => `
              <div class="metric-card">
                <h3>${metric.title}</h3>
                <p style="font-size: 24px; font-weight: bold; color: #c4a87f;">${metric.value}</p>
                <p>${metric.change} ${metric.trend === 'up' ? '↑' : '↓'}</p>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="section">
          <h2>AI Insights</h2>
          ${data.insights.map(insight => `
            <div class="insight">
              <h4>${insight.title}</h4>
              <p>${insight.description}</p>
              <p><strong>Impact:</strong> ${insight.impact} | <strong>Confidence:</strong> ${insight.confidence}%</p>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>Department Performance</h2>
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Performance</th>
                <th>Trend</th>
                <th>Budget Utilization</th>
              </tr>
            </thead>
            <tbody>
              ${data.performance.departmentMetrics.map(dept => `
                <tr>
                  <td>${dept.department}</td>
                  <td>${dept.performance}%</td>
                  <td>${dept.trend}</td>
                  <td>${((dept.spent / dept.budget) * 100).toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `markewin-report-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('HTML report generated! Open the file and use your browser\'s print function to save as PDF.');
  };

  const exportToExcel = async (data) => {
    // This would typically use a library like xlsx or exceljs
    // For now, we'll export as CSV with Excel-compatible formatting
    await exportToCSV(data);
    alert('Excel export feature coming soon! CSV file exported instead.');
  };

  const logExportActivity = async (format, metadata) => {
    try {
      await supabase.from('export_logs').insert({
        project_id: project?.id,
        export_format: format,
        metadata: metadata,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.log('Could not log export activity:', error);
    }
  };

    // Implementation would vary based on PDF library
    return data;
  };

  const shareReport = async (reportId, shareOptions = {}) => {
    try {
      const shareLink = await generateShareLink(reportId, shareOptions);
      
      if (shareOptions.method === 'email') {
        await shareViaEmail(shareLink, shareOptions.recipients);
      } else if (shareOptions.method === 'slack') {
        await shareViaSlack(shareLink, shareOptions.channel);
      } else {
        // Copy to clipboard
        await navigator.clipboard.writeText(shareLink);
        alert('Share link copied to clipboard!');
      }
      
      // Log sharing activity
      await supabase.from('share_logs').insert({
        project_id: project?.id,
        report_id: reportId,
        share_method: shareOptions.method || 'link',
        shared_with: shareOptions.recipients || shareOptions.channel,
        created_at: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Share failed:', error);
      alert('Sharing failed. Please try again.');
    }
  };

  const generateShareLink = async (reportId, options) => {
    const baseUrl = window.location.origin;
    const shareToken = Math.random().toString(36).substring(2, 15);
    
    // Store share token in database
    await supabase.from('share_tokens').insert({
      token: shareToken,
      report_id: reportId,
      project_id: project?.id,
      expires_at: new Date(Date.now() + (options.expiryDays || 7) * 24 * 60 * 60 * 1000).toISOString(),
      permissions: options.permissions || 'view'
    });
    
    return `${baseUrl}/shared/report/${shareToken}`;
  };

  const shareViaEmail = async (shareLink, recipients) => {
    const subject = `MarkeWin Analytics Report - ${project?.name}`;
    const body = `
      Hi,
      
      I'm sharing a MarkeWin analytics report with you: ${project?.name}
      
      View the report: ${shareLink}
      
      This link will expire in 7 days.
      
      Best regards,
      MarkeWin Analytics
    `;
    
    window.location.href = `mailto:${recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaSlack = async (shareLink, channel) => {
    // This would integrate with Slack API
    console.log('Slack sharing feature coming soon!', { shareLink, channel });
    alert('Slack integration coming soon! Link copied to clipboard.');
    await navigator.clipboard.writeText(shareLink);
  };

  const setupRealTimeUpdates = () => {
    if (!project) return;
    
    // Set up real-time subscriptions
    const subscription = supabase
      .channel(`analytics_${project.id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'analytics_data', filter: `project_id=eq.${project.id}` },
        (payload) => {
          console.log('Real-time update:', payload);
          refreshDashboardData();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  };

  const generateAutomatedReport = async (templateId, schedule) => {
    try {
      // Generate report using template
      const report = await supabase.from('generated_reports').insert({
        project_id: project?.id,
        template_id: templateId,
        schedule: schedule,
        data: {
          metrics: dashboardMetrics,
          insights: insights,
          performance: performanceData
        },
        status: 'generated',
        created_at: new Date().toISOString()
      });
      
      // Schedule next generation if recurring
      if (schedule.recurring) {
        await scheduleNextReport(templateId, schedule);
      }
      
      return report;
    } catch (error) {
      console.error('Automated report generation failed:', error);
    }
  };

  const scheduleNextReport = async (templateId, schedule) => {
    const nextRun = calculateNextRunTime(schedule);
    
    await supabase.from('scheduled_reports').upsert({
      template_id: templateId,
      project_id: project?.id,
      next_run: nextRun.toISOString(),
      schedule_config: schedule
    });
  };

  const calculateNextRunTime = (schedule) => {
    const now = new Date();
    const nextRun = new Date(now);
    
    switch (schedule.frequency) {
      case 'daily':
        nextRun.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        nextRun.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        nextRun.setMonth(now.getMonth() + 1);
        break;
      default:
        nextRun.setDate(now.getDate() + 1);
    }
    
  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Executive Dashboard', 
      icon: BarChart3, 
      description: 'Real-time KPIs and performance metrics',
      badge: 'Live'
    },
    { 
      id: 'insights', 
      label: 'AI Insights', 
      icon: Zap, 
      description: 'Machine learning powered recommendations',
      badge: insights.filter(i => i.created_at > new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).length.toString()
    },
    { 
      id: 'reports', 
      label: 'Report Library', 
      icon: FileText, 
      description: 'Saved and scheduled reports',
      badge: reports.length.toString()
    },
    { 
      id: 'builder', 
      label: 'Report Builder', 
      icon: Settings, 
      description: 'Create custom reports and dashboards',
      badge: 'New'
    },
    { 
      id: 'data', 
      label: 'Data Explorer', 
      icon: Database, 
      description: 'Deep dive into raw data and trends',
      badge: null
    },
    { 
      id: 'automation', 
      label: 'Smart Automation', 
      icon: Clock, 
      description: 'Automated reports and intelligent alerts',
      badge: alerts.filter(a => !a.is_read).length.toString()
    },
  ];

  const renderTabContent = () => {
    if (!project) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Project</h3>
          <p className="text-gray-500 text-center max-w-md">
            Choose a project from the Projects tab to view analytics and generate reports.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <AnalyticsDashboard 
            project={project} 
            analytics={analytics}
            reports={reports}
            onRefresh={fetchData}
          />
        );
      case 'insights':
        return (
          <div className="space-y-6">
            {/* AI Insights Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  AI-Powered Insights
                </h3>
                <button
                  onClick={generateInsights}
                  className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
              </div>
              
              <div className="grid gap-4">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.type === 'opportunity'
                        ? 'bg-green-50 border-green-400'
                        : insight.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <p className="text-gray-600 mt-1">{insight.description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            insight.impact === 'high' 
                              ? 'bg-red-100 text-red-800'
                              : insight.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {insight.impact} impact
                          </span>
                          <span className="text-xs text-gray-500">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {insight.type === 'opportunity' && <TrendingUp className="w-5 h-5 text-green-500" />}
                        {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                        {insight.type === 'trend' && <BarChart3 className="w-5 h-5 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                Active Alerts
              </h3>
              
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.severity === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {alert.severity === 'warning' ? (
                          <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <ReportLibrary 
            reports={reports}
            templates={templates}
            project={project}
            onReportSelect={setSelectedReport}
            onRefresh={fetchData}
          />
        );
      case 'builder':
        return (
          <ReportBuilder 
            project={project}
            templates={templates}
            selectedReport={selectedReport}
            onSave={fetchData}
            onCancel={() => setSelectedReport(null)}
          />
        );
      case 'data':
        return (
          <DataExplorer 
            project={project}
            analytics={analytics}
            onRefresh={fetchData}
          />
        );
      case 'automation':
        return (
          <div className="space-y-6">
            {/* Smart Automation Dashboard */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-500" />
                  Smart Automation & Alerts
                </h3>
                <button
                  onClick={() => generateAutomatedReport('comprehensive', { frequency: 'daily', recurring: true })}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Automation
                </button>
              </div>
              
              {/* Active Automations */}
              <div className="grid gap-4 mb-6">
                {[
                  {
                    id: 1,
                    name: 'Weekly Performance Report',
                    type: 'scheduled_report',
                    frequency: 'Weekly',
                    next_run: '2024-01-15T09:00:00Z',
                    status: 'active',
                    recipients: 3
                  },
                  {
                    id: 2,
                    name: 'Revenue Alert',
                    type: 'alert',
                    trigger: 'Revenue drops below target',
                    status: 'active',
                    last_triggered: '2024-01-10T14:30:00Z'
                  },
                  {
                    id: 3,
                    name: 'Customer Satisfaction Monitor',
                    type: 'monitoring',
                    frequency: 'Real-time',
                    status: 'active',
                    threshold: '< 4.5 stars'
                  }
                ].map((automation) => (
                  <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        automation.type === 'scheduled_report' ? 'bg-blue-100' :
                        automation.type === 'alert' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        {automation.type === 'scheduled_report' && <Calendar className="w-5 h-5 text-blue-600" />}
                        {automation.type === 'alert' && <Bell className="w-5 h-5 text-yellow-600" />}
                        {automation.type === 'monitoring' && <Activity className="w-5 h-5 text-green-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{automation.name}</h4>
                        <p className="text-sm text-gray-600">
                          {automation.frequency && `Frequency: ${automation.frequency}`}
                          {automation.trigger && `Trigger: ${automation.trigger}`}
                          {automation.threshold && `Threshold: ${automation.threshold}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        automation.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {automation.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Automation Templates */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Automation Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'Daily KPI Summary',
                      description: 'Get daily performance metrics via email',
                      icon: BarChart3,
                      color: 'blue'
                    },
                    {
                      name: 'Revenue Threshold Alert',
                      description: 'Alert when revenue exceeds or drops below targets',
                      icon: DollarSign,
                      color: 'green'
                    },
                    {
                      name: 'Competitive Intelligence',
                      description: 'Weekly competitive analysis and market updates',
                      icon: Target,
                      color: 'purple'
                    }
                  ].map((template, index) => {
                    const Icon = template.icon;
                    return (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                          template.color === 'blue' ? 'bg-blue-100' :
                          template.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            template.color === 'blue' ? 'text-blue-600' :
                            template.color === 'green' ? 'text-green-600' : 'text-purple-600'
                          }`} />
                        </div>
                        <h5 className="font-medium text-gray-900 mb-2">{template.name}</h5>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Set up automation →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 'scheduled':
        return (
          <ScheduledReports 
            project={project}
            reports={reports.filter(r => r.scheduled_generation)}
            onRefresh={fetchData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Generate insights, track performance, and export professional reports
            </p>
            {project && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span className="font-medium">Project:</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {project.name}
                </span>
              </div>
            )}
          </div>
          
          {project && (
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('builder')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </button>
              <button
                onClick={fetchData}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {project && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <Database className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Points</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Insights</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.scheduled_generation).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => !a.is_read).length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        {project && (
          <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="financial">Financial</option>
                    <option value="marketing">Marketing</option>
                    <option value="operations">Operations</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative group">
                  <button className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-1">
                      <button
                        onClick={() => exportData('csv')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📊 Export as CSV
                      </button>
                      <button
                        onClick={() => exportData('json')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📋 Export as JSON
                      </button>
                      <button
                        onClick={() => exportData('pdf')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📄 Export as PDF
                      </button>
                      <button
                        onClick={() => exportData('excel')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📈 Export as Excel
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-1">
                      <button
                        onClick={() => shareReport('current', { method: 'link' })}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🔗 Copy Share Link
                      </button>
                      <button
                        onClick={() => shareReport('current', { method: 'email', recipients: [] })}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ✉️ Share via Email
                      </button>
                      <button
                        onClick={() => shareReport('current', { method: 'slack' })}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        💬 Share to Slack
                      </button>
                      <button
                        onClick={() => generateAutomatedReport('default', { frequency: 'weekly', recurring: true })}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ⏰ Schedule Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex flex-col items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </div>
                  <span className={`text-xs mt-1 ${
                    isActive ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                    {tab.description}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics data...</p>
            </div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};