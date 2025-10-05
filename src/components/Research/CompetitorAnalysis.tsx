import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, TrendingUp, Globe, Plus, BarChart3, CheckCircle, XCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface Competitor {
  id: string;
  competitor_name: string;
  website_url: string | null;
  industry: string | null;
  strengths: string[];
  weaknesses: string[];
  market_share: number;
  pricing_strategy: string | null;
  digital_presence: {
    website: boolean;
    social_media: string[];
    mobile_app: boolean;
  };
  traffic_estimate: number;
  social_media_followers: {
    instagram?: number;
    facebook?: number;
    twitter?: number;
    linkedin?: number;
  };
  content_strategy: string | null;
  unique_features: string[];
  created_at: string;
}

export function CompetitorAnalysis() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    competitor_name: '',
    website_url: '',
    industry: '',
    pricing_strategy: '',
    content_strategy: '',
  });

  useEffect(() => {
    loadProjects();
    loadCompetitors();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('business_projects')
      .select('id, name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setProjects(data || []);
  };

  const loadCompetitors = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('competitor_analysis')
      .select('*')
      .eq('user_id', user.id)
      .order('market_share', { ascending: false });

    setCompetitors(data || []);
  };

  const generateCompetitorData = (name: string, industry: string) => {
    const socialPlatforms = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok'];
    const selectedPlatforms = socialPlatforms.slice(0, Math.floor(Math.random() * 3) + 2);

    return {
      strengths: [
        'Strong brand recognition',
        'Established customer base',
        'Quality products/services',
        'Good customer service',
      ],
      weaknesses: [
        'Higher pricing than average',
        'Limited digital presence',
        'Slow website performance',
      ],
      market_share: parseFloat((Math.random() * 30).toFixed(2)),
      digital_presence: {
        website: true,
        social_media: selectedPlatforms,
        mobile_app: Math.random() > 0.5,
      },
      traffic_estimate: Math.floor(Math.random() * 500000) + 10000,
      social_media_followers: {
        instagram: Math.floor(Math.random() * 100000) + 1000,
        facebook: Math.floor(Math.random() * 150000) + 5000,
        twitter: Math.floor(Math.random() * 50000) + 500,
        linkedin: Math.floor(Math.random() * 30000) + 1000,
      },
      unique_features: [
        'Loyalty program',
        'Fast shipping',
        'Money-back guarantee',
        '24/7 support',
      ],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.project_id) return;

    setLoading(true);
    try {
      const competitorData = generateCompetitorData(
        formData.competitor_name,
        formData.industry
      );

      const { error } = await supabase.from('competitor_analysis').insert({
        user_id: user.id,
        project_id: formData.project_id,
        competitor_name: formData.competitor_name,
        website_url: formData.website_url || null,
        industry: formData.industry || null,
        pricing_strategy: formData.pricing_strategy || null,
        content_strategy: formData.content_strategy || null,
        ...competitorData,
      });

      if (error) throw error;

      setFormData({
        project_id: '',
        competitor_name: '',
        website_url: '',
        industry: '',
        pricing_strategy: '',
        content_strategy: '',
      });
      setShowForm(false);
      loadCompetitors();
    } catch (error) {
      console.error('Error adding competitor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Competitor Analysis</h2>
          <p className="text-slate-600 mt-1">
            Benchmark competitors and analyze their strategies
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Competitor
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Competitor</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Project *
              </label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Competitor Name *
                </label>
                <input
                  type="text"
                  value={formData.competitor_name}
                  onChange={(e) =>
                    setFormData({ ...formData, competitor_name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Competitor Inc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://competitor.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E-commerce, Fashion, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pricing Strategy
                </label>
                <input
                  type="text"
                  value={formData.pricing_strategy}
                  onChange={(e) =>
                    setFormData({ ...formData, pricing_strategy: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Premium, Budget-friendly, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content Strategy
              </label>
              <textarea
                value={formData.content_strategy}
                onChange={(e) => setFormData({ ...formData, content_strategy: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of their content approach..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Competitor'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {competitors.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No competitors yet</h3>
          <p className="text-slate-600">Add competitors to start benchmarking analysis</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {competitors.map((competitor) => (
            <div
              key={competitor.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {competitor.competitor_name}
                  </h3>
                  {competitor.website_url && (
                    <a
                      href={competitor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {competitor.market_share}%
                  </div>
                  <div className="text-xs text-slate-500">Market Share</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-sm text-slate-600 mb-1">Monthly Traffic</div>
                  <div className="text-lg font-bold text-slate-900">
                    {(competitor.traffic_estimate / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-sm text-slate-600 mb-1">Total Followers</div>
                  <div className="text-lg font-bold text-slate-900">
                    {Object.values(competitor.social_media_followers)
                      .reduce((a, b) => a + b, 0)
                      .toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {competitor.strengths.slice(0, 3).map((strength, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {competitor.weaknesses.slice(0, 2).map((weakness, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Digital Presence</h4>
                  <div className="flex flex-wrap gap-2">
                    {competitor.digital_presence.social_media.map((platform, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {platform}
                      </span>
                    ))}
                    {competitor.digital_presence.mobile_app && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                        Mobile App
                      </span>
                    )}
                  </div>
                </div>

                {competitor.pricing_strategy && (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-sm text-slate-600">Pricing: </span>
                    <span className="text-sm font-medium text-slate-900">
                      {competitor.pricing_strategy}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {competitors.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Market Share Comparison
          </h3>
          <div className="space-y-3">
            {competitors.map((competitor) => (
              <div key={competitor.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-900">
                    {competitor.competitor_name}
                  </span>
                  <span className="text-sm text-slate-600">{competitor.market_share}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-3 rounded-full transition-all"
                    style={{ width: `${competitor.market_share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
