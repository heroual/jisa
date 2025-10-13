import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  BarChart3,
  Table,
  Eye,
  TrendingUp,
  Calendar,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface DataExplorerProps {
  project: Project;
  analytics: any[];
  onRefresh: () => void;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ 
  project, 
  analytics, 
  onRefresh 
}) => {
  const [activeDataSource, setActiveDataSource] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue']);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [combinedData, setCombinedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const dataSources = [
    { id: 'analytics', name: 'Analytics Data', count: analytics.length, icon: BarChart3 },
    { id: 'business_plans', name: 'Business Plans', count: 0, icon: FileSpreadsheet },
    { id: 'financial_planning', name: 'Financial Data', count: 0, icon: TrendingUp },
    { id: 'market_research', name: 'Market Research', count: 0, icon: Search },
    { id: 'marketing_strategy', name: 'Marketing Data', count: 0, icon: Filter }
  ];

  const availableMetrics = [
    { id: 'revenue', name: 'Revenue', type: 'currency' },
    { id: 'users', name: 'Users', type: 'number' },
    { id: 'conversion_rate', name: 'Conversion Rate', type: 'percentage' },
    { id: 'market_share', name: 'Market Share', type: 'percentage' },
    { id: 'customer_acquisition_cost', name: 'CAC', type: 'currency' },
    { id: 'lifetime_value', name: 'LTV', type: 'currency' },
    { id: 'monthly_recurring_revenue', name: 'MRR', type: 'currency' },
    { id: 'churn_rate', name: 'Churn Rate', type: 'percentage' }
  ];

  useEffect(() => {
    fetchDataFromSources();
  }, [project, activeDataSource, dateRange]);

  const fetchDataFromSources = async () => {
    setLoading(true);
    try {
      let data: any[] = [];

      if (activeDataSource === 'analytics') {
        data = analytics;
      } else {
        // Fetch data from specific business modules
        const { data: moduleData } = await supabase
          .from(activeDataSource)
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false });

        if (moduleData) {
          data = transformModuleData(moduleData, activeDataSource);
        }
      }

      // Apply date filtering
      const filteredData = filterByDateRange(data, dateRange);
      setCombinedData(filteredData);

      // Update data source counts
      const updatedSources = dataSources.map(source => {
        if (source.id === activeDataSource) {
          return { ...source, count: filteredData.length };
        }
        return source;
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformModuleData = (data: any[], sourceType: string) => {
    return data.map((item, index) => {
      const baseRecord = {
        id: item.id,
        created_at: item.created_at,
        title: item.title,
        source: sourceType
      };

      switch (sourceType) {
        case 'business_plans':
          return {
            ...baseRecord,
            revenue: extractFinancialValue(item.financial_projections?.year_1?.revenue),
            target_revenue: extractFinancialValue(item.financial_projections?.year_1?.revenue) * 1.2,
            market_segments: item.target_audience ? 1 : 0,
            milestones: item.milestones?.length || 0
          };
        
        case 'financial_planning':
          return {
            ...baseRecord,
            revenue: extractFinancialValue(item.revenue_forecasts?.revenue_streams?.[0]?.projected_revenue),
            gross_margin: parseFloat(item.profit_margins?.gross_margin) || 0,
            net_margin: parseFloat(item.profit_margins?.net_margin) || 0,
            fixed_costs: item.cost_structure?.fixed_costs?.length || 0,
            revenue_streams: item.revenue_forecasts?.revenue_streams?.length || 0
          };
        
        case 'market_research':
          return {
            ...baseRecord,
            target_segments: item.target_segments?.length || 0,
            market_analysis: item.market_size_analysis ? 1 : 0,
            competitor_analysis: item.competitor_identification ? 1 : 0,
            positioning: item.positioning_strategy ? 1 : 0
          };
        
        case 'marketing_strategy':
          return {
            ...baseRecord,
            digital_channels: item.marketing_channels?.digital_channels?.length || 0,
            traditional_channels: item.marketing_channels?.traditional_channels?.length || 0,
            budget_allocation: extractFinancialValue(item.budget_allocation?.total_budget),
            campaign_goals: item.campaign_goals ? 1 : 0
          };
        
        default:
          return baseRecord;
      }
    });
  };

  const extractFinancialValue = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    }
    return 0;
  };

  const filterByDateRange = (data: any[], range: string) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (range) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }

    return data.filter(item => {
      const itemDate = new Date(item.created_at || item.recorded_at);
      return itemDate >= cutoffDate;
    });
  };

  const exportData = (format: 'csv' | 'json') => {
    const exportData = combinedData.map(item => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (selectedMetrics.includes(key) || ['id', 'title', 'created_at'].includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    if (format === 'csv') {
      const csv = convertToCSV(exportData);
      downloadFile(csv, `${project.name}_data_export.csv`, 'text/csv');
    } else {
      const json = JSON.stringify(exportData, null, 2);
      downloadFile(json, `${project.name}_data_export.json`, 'application/json');
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      default:
        return value.toString();
    }
  };

  const getColumnType = (columnName: string) => {
    const metric = availableMetrics.find(m => m.id === columnName);
    return metric?.type || 'text';
  };

  const filteredData = combinedData.filter(item => {
    if (!searchTerm) return true;
    
    return Object.values(item).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const DataSourceCard = ({ source }: { source: any }) => {
    const Icon = source.icon;
    return (
      <button
        onClick={() => setActiveDataSource(source.id)}
        className={`w-full p-4 text-left border rounded-lg transition-colors ${
          activeDataSource === source.id
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon className={`w-5 h-5 mr-3 ${
              activeDataSource === source.id ? 'text-blue-600' : 'text-gray-500'
            }`} />
            <div>
              <p className={`font-medium ${
                activeDataSource === source.id ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {source.name}
              </p>
              <p className="text-sm text-gray-500">{source.count} records</p>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Data Explorer</h2>
          <p className="text-gray-600 mt-1">Explore and analyze your project data</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Data Sources */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Data Sources</h3>
          {dataSources.map(source => (
            <DataSourceCard key={source.id} source={source} />
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewMode === 'table' 
                        ? 'bg-white text-gray-900 shadow' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Table className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('chart')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewMode === 'chart' 
                        ? 'bg-white text-gray-900 shadow' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportData('csv')}
                  className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-1" />
                  CSV
                </button>
                <button
                  onClick={() => exportData('json')}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-1" />
                  JSON
                </button>
              </div>
            </div>

            {/* Metric Selection */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Select Metrics to Display:</p>
              <div className="flex flex-wrap gap-2">
                {availableMetrics.map(metric => (
                  <label key={metric.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMetrics.includes(metric.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMetrics(prev => [...prev, metric.id]);
                        } else {
                          setSelectedMetrics(prev => prev.filter(m => m !== metric.id));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{metric.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Data Display */}
          <div className="bg-white rounded-lg border">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading data...</p>
                </div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Try adjusting your search criteria' 
                    : 'No data available for the selected source and date range'}
                </p>
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      {selectedMetrics.map(metric => {
                        const metricInfo = availableMetrics.find(m => m.id === metric);
                        return (
                          <th key={metric} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {metricInfo?.name || metric}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {item.title || item.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(item.created_at || item.recorded_at).toLocaleDateString()}
                        </td>
                        {selectedMetrics.map(metric => (
                          <td key={metric} className="px-4 py-4 text-sm text-gray-900">
                            {formatValue(item[metric], getColumnType(metric))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chart View</h3>
                  <p className="text-gray-500">
                    Chart visualization will be implemented with a charting library
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Data Summary */}
          {filteredData.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-medium text-gray-900 mb-3">Data Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{filteredData.length}</p>
                  <p className="text-sm text-gray-500">Total Records</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {new Date(Math.min(...filteredData.map(d => new Date(d.created_at || d.recorded_at).getTime()))).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Earliest Date</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {new Date(Math.max(...filteredData.map(d => new Date(d.created_at || d.recorded_at).getTime()))).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Latest Date</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{selectedMetrics.length}</p>
                  <p className="text-sm text-gray-500">Selected Metrics</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};