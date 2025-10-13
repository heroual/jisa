import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Clock, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Calendar,
  Mail,
  Download,
  Plus,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface ScheduledReportsProps {
  project: Project;
  reports: any[];
  onRefresh: () => void;
}

export const ScheduledReports: React.FC<ScheduledReportsProps> = ({ 
  project, 
  reports, 
  onRefresh 
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: 'weekly',
    day_of_week: 1,
    day_of_month: 1,
    time: '09:00',
    recipients: [''],
    format: 'pdf',
    active: true
  });
  const [loading, setLoading] = useState(false);

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', description: 'Every day at specified time' },
    { value: 'weekly', label: 'Weekly', description: 'Every week on specified day' },
    { value: 'monthly', label: 'Monthly', description: 'Every month on specified date' },
    { value: 'quarterly', label: 'Quarterly', description: 'Every 3 months' }
  ];

  const weekDays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const handleScheduleReport = async (report: any) => {
    setSelectedReport(report);
    setScheduleConfig({
      frequency: 'weekly',
      day_of_week: 1,
      day_of_month: 1,
      time: '09:00',
      recipients: [''],
      format: 'pdf',
      active: true
    });
    setShowScheduleModal(true);
  };

  const saveSchedule = async () => {
    if (!selectedReport) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('analytics_reports')
        .update({
          scheduled_generation: true,
          schedule_config: scheduleConfig
        })
        .eq('id', selectedReport.id);

      if (error) throw error;

      setShowScheduleModal(false);
      setSelectedReport(null);
      onRefresh();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSchedule = async (reportId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('analytics_reports')
        .update({
          schedule_config: { active }
        })
        .eq('id', reportId);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error toggling schedule:', error);
      alert('Failed to update schedule.');
    }
  };

  const removeSchedule = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to remove this schedule?')) return;

    try {
      const { error } = await supabase
        .from('analytics_reports')
        .update({
          scheduled_generation: false,
          schedule_config: {}
        })
        .eq('id', reportId);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error removing schedule:', error);
      alert('Failed to remove schedule.');
    }
  };

  const generateReportNow = async (report: any) => {
    setLoading(true);
    try {
      // Simulate report generation
      const generatedData = {
        generated_at: new Date().toISOString(),
        status: 'completed',
        file_size: Math.floor(Math.random() * 5000000) + 100000, // Random file size
        download_url: '#' // Would be actual URL in production
      };

      // Update report with generated data
      const { error } = await supabase
        .from('analytics_reports')
        .update({
          generated_data: generatedData,
          status: 'published'
        })
        .eq('id', report.id);

      if (error) throw error;

      // Create export history entry
      const { data: user } = await supabase.auth.getUser();
      await supabase.from('export_history').insert({
        report_id: report.id,
        user_id: user.user?.id,
        export_format: 'pdf',
        file_size: generatedData.file_size,
        download_url: generatedData.download_url,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      });

      onRefresh();
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const getNextRunTime = (schedule: any) => {
    const now = new Date();
    const nextRun = new Date();

    switch (schedule.frequency) {
      case 'daily':
        nextRun.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        const daysUntilNext = (schedule.day_of_week - now.getDay() + 7) % 7 || 7;
        nextRun.setDate(now.getDate() + daysUntilNext);
        break;
      case 'monthly':
        nextRun.setMonth(now.getMonth() + 1);
        nextRun.setDate(schedule.day_of_month);
        break;
      case 'quarterly':
        nextRun.setMonth(now.getMonth() + 3);
        break;
    }

    const [hours, minutes] = schedule.time.split(':');
    nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return nextRun;
  };

  const addRecipient = () => {
    setScheduleConfig(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const updateRecipient = (index: number, email: string) => {
    setScheduleConfig(prev => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => i === index ? email : r)
    }));
  };

  const removeRecipient = (index: number) => {
    setScheduleConfig(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const ScheduledReportCard = ({ report }: { report: any }) => {
    const schedule = report.schedule_config || {};
    const isActive = schedule.active !== false;
    const nextRun = getNextRunTime(schedule);

    return (
      <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <span className={`ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isActive ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Paused
                  </>
                )}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  {schedule.frequency} at {schedule.time}
                  {schedule.frequency === 'weekly' && ` on ${weekDays[schedule.day_of_week]}`}
                  {schedule.frequency === 'monthly' && ` on day ${schedule.day_of_month}`}
                </span>
              </div>
              
              {isActive && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Next run: {nextRun.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>
                  {schedule.recipients?.length || 0} recipient(s)
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => generateReportNow(report)}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              <Play className="w-4 h-4 mr-1" />
              Run Now
            </button>
            
            <button
              onClick={() => toggleSchedule(report.id, !isActive)}
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Resume
                </>
              )}
            </button>
            
            <button
              onClick={() => handleScheduleReport(report)}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-4 h-4 mr-1" />
              Edit
            </button>
            
            <button
              onClick={() => removeSchedule(report.id)}
              className="flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Scheduled Reports</h2>
          <p className="text-gray-600 mt-1">Automate report generation and delivery</p>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div>
        {reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled reports</h3>
            <p className="text-gray-500 mb-4">
              Set up automated report generation to stay informed about your project's progress.
            </p>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Schedule Your First Report
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <ScheduledReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Weekly Business Report generated
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()} at 9:00 AM
                  </p>
                </div>
              </div>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Schedule Report: {selectedReport?.title || 'New Schedule'}
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Frequency</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {frequencyOptions.map(option => (
                    <label key={option.value} className="relative">
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={scheduleConfig.frequency === option.value}
                        onChange={(e) => setScheduleConfig(prev => ({ ...prev, frequency: e.target.value }))}
                        className="sr-only"
                      />
                      <div className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        scheduleConfig.frequency === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <p className="font-medium text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduleConfig.time}
                    onChange={(e) => setScheduleConfig(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {scheduleConfig.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                    <select
                      value={scheduleConfig.day_of_week}
                      onChange={(e) => setScheduleConfig(prev => ({ ...prev, day_of_week: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {weekDays.map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                      ))}
                    </select>
                  </div>
                )}

                {scheduleConfig.frequency === 'monthly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month</label>
                    <select
                      value={scheduleConfig.day_of_month}
                      onChange={(e) => setScheduleConfig(prev => ({ ...prev, day_of_month: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Recipients */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Recipients</label>
                  <button
                    type="button"
                    onClick={addRecipient}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Recipient
                  </button>
                </div>
                <div className="space-y-2">
                  {scheduleConfig.recipients.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateRecipient(index, e.target.value)}
                        placeholder="Enter email address"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {scheduleConfig.recipients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRecipient(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select
                  value={scheduleConfig.format}
                  onChange={(e) => setScheduleConfig(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSchedule}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};