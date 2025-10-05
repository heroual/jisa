/*
  # Business Consultant App Database Schema

  ## Overview
  Complete database schema for AI Business Consultant application with user management,
  business projects, analysis modules, and consultation history.

  ## New Tables

  ### 1. `profiles`
  User profile information extending auth.users
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `company_name` (text, optional)
  - `industry` (text, optional)
  - `country` (text, default 'Morocco')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `business_projects`
  User's business projects/ideas being analyzed
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `name` (text)
  - `description` (text)
  - `industry` (text)
  - `stage` (text: idea, startup, growth, mature)
  - `target_market` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `idea_validations`
  Business idea validation results
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `strengths` (jsonb)
  - `weaknesses` (jsonb)
  - `opportunities` (jsonb)
  - `threats` (jsonb)
  - `success_score` (integer, 0-100)
  - `recommendations` (jsonb)
  - `created_at` (timestamptz)

  ### 4. `market_research`
  Market analysis and competitor research
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `market_size` (text)
  - `market_trends` (jsonb)
  - `competitors` (jsonb)
  - `positioning_strategy` (text)
  - `target_segments` (jsonb)
  - `created_at` (timestamptz)

  ### 5. `financial_plans`
  Financial planning and forecasts
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `pricing_strategy` (jsonb)
  - `cost_structure` (jsonb)
  - `revenue_forecast` (jsonb)
  - `profit_margins` (jsonb)
  - `break_even_analysis` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `marketing_strategies`
  Marketing and sales strategies
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `channels` (jsonb)
  - `campaigns` (jsonb)
  - `funnel_strategy` (jsonb)
  - `retention_tactics` (jsonb)
  - `budget_allocation` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. `business_plans`
  Complete business plan documents
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `executive_summary` (text)
  - `value_proposition` (text)
  - `target_audience` (jsonb)
  - `revenue_model` (text)
  - `go_to_market` (jsonb)
  - `financial_projections` (jsonb)
  - `team_structure` (jsonb)
  - `milestones` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. `automation_suggestions`
  AI automation recommendations
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `task_name` (text)
  - `task_description` (text)
  - `time_saved_hours` (numeric)
  - `recommended_tools` (jsonb)
  - `implementation_complexity` (text: low, medium, high)
  - `priority` (text: low, medium, high)
  - `status` (text, default 'suggested')
  - `created_at` (timestamptz)

  ### 9. `consultation_history`
  Q&A chat history and consultations
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `project_id` (uuid, references business_projects, optional)
  - `question` (text)
  - `answer` (text)
  - `category` (text)
  - `created_at` (timestamptz)

  ### 10. `reports`
  Generated reports and exports
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `project_id` (uuid, references business_projects)
  - `report_type` (text)
  - `title` (text)
  - `content` (jsonb)
  - `format` (text: pdf, word, json)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated access required for all operations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  company_name text,
  industry text,
  country text DEFAULT 'Morocco',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create business_projects table
CREATE TABLE IF NOT EXISTS business_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  industry text,
  stage text DEFAULT 'idea',
  target_market text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON business_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON business_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON business_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON business_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create idea_validations table
CREATE TABLE IF NOT EXISTS idea_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  strengths jsonb DEFAULT '[]'::jsonb,
  weaknesses jsonb DEFAULT '[]'::jsonb,
  opportunities jsonb DEFAULT '[]'::jsonb,
  threats jsonb DEFAULT '[]'::jsonb,
  success_score integer DEFAULT 0,
  recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE idea_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own validations"
  ON idea_validations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own validations"
  ON idea_validations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own validations"
  ON idea_validations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own validations"
  ON idea_validations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create market_research table
CREATE TABLE IF NOT EXISTS market_research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  market_size text,
  market_trends jsonb DEFAULT '[]'::jsonb,
  competitors jsonb DEFAULT '[]'::jsonb,
  positioning_strategy text,
  target_segments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE market_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own market research"
  ON market_research FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own market research"
  ON market_research FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own market research"
  ON market_research FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own market research"
  ON market_research FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create financial_plans table
CREATE TABLE IF NOT EXISTS financial_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pricing_strategy jsonb DEFAULT '{}'::jsonb,
  cost_structure jsonb DEFAULT '{}'::jsonb,
  revenue_forecast jsonb DEFAULT '{}'::jsonb,
  profit_margins jsonb DEFAULT '{}'::jsonb,
  break_even_analysis text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE financial_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own financial plans"
  ON financial_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial plans"
  ON financial_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial plans"
  ON financial_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial plans"
  ON financial_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create marketing_strategies table
CREATE TABLE IF NOT EXISTS marketing_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channels jsonb DEFAULT '[]'::jsonb,
  campaigns jsonb DEFAULT '[]'::jsonb,
  funnel_strategy jsonb DEFAULT '{}'::jsonb,
  retention_tactics jsonb DEFAULT '[]'::jsonb,
  budget_allocation jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE marketing_strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own marketing strategies"
  ON marketing_strategies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own marketing strategies"
  ON marketing_strategies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own marketing strategies"
  ON marketing_strategies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own marketing strategies"
  ON marketing_strategies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create business_plans table
CREATE TABLE IF NOT EXISTS business_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  executive_summary text,
  value_proposition text,
  target_audience jsonb DEFAULT '[]'::jsonb,
  revenue_model text,
  go_to_market jsonb DEFAULT '{}'::jsonb,
  financial_projections jsonb DEFAULT '{}'::jsonb,
  team_structure jsonb DEFAULT '[]'::jsonb,
  milestones jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own business plans"
  ON business_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business plans"
  ON business_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business plans"
  ON business_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own business plans"
  ON business_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create automation_suggestions table
CREATE TABLE IF NOT EXISTS automation_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_name text NOT NULL,
  task_description text,
  time_saved_hours numeric DEFAULT 0,
  recommended_tools jsonb DEFAULT '[]'::jsonb,
  implementation_complexity text DEFAULT 'medium',
  priority text DEFAULT 'medium',
  status text DEFAULT 'suggested',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE automation_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automation suggestions"
  ON automation_suggestions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own automation suggestions"
  ON automation_suggestions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own automation suggestions"
  ON automation_suggestions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own automation suggestions"
  ON automation_suggestions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create consultation_history table
CREATE TABLE IF NOT EXISTS consultation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES business_projects(id) ON DELETE SET NULL,
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consultation history"
  ON consultation_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consultation history"
  ON consultation_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own consultation history"
  ON consultation_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  report_type text NOT NULL,
  title text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  format text DEFAULT 'json',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_business_projects_user_id ON business_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_idea_validations_project_id ON idea_validations(project_id);
CREATE INDEX IF NOT EXISTS idx_market_research_project_id ON market_research(project_id);
CREATE INDEX IF NOT EXISTS idx_financial_plans_project_id ON financial_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_marketing_strategies_project_id ON marketing_strategies(project_id);
CREATE INDEX IF NOT EXISTS idx_business_plans_project_id ON business_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_automation_suggestions_project_id ON automation_suggestions(project_id);
CREATE INDEX IF NOT EXISTS idx_consultation_history_user_id ON consultation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
