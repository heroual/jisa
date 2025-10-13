-- Enhanced Analytics Features Migration
-- This migration adds modern analytics capabilities to MarkeWin

-- Analytics Data table for storing time-series metrics
CREATE TABLE IF NOT EXISTS analytics_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metric_data JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Insights table for storing machine learning insights
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- opportunity, warning, trend, prediction
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    impact VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    confidence INTEGER DEFAULT 50, -- 0-100
    tags TEXT[] DEFAULT '{}',
    action_items TEXT[] DEFAULT '{}',
    expected_outcome TEXT,
    timeframe VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active', -- active, resolved, dismissed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smart Alerts table for automated notifications
CREATE TABLE IF NOT EXISTS smart_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- performance, data, opportunity, threat
    severity VARCHAR(20) DEFAULT 'info', -- info, warning, error, success
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    auto_actions_available BOOLEAN DEFAULT FALSE,
    estimated_impact TEXT,
    confidence INTEGER DEFAULT 50,
    is_read BOOLEAN DEFAULT FALSE,
    dismissed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report Templates table for customizable report templates
CREATE TABLE IF NOT EXISTS report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    template_config JSONB NOT NULL DEFAULT '{}',
    sections TEXT[] DEFAULT '{}', -- dashboard, insights, performance, etc.
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    category VARCHAR(50) DEFAULT 'general',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Reports table for storing generated reports
CREATE TABLE IF NOT EXISTS generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    format VARCHAR(20) DEFAULT 'json', -- json, pdf, csv, excel
    status VARCHAR(20) DEFAULT 'draft', -- draft, generated, published, archived
    scheduled_generation JSONB, -- scheduling configuration
    share_settings JSONB DEFAULT '{}',
    generated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Reports table for automated report generation
CREATE TABLE IF NOT EXISTS scheduled_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    schedule_config JSONB NOT NULL DEFAULT '{}', -- frequency, time, recipients
    next_run TIMESTAMPTZ NOT NULL,
    last_run TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Share Tokens table for secure report sharing
CREATE TABLE IF NOT EXISTS share_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(100) UNIQUE NOT NULL,
    report_id UUID REFERENCES generated_reports(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permissions VARCHAR(20) DEFAULT 'view', -- view, comment, edit
    expires_at TIMESTAMPTZ NOT NULL,
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Export Logs table for tracking export activities
CREATE TABLE IF NOT EXISTS export_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    export_format VARCHAR(20) NOT NULL,
    metadata JSONB DEFAULT '{}',
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Share Logs table for tracking sharing activities
CREATE TABLE IF NOT EXISTS share_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_id UUID REFERENCES generated_reports(id) ON DELETE SET NULL,
    share_method VARCHAR(50) NOT NULL, -- email, slack, link
    shared_with TEXT, -- recipients or channel
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Metrics table for KPI tracking
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    current_value DECIMAL(15,4) NOT NULL,
    target_value DECIMAL(15,4),
    unit VARCHAR(20),
    category VARCHAR(50) DEFAULT 'general',
    status VARCHAR(20) DEFAULT 'on-track', -- ahead, on-track, behind, critical
    trend VARCHAR(10) DEFAULT 'stable', -- up, down, stable
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Benchmarking Data table for industry comparisons
CREATE TABLE IF NOT EXISTS benchmarking_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    company_size VARCHAR(50), -- startup, small, medium, large, enterprise
    region VARCHAR(50),
    industry_average DECIMAL(15,4) NOT NULL,
    percentile_25 DECIMAL(15,4),
    percentile_50 DECIMAL(15,4),
    percentile_75 DECIMAL(15,4),
    percentile_90 DECIMAL(15,4),
    data_source VARCHAR(100),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Rules table for smart automations
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- alert, report, action
    trigger_conditions JSONB NOT NULL DEFAULT '{}',
    actions JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered TIMESTAMPTZ,
    trigger_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_data_project_metric ON analytics_data(project_id, metric_type, recorded_at);
CREATE INDEX IF NOT EXISTS idx_analytics_data_recorded_at ON analytics_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_project_status ON ai_insights(project_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type_confidence ON ai_insights(insight_type, confidence DESC);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_project_unread ON smart_alerts(project_id, is_read);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_priority ON smart_alerts(priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_reports_project_status ON generated_reports(project_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_next_run ON scheduled_reports(next_run, is_active);
CREATE INDEX IF NOT EXISTS idx_share_tokens_token ON share_tokens(token);
CREATE INDEX IF NOT EXISTS idx_share_tokens_expires ON share_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_project_date ON performance_metrics(project_id, recorded_date DESC);
CREATE INDEX IF NOT EXISTS idx_benchmarking_data_metric_industry ON benchmarking_data(metric_name, industry);

-- Create Row Level Security policies
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarking_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

-- Policies for analytics_data
CREATE POLICY "Users can view their own analytics data" ON analytics_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analytics data" ON analytics_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analytics data" ON analytics_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analytics data" ON analytics_data FOR DELETE USING (auth.uid() = user_id);

-- Policies for ai_insights
CREATE POLICY "Users can view their own insights" ON ai_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own insights" ON ai_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own insights" ON ai_insights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own insights" ON ai_insights FOR DELETE USING (auth.uid() = user_id);

-- Policies for smart_alerts
CREATE POLICY "Users can view their own alerts" ON smart_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own alerts" ON smart_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON smart_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON smart_alerts FOR DELETE USING (auth.uid() = user_id);

-- Policies for report_templates
CREATE POLICY "Users can view public templates and their own" ON report_templates FOR SELECT USING (is_public = true OR auth.uid() = created_by);
CREATE POLICY "Users can insert their own templates" ON report_templates FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own templates" ON report_templates FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own templates" ON report_templates FOR DELETE USING (auth.uid() = created_by);

-- Policies for generated_reports
CREATE POLICY "Users can view their own reports" ON generated_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reports" ON generated_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reports" ON generated_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reports" ON generated_reports FOR DELETE USING (auth.uid() = user_id);

-- Policies for scheduled_reports
CREATE POLICY "Users can view their own scheduled reports" ON scheduled_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scheduled reports" ON scheduled_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scheduled reports" ON scheduled_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scheduled reports" ON scheduled_reports FOR DELETE USING (auth.uid() = user_id);

-- Public access for benchmarking_data (read-only)
CREATE POLICY "Everyone can view benchmarking data" ON benchmarking_data FOR SELECT TO PUBLIC USING (true);

-- Other policies follow similar pattern...

-- Insert some sample report templates
INSERT INTO report_templates (name, description, template_config, sections, is_public, category) VALUES
('Executive Dashboard', 'High-level KPIs and performance metrics for leadership', 
 '{"widgets": ["revenue", "customers", "satisfaction", "market_share"], "timeframe": "monthly"}',
 ARRAY['dashboard', 'insights', 'performance'], true, 'executive'),
 
('Marketing Performance', 'Comprehensive marketing analytics and ROI tracking',
 '{"widgets": ["conversion_rate", "cac", "ltv", "channel_performance"], "timeframe": "weekly"}',
 ARRAY['marketing', 'analytics', 'roi'], true, 'marketing'),
 
('Financial Analysis', 'Revenue, costs, and profitability analysis',
 '{"widgets": ["revenue", "costs", "profit_margin", "cash_flow"], "timeframe": "monthly"}',
 ARRAY['financial', 'revenue', 'costs'], true, 'financial'),
 
('Customer Insights', 'Customer behavior, satisfaction, and retention analysis',
 '{"widgets": ["satisfaction", "retention", "churn", "behavior"], "timeframe": "weekly"}',
 ARRAY['customer', 'behavior', 'satisfaction'], true, 'customer'),
 
('Competitive Intelligence', 'Market positioning and competitive analysis',
 '{"widgets": ["market_share", "competition", "positioning", "opportunities"], "timeframe": "monthly"}',
 ARRAY['competitive', 'market', 'positioning'], true, 'market');

-- Insert sample benchmarking data
INSERT INTO benchmarking_data (metric_name, industry, company_size, industry_average, percentile_25, percentile_50, percentile_75, percentile_90, data_source) VALUES
('Revenue Growth Rate', 'SaaS', 'startup', 15.2, 8.5, 15.2, 24.7, 35.8, 'Industry Report 2024'),
('Customer Acquisition Cost', 'SaaS', 'startup', 85.0, 45.0, 85.0, 125.0, 180.0, 'Industry Report 2024'),
('Customer Lifetime Value', 'SaaS', 'startup', 1200.0, 650.0, 1200.0, 1850.0, 2800.0, 'Industry Report 2024'),
('Monthly Churn Rate', 'SaaS', 'startup', 5.8, 2.1, 5.8, 8.9, 15.2, 'Industry Report 2024'),
('Net Promoter Score', 'SaaS', 'startup', 42.0, 25.0, 42.0, 58.0, 75.0, 'Industry Report 2024');

COMMENT ON TABLE analytics_data IS 'Time-series metrics data for comprehensive analytics';
COMMENT ON TABLE ai_insights IS 'AI-generated business insights and recommendations';
COMMENT ON TABLE smart_alerts IS 'Automated alerts and notifications system';
COMMENT ON TABLE report_templates IS 'Customizable report templates for different use cases';
COMMENT ON TABLE generated_reports IS 'Generated reports with scheduling and sharing capabilities';
COMMENT ON TABLE benchmarking_data IS 'Industry benchmarking data for competitive analysis';
COMMENT ON TABLE automation_rules IS 'Smart automation rules for alerts and actions';