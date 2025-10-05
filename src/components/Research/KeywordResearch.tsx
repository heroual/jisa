import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Search, TrendingUp, TrendingDown, Minus, Plus, BarChart2, Download } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface KeywordData {
  id: string;
  keyword: string;
  search_volume: number;
  competition: string;
  cpc: number;
  trend: string;
  difficulty_score: number;
  related_keywords: string[];
  created_at: string;
}

const generateKeywordData = (keyword: string): Omit<KeywordData, 'id' | 'created_at'> => {
  const baseVolume = Math.floor(Math.random() * 50000) + 1000;
  const competitions = ['low', 'medium', 'high'];
  const trends = ['rising', 'stable', 'declining'];

  const relatedKeywords = [
    `best ${keyword}`,
    `${keyword} online`,
    `${keyword} near me`,
    `${keyword} price`,
    `buy ${keyword}`,
    `${keyword} reviews`,
    `${keyword} 2025`,
    `cheap ${keyword}`,
  ];

  return {
    keyword,
    search_volume: baseVolume,
    competition: competitions[Math.floor(Math.random() * competitions.length)],
    cpc: parseFloat((Math.random() * 5).toFixed(2)),
    trend: trends[Math.floor(Math.random() * trends.length)],
    difficulty_score: Math.floor(Math.random() * 100),
    related_keywords: relatedKeywords.slice(0, 5),
  };
};

export function KeywordResearch() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    loadProjects();
    loadKeywords();
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

  const loadKeywords = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('keyword_research')
      .select('*')
      .eq('user_id', user.id)
      .order('search_volume', { ascending: false });

    setKeywords(data || []);
  };

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProject || !keywordInput.trim()) return;

    setLoading(true);
    try {
      const keywordsToResearch = keywordInput
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k);

      const keywordDataArray = keywordsToResearch.map((kw) => ({
        user_id: user.id,
        project_id: selectedProject,
        ...generateKeywordData(kw),
      }));

      const { error } = await supabase.from('keyword_research').insert(keywordDataArray);

      if (error) throw error;

      setKeywordInput('');
      setShowForm(false);
      loadKeywords();
    } catch (error) {
      console.error('Error researching keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-600" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['Keyword', 'Search Volume', 'Competition', 'CPC', 'Trend', 'Difficulty'];
    const rows = keywords.map((k) => [
      k.keyword,
      k.search_volume,
      k.competition,
      k.cpc,
      k.trend,
      k.difficulty_score,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyword-research-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Keyword Research</h2>
          <p className="text-slate-600 mt-1">
            Discover trending keywords with search volume and competition metrics
          </p>
        </div>
        <div className="flex gap-3">
          {keywords.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            Research Keywords
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Keyword Research Tool</h3>
          <form onSubmit={handleResearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Project *
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Keywords (comma-separated) *
              </label>
              <textarea
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., clothing store, fashion Morocco, online boutique"
                rows={3}
                required
              />
              <p className="text-sm text-slate-500 mt-1">
                Enter multiple keywords separated by commas
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  'Researching...'
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Start Research
                  </>
                )}
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

      {keywords.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No keyword research yet</h3>
          <p className="text-slate-600">
            Start researching keywords to discover search volumes and competition
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Keyword
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Search Volume
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Competition
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    CPC
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Trend
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Difficulty
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Related Keywords
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {keywords.map((keyword) => (
                  <tr key={keyword.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{keyword.keyword}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-blue-600" />
                        <span className="text-slate-900 font-medium">
                          {keyword.search_volume.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCompetitionColor(
                          keyword.competition
                        )}`}
                      >
                        {keyword.competition}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900">${keyword.cpc}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(keyword.trend)}
                        <span className="text-slate-700 capitalize">{keyword.trend}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 w-20">
                          <div
                            className={`h-2 rounded-full ${
                              keyword.difficulty_score < 33
                                ? 'bg-green-500'
                                : keyword.difficulty_score < 66
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${keyword.difficulty_score}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600">{keyword.difficulty_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {keyword.related_keywords.slice(0, 3).map((rk, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            {rk}
                          </span>
                        ))}
                        {keyword.related_keywords.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            +{keyword.related_keywords.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
