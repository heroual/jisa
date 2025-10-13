import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  Star,
  Filter,
  Search,
  Plus,
  Play
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface ReportLibraryProps {
  reports: any[];
  templates: any[];
  project: Project;
  onReportSelect: (report: any) => void;
  onRefresh: () => void;
}

export const ReportLibrary: React.FC<ReportLibraryProps> = ({ 
  reports, 
  templates, 
  project, 
  onReportSelect, 
  onRefresh 
}) => {
  const [activeView, setActiveView] = useState<'reports' | 'templates'>('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);

  const createReportFromTemplate = async (template: any) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const newReport = {
        project_id: project.id,
        user_id: user.user?.id,
        title: `${template.name} - ${project.name}`,
        report_type: template.template_type,
        status: 'draft',
        configuration: template.template_config,
        generated_data: {},
        tags: []
      };

      const { data, error } = await supabase
        .from('analytics_reports')
        .insert(newReport)
        .select()
        .single();

      if (error) throw error;

      // Update template usage count
      await supabase
        .from('report_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', template.id);

      onRefresh();
      onReportSelect(data);
    } catch (error) {
      console.error('Error creating report from template:', error);
      alert('Failed to create report from template.');
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      const { error } = await supabase
        .from('analytics_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report.');
    }
  };

  const generateReport = async (report: any) => {
    setLoading(true);
    try {
      // Simulate report generation
      const generatedData = {
        generated_at: new Date().toISOString(),
        sections: generateReportSections(report.configuration),
        charts: generateChartData(report.report_type),
        summary: generateExecutiveSummary(report.report_type)
      };

      const { error } = await supabase
        .from('analytics_reports')
        .update({ 
          generated_data: generatedData,
          status: 'published'
        })
        .eq('id', report.id);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const generateReportSections = (config: any) => {
    const sections = config.sections || [];
    return sections.map((section: any) => ({
      ...section,
      data: generateSectionData(section.type),
      generated: true
    }));
  };

  const generateSectionData = (sectionType: string) => {
    switch (sectionType) {
      case 'summary_cards':
        return {
          metrics: [
            { name: 'Total Revenue', value: '$125,000', change: '+12.5%' },
            { name: 'Customer Count', value: '1,250', change: '+8.3%' },
            { name: 'Market Share', value: '2.3%', change: '+0.7%' },
            { name: 'Growth Rate', value: '15.2%', change: '+2.1%' }
          ]
        };
      case 'chart':
        return {
          chartData: Array.from({ length: 12 }, (_, i) => ({
            month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
            value: Math.random() * 10000 + 5000
          }))
        };
      case 'market_analysis':
        return {
          marketSize: '$2.1B TAM, $450M SAM',
          competitors: ['Asana', 'Monday.com', 'Trello'],
          position: 'Growing market share in creative agency segment'
        };
      default:
        return { placeholder: `Data for ${sectionType} section` };
    }
  };

  const generateChartData = (reportType: string) => {
    return {
      primary: Array.from({ length: 6 }, (_, i) => ({
        name: `Period ${i + 1}`,
        value: Math.random() * 1000 + 100
      })),
      secondary: Array.from({ length: 4 }, (_, i) => ({
        category: ['Product', 'Marketing', 'Operations', 'R&D'][i],
        value: Math.random() * 50 + 10
      }))
    };
  };

  const generateExecutiveSummary = (reportType: string) => {
    const summaries = {
      business_overview: 'Strong performance across key metrics with 12.5% revenue growth and expanding market presence in target segments.',
      financial_summary: 'Healthy financial position with positive cash flow, controlled burn rate, and projections on track for profitability.',
      market_analysis: 'Market opportunity remains strong with identified growth vectors in creative agency segment.',
      marketing_performance: 'Marketing campaigns showing strong ROI with effective channel performance and improving conversion rates.'
    };
    
    return summaries[reportType] || 'Report generated successfully with comprehensive analysis of current business metrics.';
  };

  const exportReport = async (report: any, format: string) => {
    // Simulate export functionality
    alert(`Exporting ${report.title} as ${format.toUpperCase()}...`);
    
    // In a real implementation, this would generate and download the file
    const exportData = {
      report_id: report.id,
      format,
      generated_at: new Date().toISOString(),
      project_name: project.name
    };
    
    console.log('Export data:', exportData);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || template.template_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.report_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const TemplateCard = ({ template }: { template: any }) => (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            <div className="flex items-center mt-3 space-x-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {template.template_type.replace('_', ' ')}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="w-4 h-4 mr-1" />
                Used {template.usage_count || 0} times
              </div>
            </div>
          </div>
          <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
        </div>
        
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => createReportFromTemplate(template)}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Use Template
          </button>
          <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );

  const ReportCard = ({ report }: { report: any }) => (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <span className={`ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                report.status === 'published' ? 'bg-green-100 text-green-800' :
                report.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {report.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Created {new Date(report.created_at).toLocaleDateString()}
            </p>
            <div className="flex items-center mt-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {report.report_type.replace('_', ' ')}
              </span>
              {report.scheduled_generation && (
                <div className="flex items-center ml-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Scheduled
                </div>
              )}
            </div>
          </div>
          <FileText className="w-8 h-8 text-purple-600 flex-shrink-0" />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {report.status === 'draft' ? (
            <button
              onClick={() => generateReport(report)}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors"
            >
              <Play className="w-4 h-4 mr-1" />
              Generate
            </button>
          ) : (
            <>
              <button
                onClick={() => exportReport(report, 'pdf')}
                className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                PDF
              </button>
              <button
                onClick={() => exportReport(report, 'excel')}
                className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                Excel
              </button>
            </>
          )}
          <button
            onClick={() => onReportSelect(report)}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => deleteReport(report.id)}
            className="flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">Report Library</h2>
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveView('templates')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeView === 'templates' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Templates ({templates.length})
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeView === 'reports' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Reports ({reports.length})
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeView}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="business_overview">Business Overview</option>
          <option value="financial_summary">Financial Summary</option>
          <option value="market_analysis">Market Analysis</option>
          <option value="marketing_performance">Marketing Performance</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Content */}
      <div>
        {activeView === 'templates' ? (
          <div>
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-500 mb-4">
                  {reports.length === 0 
                    ? "You haven't created any reports yet." 
                    : "Try adjusting your search or filter criteria."}
                </p>
                {reports.length === 0 && (
                  <button
                    onClick={() => setActiveView('templates')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Browse Templates
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};