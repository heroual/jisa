
CREATE TABLE market_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    market_size_analysis TEXT,
    market_trends_tracking TEXT,
    competitor_identification TEXT,
    positioning_strategy TEXT,
    target_segments JSONB,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE financial_planning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    pricing_strategy TEXT,
    cost_structure JSONB,
    revenue_forecasts JSONB,
    profit_margins JSONB,
    break_even_analysis TEXT,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE marketing_strategy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    marketing_channels JSONB,
    campaign_goals TEXT,
    funnel_strategies TEXT,
    retention_tactics TEXT,
    budget_allocation JSONB,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE business_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    executive_summary TEXT,
    value_proposition TEXT,
    target_audience TEXT,
    revenue_model TEXT,
    go_to_market_strategy TEXT,
    financial_projections JSONB,
    team_structure TEXT,
    milestones JSONB,
    title VARCHAR(255) NOT NULL
);
