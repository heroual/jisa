-- Analytics and Reporting Tables
CREATE TABLE analytics_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('business_overview', 'financial_summary', 'market_analysis', 'marketing_performance', 'custom')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    configuration JSONB DEFAULT '{}',
    generated_data JSONB DEFAULT '{}',
    export_formats TEXT[] DEFAULT ARRAY['pdf', 'excel', 'csv'],
    scheduled_generation BOOLEAN DEFAULT false,
    schedule_config JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) NOT NULL,
    is_public BOOLEAN DEFAULT true,
    template_config JSONB NOT NULL,
    preview_image_url TEXT,
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE project_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ DEFAULT now(),
    metric_type VARCHAR(50) NOT NULL,
    metric_value NUMERIC,
    metric_data JSONB DEFAULT '{}',
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ
);

CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    widget_type VARCHAR(50) NOT NULL,
    widget_config JSONB NOT NULL,
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 1,
    height INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE export_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES analytics_reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exported_at TIMESTAMPTZ DEFAULT now(),
    export_format VARCHAR(20) NOT NULL,
    file_size INTEGER,
    download_url TEXT,
    expires_at TIMESTAMPTZ
);

-- Insert default report templates
INSERT INTO report_templates (name, description, template_type, template_config) VALUES
('Executive Summary Report', 'Comprehensive business overview with key metrics and insights', 'business_overview', '{
    "sections": [
        {"type": "summary_cards", "title": "Key Metrics", "metrics": ["total_revenue", "customer_count", "market_share", "growth_rate"]},
        {"type": "chart", "title": "Revenue Trend", "chart_type": "line", "data_source": "financial_data"},
        {"type": "market_analysis", "title": "Market Position", "include_competitors": true},
        {"type": "milestones", "title": "Key Achievements", "show_timeline": true}
    ],
    "styling": {"primary_color": "#3B82F6", "secondary_color": "#10B981"},
    "export_options": {"include_charts": true, "include_raw_data": false}
}'),

('Financial Performance Dashboard', 'Detailed financial analysis with projections and breakdowns', 'financial_summary', '{
    "sections": [
        {"type": "financial_cards", "title": "Financial Overview", "metrics": ["revenue", "expenses", "profit", "burn_rate"]},
        {"type": "chart", "title": "Revenue vs Expenses", "chart_type": "bar", "data_source": "financial_planning"},
        {"type": "cost_breakdown", "title": "Cost Structure", "show_categories": true},
        {"type": "projections", "title": "Financial Projections", "periods": 12}
    ],
    "styling": {"primary_color": "#10B981", "secondary_color": "#F59E0B"},
    "filters": {"date_range": true, "categories": true}
}'),

('Market Research Insights', 'Market analysis with competitor intelligence and trends', 'market_analysis', '{
    "sections": [
        {"type": "market_size", "title": "Market Opportunity", "show_tam_sam_som": true},
        {"type": "competitor_matrix", "title": "Competitive Landscape", "include_positioning": true},
        {"type": "trends", "title": "Market Trends", "show_growth_indicators": true},
        {"type": "segments", "title": "Target Segments", "show_potential": true}
    ],
    "styling": {"primary_color": "#8B5CF6", "secondary_color": "#EC4899"},
    "data_visualization": {"charts": true, "maps": false, "tables": true}
}'),

('Marketing Performance Report', 'Marketing effectiveness and ROI analysis', 'marketing_performance', '{
    "sections": [
        {"type": "channel_performance", "title": "Channel Effectiveness", "show_roi": true},
        {"type": "campaign_results", "title": "Campaign Performance", "include_conversions": true},
        {"type": "funnel_analysis", "title": "Marketing Funnel", "show_drop_offs": true},
        {"type": "budget_utilization", "title": "Budget Analysis", "show_allocation": true}
    ],
    "styling": {"primary_color": "#F59E0B", "secondary_color": "#EF4444"},
    "metrics": {"conversion_rates": true, "cost_per_acquisition": true, "lifetime_value": true}
}');

-- Create indexes for better performance
CREATE INDEX idx_analytics_reports_project_id ON analytics_reports(project_id);
CREATE INDEX idx_analytics_reports_user_id ON analytics_reports(user_id);
CREATE INDEX idx_analytics_reports_type ON analytics_reports(report_type);
CREATE INDEX idx_project_analytics_project_id ON project_analytics(project_id);
CREATE INDEX idx_project_analytics_metric_type ON project_analytics(metric_type);
CREATE INDEX idx_project_analytics_recorded_at ON project_analytics(recorded_at);
CREATE INDEX idx_dashboard_widgets_user_project ON dashboard_widgets(user_id, project_id);

-- Create updated_at trigger for analytics_reports
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_analytics_reports_updated_at BEFORE UPDATE ON analytics_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();