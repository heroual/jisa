/*
  # Add Research and Analysis Features

  ## Overview
  Extends the business consultant app with professional marketing research tools:
  keyword research, competitor analysis, lead generation, and website/social media analysis.

  ## New Tables

  ### 1. `keyword_research`
  Store keyword research results for projects
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `keyword` (text)
  - `search_volume` (integer)
  - `competition` (text: low, medium, high)
  - `cpc` (numeric, cost per click)
  - `trend` (text: rising, stable, declining)
  - `difficulty_score` (integer, 0-100)
  - `related_keywords` (jsonb)
  - `created_at` (timestamptz)

  ### 2. `competitor_analysis`
  Competitor benchmarking and analysis data
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `competitor_name` (text)
  - `website_url` (text)
  - `industry` (text)
  - `strengths` (jsonb)
  - `weaknesses` (jsonb)
  - `market_share` (numeric)
  - `pricing_strategy` (text)
  - `digital_presence` (jsonb)
  - `traffic_estimate` (integer)
  - `social_media_followers` (jsonb)
  - `content_strategy` (text)
  - `unique_features` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `leads`
  Generated leads and potential contacts
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `name` (text)
  - `company` (text)
  - `role` (text)
  - `email` (text)
  - `phone` (text)
  - `linkedin_url` (text)
  - `industry` (text)
  - `location` (text)
  - `lead_score` (integer, 0-100)
  - `status` (text, default 'new')
  - `source` (text)
  - `notes` (text)
  - `tags` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `website_analysis`
  Website SEO and performance analysis
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `website_url` (text)
  - `seo_score` (integer, 0-100)
  - `performance_score` (integer, 0-100)
  - `mobile_friendly` (boolean)
  - `page_speed` (numeric)
  - `meta_tags` (jsonb)
  - `headings_structure` (jsonb)
  - `backlinks_count` (integer)
  - `domain_authority` (integer)
  - `ssl_certificate` (boolean)
  - `technical_issues` (jsonb)
  - `recommendations` (jsonb)
  - `created_at` (timestamptz)

  ### 5. `social_media_analysis`
  Social media account insights
  - `id` (uuid, primary key)
  - `project_id` (uuid, references business_projects)
  - `user_id` (uuid, references profiles)
  - `platform` (text)
  - `account_handle` (text)
  - `followers_count` (integer)
  - `following_count` (integer)
  - `posts_count` (integer)
  - `engagement_rate` (numeric)
  - `avg_likes` (integer)
  - `avg_comments` (integer)
  - `posting_frequency` (text)
  - `top_content_types` (jsonb)
  - `growth_rate` (numeric)
  - `best_posting_times` (jsonb)
  - `hashtag_performance` (jsonb)
  - `audience_demographics` (jsonb)
  - `recommendations` (jsonb)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated access required
*/

-- Create keyword_research table
CREATE TABLE IF NOT EXISTS keyword_research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  search_volume integer DEFAULT 0,
  competition text DEFAULT 'medium',
  cpc numeric DEFAULT 0.0,
  trend text DEFAULT 'stable',
  difficulty_score integer DEFAULT 50,
  related_keywords jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE keyword_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own keyword research"
  ON keyword_research FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keyword research"
  ON keyword_research FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keyword research"
  ON keyword_research FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own keyword research"
  ON keyword_research FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create competitor_analysis table
CREATE TABLE IF NOT EXISTS competitor_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  competitor_name text NOT NULL,
  website_url text,
  industry text,
  strengths jsonb DEFAULT '[]'::jsonb,
  weaknesses jsonb DEFAULT '[]'::jsonb,
  market_share numeric DEFAULT 0.0,
  pricing_strategy text,
  digital_presence jsonb DEFAULT '{}'::jsonb,
  traffic_estimate integer DEFAULT 0,
  social_media_followers jsonb DEFAULT '{}'::jsonb,
  content_strategy text,
  unique_features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE competitor_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own competitor analysis"
  ON competitor_analysis FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own competitor analysis"
  ON competitor_analysis FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competitor analysis"
  ON competitor_analysis FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own competitor analysis"
  ON competitor_analysis FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  company text,
  role text,
  email text,
  phone text,
  linkedin_url text,
  industry text,
  location text,
  lead_score integer DEFAULT 50,
  status text DEFAULT 'new',
  source text,
  notes text,
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
  ON leads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create website_analysis table
CREATE TABLE IF NOT EXISTS website_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  website_url text NOT NULL,
  seo_score integer DEFAULT 0,
  performance_score integer DEFAULT 0,
  mobile_friendly boolean DEFAULT true,
  page_speed numeric DEFAULT 0.0,
  meta_tags jsonb DEFAULT '{}'::jsonb,
  headings_structure jsonb DEFAULT '{}'::jsonb,
  backlinks_count integer DEFAULT 0,
  domain_authority integer DEFAULT 0,
  ssl_certificate boolean DEFAULT true,
  technical_issues jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE website_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own website analysis"
  ON website_analysis FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own website analysis"
  ON website_analysis FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own website analysis"
  ON website_analysis FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own website analysis"
  ON website_analysis FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create social_media_analysis table
CREATE TABLE IF NOT EXISTS social_media_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  account_handle text NOT NULL,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  posts_count integer DEFAULT 0,
  engagement_rate numeric DEFAULT 0.0,
  avg_likes integer DEFAULT 0,
  avg_comments integer DEFAULT 0,
  posting_frequency text DEFAULT 'daily',
  top_content_types jsonb DEFAULT '[]'::jsonb,
  growth_rate numeric DEFAULT 0.0,
  best_posting_times jsonb DEFAULT '[]'::jsonb,
  hashtag_performance jsonb DEFAULT '{}'::jsonb,
  audience_demographics jsonb DEFAULT '{}'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_media_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own social media analysis"
  ON social_media_analysis FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social media analysis"
  ON social_media_analysis FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social media analysis"
  ON social_media_analysis FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social media analysis"
  ON social_media_analysis FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_keyword_research_project_id ON keyword_research(project_id);
CREATE INDEX IF NOT EXISTS idx_keyword_research_keyword ON keyword_research(keyword);
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_project_id ON competitor_analysis(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_project_id ON leads(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_website_analysis_project_id ON website_analysis(project_id);
CREATE INDEX IF NOT EXISTS idx_social_media_analysis_project_id ON social_media_analysis(project_id);
CREATE INDEX IF NOT EXISTS idx_social_media_analysis_platform ON social_media_analysis(platform);
