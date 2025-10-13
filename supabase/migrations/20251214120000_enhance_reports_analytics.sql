-- Enhanced Reports & Analytics Schema
-- Create comprehensive tables for modern analytics features

-- Report Templates table
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Reports table
CREATE TABLE IF NOT EXISTS generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  template_id UUID REFERENCES report_templates(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  report_data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  scheduled_generation BOOLEAN DEFAULT false,
  schedule_config JSONB,
  file_url TEXT,
  sharing_config JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Insights table
CREATE TABLE IF NOT EXISTS analytics_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL, -- 'opportunity', 'warning', 'trend'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  impact_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  data_sources JSONB,
  recommendations JSONB,
  is_actionable BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Analytics Alerts table
CREATE TABLE IF NOT EXISTS analytics_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- 'performance', 'data', 'system'
  severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'critical'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  trigger_conditions JSONB,
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data Export Logs table
CREATE TABLE IF NOT EXISTS data_export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  export_type VARCHAR(50) NOT NULL, -- 'pdf', 'csv', 'excel', 'json'
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  file_url TEXT,
  export_config JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Dashboard Configurations table
CREATE TABLE IF NOT EXISTS dashboard_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  config_name VARCHAR(255) DEFAULT 'Default Dashboard',
  layout_config JSONB NOT NULL,
  widget_preferences JSONB,
  filters JSONB,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id, config_name)
);

-- Scheduled Tasks table for automation
CREATE TABLE IF NOT EXISTS scheduled_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_type VARCHAR(50) NOT NULL, -- 'report_generation', 'data_sync', 'alert_check'
  task_name VARCHAR(255) NOT NULL,
  schedule_expression VARCHAR(100) NOT NULL, -- cron expression
  task_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  run_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_report_templates_category ON report_templates(category);
CREATE INDEX idx_report_templates_public ON report_templates(is_public) WHERE is_public = true;
CREATE INDEX idx_generated_reports_project ON generated_reports(project_id);
CREATE INDEX idx_generated_reports_status ON generated_reports(status);
CREATE INDEX idx_generated_reports_scheduled ON generated_reports(scheduled_generation) WHERE scheduled_generation = true;
CREATE INDEX idx_analytics_insights_project ON analytics_insights(project_id);
CREATE INDEX idx_analytics_insights_type ON analytics_insights(insight_type);
CREATE INDEX idx_analytics_insights_impact ON analytics_insights(impact_level);
CREATE INDEX idx_analytics_alerts_project ON analytics_alerts(project_id);
CREATE INDEX idx_analytics_alerts_unread ON analytics_alerts(is_read) WHERE is_read = false;
CREATE INDEX idx_data_export_logs_project ON data_export_logs(project_id);
CREATE INDEX idx_data_export_logs_status ON data_export_logs(status);
CREATE INDEX idx_dashboard_configs_project_user ON dashboard_configs(project_id, user_id);
CREATE INDEX idx_scheduled_tasks_project ON scheduled_tasks(project_id);
CREATE INDEX idx_scheduled_tasks_active ON scheduled_tasks(is_active) WHERE is_active = true;

-- Insert sample report templates
INSERT INTO report_templates (name, description, category, template_data, is_public, usage_count) VALUES
('Executive Summary Report', 'Comprehensive executive summary with key metrics and insights', 'executive', 
 '{"sections": ["overview", "key_metrics", "financial_summary", "recommendations"], "charts": ["revenue_trend", "market_share", "performance_indicators"], "timeframe": "monthly"}', 
 true, 125),
('Financial Performance Report', 'Detailed financial analysis and projections', 'financial', 
 '{"sections": ["revenue_analysis", "cost_breakdown", "profit_margins", "cash_flow"], "charts": ["revenue_chart", "expense_chart", "profit_trend"], "timeframe": "quarterly"}', 
 true, 98),
('Marketing Campaign Report', 'Marketing performance and ROI analysis', 'marketing', 
 '{"sections": ["campaign_overview", "performance_metrics", "audience_insights", "roi_analysis"], "charts": ["conversion_funnel", "channel_performance", "audience_demographics"], "timeframe": "campaign"}', 
 true, 87),
('Market Research Report', 'Comprehensive market analysis and competitive intelligence', 'research', 
 '{"sections": ["market_overview", "competitive_analysis", "target_segments", "opportunities"], "charts": ["market_size", "competitor_comparison", "segment_analysis"], "timeframe": "annual"}', 
 true, 76),
('Operational Dashboard', 'Real-time operational metrics and KPIs', 'operations', 
 '{"sections": ["key_metrics", "performance_indicators", "alerts", "trends"], "charts": ["performance_gauge", "trend_lines", "comparison_charts"], "timeframe": "real-time"}', 
 true, 134);

-- Add RLS (Row Level Security) policies
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_export_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_tasks ENABLE ROW LEVEL SECURITY;

-- Policies for report_templates
CREATE POLICY "Public templates are viewable by everyone" ON report_templates
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own templates" ON report_templates
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create templates" ON report_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates" ON report_templates
  FOR UPDATE USING (auth.uid() = created_by);

-- Policies for generated_reports
CREATE POLICY "Users can view reports for their projects" ON generated_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = generated_reports.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reports for their projects" ON generated_reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = generated_reports.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Similar policies for other tables...
CREATE POLICY "Users can view insights for their projects" ON analytics_insights
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = analytics_insights.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view alerts for their projects" ON analytics_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = analytics_alerts.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_report_templates_updated_at BEFORE UPDATE ON report_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_reports_updated_at BEFORE UPDATE ON generated_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_configs_updated_at BEFORE UPDATE ON dashboard_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_tasks_updated_at BEFORE UPDATE ON scheduled_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();