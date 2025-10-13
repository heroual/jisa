import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Settings, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  BarChart3,
  PieChart,
  LineChart,
  FileText,
  Users,
  DollarSign,
  Calendar,
  Target
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface ReportBuilderProps {
  project: Project;
  templates: any[];
  selectedReport: any;
  onSave: () => void;
  onCancel: () => void;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ 
  project, 
  templates, 
  selectedReport, 
  onSave, 
  onCancel 
}) => {
  const [reportData, setReportData] = useState({
    title: '',
    report_type: 'custom',
    configuration: {
      sections: [],
      styling: {
        primary_color: '#3B82F6',
        secondary_color: '#10B981'
      },
      export_options: {
        include_charts: true,
        include_raw_data: false
      }
    },
    tags: [],
    scheduled_generation: false,
    schedule_config: {}
  });
  
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (selectedReport) {
      setReportData({
        title: selectedReport.title || '',
        report_type: selectedReport.report_type || 'custom',
        configuration: selectedReport.configuration || {
          sections: [],
          styling: {
            primary_color: '#3B82F6',
            secondary_color: '#10B981'
          },
          export_options: {
            include_charts: true,
            include_raw_data: false
          }
        },
        tags: selectedReport.tags || [],
        scheduled_generation: selectedReport.scheduled_generation || false,
        schedule_config: selectedReport.schedule_config || {}
      });
    }
  }, [selectedReport]);

  const sectionTypes = [
    { id: 'summary_cards', name: 'Key Metrics Cards', icon: BarChart3, description: 'Display key performance indicators' },
    { id: 'chart', name: 'Chart Section', icon: LineChart, description: 'Add line, bar, or pie charts' },
    { id: 'financial_cards', name: 'Financial Overview', icon: DollarSign, description: 'Revenue, expenses, and profit metrics' },
    { id: 'market_analysis', name: 'Market Analysis', icon: Target, description: 'Market size, trends, and positioning' },
    { id: 'text_section', name: 'Text Section', icon: FileText, description: 'Custom text and analysis' },
    { id: 'team_overview', name: 'Team Overview', icon: Users, description: 'Team structure and roles' },
    { id: 'milestones', name: 'Milestones Timeline', icon: Calendar, description: 'Project milestones and achievements' }
  ];

  const chartTypes = [
    { id: 'line', name: 'Line Chart', icon: LineChart },
    { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
    { id: 'pie', name: 'Pie Chart', icon: PieChart }
  ];

  const handleSave = async () => {
    if (!reportData.title.trim()) {
      alert('Please enter a report title.');
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const saveData = {
        project_id: project.id,
        user_id: user.user?.id,
        title: reportData.title,
        report_type: reportData.report_type,
        configuration: reportData.configuration,
        tags: reportData.tags,
        scheduled_generation: reportData.scheduled_generation,
        schedule_config: reportData.schedule_config,
        status: 'draft'
      };

      let error;
      if (selectedReport) {
        ({ error } = await supabase
          .from('analytics_reports')
          .update(saveData)
          .eq('id', selectedReport.id));
      } else {
        ({ error } = await supabase
          .from('analytics_reports')
          .insert(saveData));
      }

      if (error) throw error;
      onSave();
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Failed to save report.');
    } finally {
      setLoading(false);
    }
  };

  const addSection = (sectionType: string) => {
    const newSection = {
      id: Date.now().toString(),
      type: sectionType,
      title: getSectionTypeInfo(sectionType).name,
      ...getDefaultSectionConfig(sectionType)
    };

    setReportData(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        sections: [...prev.configuration.sections, newSection]
      }
    }));
  };

  const removeSection = (sectionId: string) => {
    setReportData(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        sections: prev.configuration.sections.filter(s => s.id !== sectionId)
      }
    }));
  };

  const updateSection = (sectionId: string, updates: any) => {
    setReportData(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        sections: prev.configuration.sections.map(s => 
          s.id === sectionId ? { ...s, ...updates } : s
        )
      }
    }));
  };

  const getSectionTypeInfo = (type: string) => {
    return sectionTypes.find(st => st.id === type) || sectionTypes[0];
  };

  const getDefaultSectionConfig = (type: string) => {
    switch (type) {
      case 'summary_cards':
        return {
          metrics: ['total_revenue', 'customer_count', 'market_share', 'growth_rate']
        };
      case 'chart':
        return {
          chart_type: 'line',
          data_source: 'financial_data',
          show_legend: true
        };
      case 'financial_cards':
        return {
          metrics: ['revenue', 'expenses', 'profit', 'burn_rate']
        };
      case 'market_analysis':
        return {
          show_tam_sam_som: true,
          include_competitors: true
        };
      case 'text_section':
        return {
          content: 'Enter your custom content here...'
        };
      case 'team_overview':
        return {
          show_org_chart: true,
          include_roles: true
        };
      case 'milestones':
        return {
          show_timeline: true,
          include_progress: true
        };
      default:
        return {};
    }
  };

  const SectionEditor = ({ section, onUpdate, onRemove }: any) => {
    const sectionInfo = getSectionTypeInfo(section.type);
    const Icon = sectionInfo.icon;

    return (
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon className="w-5 h-5 text-blue-600 mr-2" />
            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="font-medium text-gray-900 bg-transparent border-none outline-none"
            />
          </div>
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {section.type === 'chart' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
                <select
                  value={section.chart_type || 'line'}
                  onChange={(e) => onUpdate({ chart_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {chartTypes.map(ct => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Source</label>
                <select
                  value={section.data_source || 'financial_data'}
                  onChange={(e) => onUpdate({ data_source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="financial_data">Financial Data</option>
                  <option value="market_data">Market Data</option>
                  <option value="user_data">User Data</option>
                  <option value="custom_data">Custom Data</option>
                </select>
              </div>
            </div>
          )}

          {section.type === 'text_section' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={section.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your content here..."
              />
            </div>
          )}

          {(section.type === 'summary_cards' || section.type === 'financial_cards') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metrics to Display</label>
              <div className="grid grid-cols-2 gap-2">
                {['revenue', 'expenses', 'profit', 'customers', 'growth_rate', 'market_share'].map(metric => (
                  <label key={metric} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={section.metrics?.includes(metric) || false}
                      onChange={(e) => {
                        const currentMetrics = section.metrics || [];
                        const newMetrics = e.target.checked
                          ? [...currentMetrics, metric]
                          : currentMetrics.filter((m: string) => m !== metric);
                        onUpdate({ metrics: newMetrics });
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{metric.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Report Preview</h2>
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Close Preview
          </button>
        </div>
        
        <div className="bg-white rounded-lg border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{reportData.title}</h1>
            <p className="text-gray-600 mt-2">Generated for {project.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {reportData.configuration.sections.map((section: any, index: number) => {
            const sectionInfo = getSectionTypeInfo(section.type);
            const Icon = sectionInfo.icon;
            
            return (
              <div key={section.id} className="mb-8">
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  {section.type === 'text_section' ? (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {section.content || 'Content will be generated based on your data...'}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <Icon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">
                        {sectionInfo.description} - Content will be generated from your project data
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {reportData.configuration.sections.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sections added</h3>
              <p className="text-gray-500">Add sections to see your report preview</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedReport ? 'Edit Report' : 'Create New Report'}
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Report'}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Title</label>
                <input
                  type="text"
                  value={reportData.title}
                  onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter report title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportData.report_type}
                  onChange={(e) => setReportData(prev => ({ ...prev, report_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="custom">Custom Report</option>
                  <option value="business_overview">Business Overview</option>
                  <option value="financial_summary">Financial Summary</option>
                  <option value="market_analysis">Market Analysis</option>
                  <option value="marketing_performance">Marketing Performance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Report Sections */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Report Sections</h3>
              <span className="text-sm text-gray-500">
                {reportData.configuration.sections.length} section(s)
              </span>
            </div>

            <div className="space-y-4">
              {reportData.configuration.sections.map((section: any) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  onUpdate={(updates: any) => updateSection(section.id, updates)}
                  onRemove={() => removeSection(section.id)}
                />
              ))}

              {reportData.configuration.sections.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No sections added yet</h4>
                  <p className="text-gray-500">Choose from the available sections to build your report</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Library */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Sections</h3>
            <div className="space-y-2">
              {sectionTypes.map((sectionType) => {
                const Icon = sectionType.icon;
                return (
                  <button
                    key={sectionType.id}
                    onClick={() => addSection(sectionType.id)}
                    className="w-full flex items-start p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{sectionType.name}</p>
                      <p className="text-sm text-gray-600">{sectionType.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Styling Options */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Styling</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  value={reportData.configuration.styling.primary_color}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    configuration: {
                      ...prev.configuration,
                      styling: {
                        ...prev.configuration.styling,
                        primary_color: e.target.value
                      }
                    }
                  }))}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <input
                  type="color"
                  value={reportData.configuration.styling.secondary_color}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    configuration: {
                      ...prev.configuration,
                      styling: {
                        ...prev.configuration.styling,
                        secondary_color: e.target.value
                      }
                    }
                  }))}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportData.configuration.export_options.include_charts}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    configuration: {
                      ...prev.configuration,
                      export_options: {
                        ...prev.configuration.export_options,
                        include_charts: e.target.checked
                      }
                    }
                  }))}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700">Include charts in export</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportData.configuration.export_options.include_raw_data}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    configuration: {
                      ...prev.configuration,
                      export_options: {
                        ...prev.configuration.export_options,
                        include_raw_data: e.target.checked
                      }
                    }
                  }))}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700">Include raw data</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};