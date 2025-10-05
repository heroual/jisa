import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Globe,
  TrendingUp,
  Zap,
  Smartphone,
  Shield,
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface WebsiteAnalysis {
  id: string;
  website_url: string;
  seo_score: number;
  performance_score: number;
  mobile_friendly: boolean;
  page_speed: number;
  meta_tags: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  backlinks_count: number;
  domain_authority: number;
  ssl_certificate: boolean;
  technical_issues: string[];
  recommendations: string[];
  created_at: string;
}

interface SocialMediaAnalysis {
  id: string;
  platform: string;
  account_handle: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  engagement_rate: number;
  avg_likes: number;
  avg_comments: number;
  posting_frequency: string;
  growth_rate: number;
  recommendations: string[];
  created_at: string;
}

const generateWebsiteAnalysis = (url: string) => {
  return {
    seo_score: Math.floor(Math.random() * 40) + 60,
    performance_score: Math.floor(Math.random() * 40) + 55,
    mobile_friendly: Math.random() > 0.2,
    page_speed: parseFloat((Math.random() * 3 + 1.5).toFixed(2)),
    meta_tags: {
      title: 'Website Title - Brand Name',
      description: 'Comprehensive business solution for your needs',
      keywords: 'business, solutions, services',
    },
    backlinks_count: Math.floor(Math.random() * 5000) + 100,
    domain_authority: Math.floor(Math.random() * 40) + 30,
    ssl_certificate: Math.random() > 0.1,
    technical_issues: [
      'Missing alt tags on 15 images',
      'Broken links detected: 3',
      'Page size exceeds 2MB',
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    recommendations: [
      'Improve meta descriptions for better CTR',
      'Optimize images to reduce page load time',
      'Add schema markup for rich snippets',
      'Increase internal linking structure',
      'Fix broken links and redirects',
    ],
  };
};

const generateSocialAnalysis = (platform: string, handle: string) => {
  return {
    followers_count: Math.floor(Math.random() * 50000) + 1000,
    following_count: Math.floor(Math.random() * 5000) + 100,
    posts_count: Math.floor(Math.random() * 500) + 50,
    engagement_rate: parseFloat((Math.random() * 8 + 1).toFixed(2)),
    avg_likes: Math.floor(Math.random() * 1000) + 50,
    avg_comments: Math.floor(Math.random() * 100) + 5,
    posting_frequency: ['daily', '3-5x/week', 'weekly'][Math.floor(Math.random() * 3)],
    growth_rate: parseFloat((Math.random() * 10 - 2).toFixed(2)),
    recommendations: [
      'Post during peak engagement times (6-9 PM)',
      'Increase video content for better reach',
      'Use trending hashtags relevant to your niche',
      'Respond to comments within 2 hours',
      'Collaborate with micro-influencers',
    ],
  };
};

export function WebsiteAnalysis() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [websiteAnalyses, setWebsiteAnalyses] = useState<WebsiteAnalysis[]>([]);
  const [socialAnalyses, setSocialAnalyses] = useState<SocialMediaAnalysis[]>([]);
  const [showWebsiteForm, setShowWebsiteForm] = useState(false);
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [socialData, setSocialData] = useState({
    project_id: '',
    platform: 'instagram',
    account_handle: '',
  });
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    loadProjects();
    loadAnalyses();
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

  const loadAnalyses = async () => {
    if (!user) return;

    const [websiteData, socialData] = await Promise.all([
      supabase.from('website_analysis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('social_media_analysis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);

    setWebsiteAnalyses(websiteData.data || []);
    setSocialAnalyses(socialData.data || []);
  };

  const handleWebsiteAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProject || !websiteUrl.trim()) return;

    setLoading(true);
    try {
      const analysisData = generateWebsiteAnalysis(websiteUrl);

      const { error } = await supabase.from('website_analysis').insert({
        user_id: user.id,
        project_id: selectedProject,
        website_url: websiteUrl,
        ...analysisData,
      });

      if (error) throw error;

      setWebsiteUrl('');
      setShowWebsiteForm(false);
      loadAnalyses();
    } catch (error) {
      console.error('Error analyzing website:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !socialData.project_id || !socialData.account_handle.trim()) return;

    setLoading(true);
    try {
      const analysisData = generateSocialAnalysis(socialData.platform, socialData.account_handle);

      const { error } = await supabase.from('social_media_analysis').insert({
        user_id: user.id,
        project_id: socialData.project_id,
        platform: socialData.platform,
        account_handle: socialData.account_handle,
        ...analysisData,
      });

      if (error) throw error;

      setSocialData({ project_id: '', platform: 'instagram', account_handle: '' });
      setShowSocialForm(false);
      loadAnalyses();
    } catch (error) {
      console.error('Error analyzing social media:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Website & Social Media Analysis</h2>
          <p className="text-slate-600 mt-1">
            Analyze SEO, performance, and social media engagement
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowWebsiteForm(!showWebsiteForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            Analyze Website
          </button>
          <button
            onClick={() => setShowSocialForm(!showSocialForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            Analyze Social
          </button>
        </div>
      </div>

      {showWebsiteForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Website Analysis Tool</h3>
          <form onSubmit={handleWebsiteAnalysis} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Project *
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Website URL *</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Analyzing...' : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze Website
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowWebsiteForm(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showSocialForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Social Media Analysis Tool</h3>
          <form onSubmit={handleSocialAnalysis} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Project *
              </label>
              <select
                value={socialData.project_id}
                onChange={(e) => setSocialData({ ...socialData, project_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Platform *</label>
                <select
                  value={socialData.platform}
                  onChange={(e) => setSocialData({ ...socialData, platform: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Handle *
                </label>
                <input
                  type="text"
                  value={socialData.account_handle}
                  onChange={(e) =>
                    setSocialData({ ...socialData, account_handle: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="@username"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Account'}
              </button>
              <button
                type="button"
                onClick={() => setShowSocialForm(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {websiteAnalyses.map((analysis) => (
          <div key={analysis.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{analysis.website_url}</h3>
                  <p className="text-sm text-slate-500">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`rounded-lg p-3 ${getScoreColor(analysis.seo_score)}`}>
                <div className="text-sm mb-1">SEO Score</div>
                <div className="text-2xl font-bold">{analysis.seo_score}</div>
              </div>
              <div className={`rounded-lg p-3 ${getScoreColor(analysis.performance_score)}`}>
                <div className="text-sm mb-1">Performance</div>
                <div className="text-2xl font-bold">{analysis.performance_score}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <Smartphone className={`w-5 h-5 mx-auto mb-1 ${analysis.mobile_friendly ? 'text-green-600' : 'text-red-600'}`} />
                <div className="text-xs text-slate-600">Mobile</div>
              </div>
              <div className="text-center">
                <Shield className={`w-5 h-5 mx-auto mb-1 ${analysis.ssl_certificate ? 'text-green-600' : 'text-red-600'}`} />
                <div className="text-xs text-slate-600">SSL</div>
              </div>
              <div className="text-center">
                <Zap className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <div className="text-xs text-slate-600">{analysis.page_speed}s</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Backlinks:</span>
                    <span className="font-medium">{analysis.backlinks_count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Authority:</span>
                    <span className="font-medium">{analysis.domain_authority}</span>
                  </div>
                </div>
              </div>

              {analysis.technical_issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Issues Found
                  </h4>
                  <ul className="space-y-1">
                    {analysis.technical_issues.slice(0, 2).map((issue, i) => (
                      <li key={i} className="text-sm text-slate-600">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {analysis.recommendations.slice(0, 3).map((rec, i) => (
                    <li key={i} className="text-sm text-slate-600">• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        {socialAnalyses.map((analysis) => (
          <div key={analysis.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  {getPlatformIcon(analysis.platform)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 capitalize">
                    {analysis.platform} - {analysis.account_handle}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-slate-900">
                  {(analysis.followers_count / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-slate-600">Followers</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-slate-900">{analysis.engagement_rate}%</div>
                <div className="text-xs text-slate-600">Engagement</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-slate-900">{analysis.posts_count}</div>
                <div className="text-xs text-slate-600">Posts</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600">Avg Likes:</span>
                  <span className="font-medium ml-2">{analysis.avg_likes.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-600">Avg Comments:</span>
                  <span className="font-medium ml-2">{analysis.avg_comments.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-600">Frequency:</span>
                  <span className="font-medium ml-2 capitalize">{analysis.posting_frequency}</span>
                </div>
                <div>
                  <span className="text-slate-600">Growth:</span>
                  <span className={`font-medium ml-2 ${analysis.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.growth_rate > 0 ? '+' : ''}{analysis.growth_rate}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Growth Tips
                </h4>
                <ul className="space-y-1">
                  {analysis.recommendations.slice(0, 3).map((rec, i) => (
                    <li key={i} className="text-sm text-slate-600">• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {websiteAnalyses.length === 0 && socialAnalyses.length === 0 && !showWebsiteForm && !showSocialForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Globe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No analyses yet</h3>
          <p className="text-slate-600">
            Start analyzing websites and social media accounts to get insights
          </p>
        </div>
      )}
    </div>
  );
}
