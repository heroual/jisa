import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Lightbulb, TrendingUp, TrendingDown, Target, AlertTriangle, Plus, Check } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface Validation {
  id: string;
  project_id: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  success_score: number;
  recommendations: string[];
  created_at: string;
  project_name?: string;
}

export function IdeaValidation() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [validations, setValidations] = useState<Validation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    strengths: [''],
    weaknesses: [''],
    opportunities: [''],
    threats: [''],
    recommendations: [''],
  });

  useEffect(() => {
    loadProjects();
    loadValidations();
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

  const loadValidations = async () => {
    if (!user) return;

    const { data: validationsData } = await supabase
      .from('idea_validations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (validationsData) {
      const projectIds = validationsData.map((v) => v.project_id);
      const { data: projectsData } = await supabase
        .from('business_projects')
        .select('id, name')
        .in('id', projectIds);

      const projectMap = new Map(projectsData?.map((p) => [p.id, p.name]));

      const enrichedValidations = validationsData.map((v) => ({
        ...v,
        project_name: projectMap.get(v.project_id),
      }));

      setValidations(enrichedValidations);
    }
  };

  const addField = (field: keyof typeof formData) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] as string[]), ''],
    });
  };

  const updateField = (field: keyof typeof formData, index: number, value: string) => {
    const updated = [...(formData[field] as string[])];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const removeField = (field: keyof typeof formData, index: number) => {
    const updated = (formData[field] as string[]).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated.length ? updated : [''] });
  };

  const calculateSuccessScore = () => {
    const strengths = formData.strengths.filter((s) => s.trim()).length;
    const weaknesses = formData.weaknesses.filter((w) => w.trim()).length;
    const opportunities = formData.opportunities.filter((o) => o.trim()).length;
    const threats = formData.threats.filter((t) => t.trim()).length;

    const positive = (strengths * 10 + opportunities * 8);
    const negative = (weaknesses * 5 + threats * 7);
    const score = Math.max(0, Math.min(100, positive - negative + 50));

    return Math.round(score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.project_id) return;

    setLoading(true);
    try {
      const successScore = calculateSuccessScore();

      const { error } = await supabase.from('idea_validations').insert({
        user_id: user.id,
        project_id: formData.project_id,
        strengths: formData.strengths.filter((s) => s.trim()),
        weaknesses: formData.weaknesses.filter((w) => w.trim()),
        opportunities: formData.opportunities.filter((o) => o.trim()),
        threats: formData.threats.filter((t) => t.trim()),
        success_score: successScore,
        recommendations: formData.recommendations.filter((r) => r.trim()),
      });

      if (error) throw error;

      setShowForm(false);
      setFormData({
        project_id: '',
        strengths: [''],
        weaknesses: [''],
        opportunities: [''],
        threats: [''],
        recommendations: [''],
      });
      loadValidations();
    } catch (error) {
      console.error('Error creating validation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Business Idea Validation</h2>
          <p className="text-slate-600 mt-1">SWOT analysis and success scoring for your ideas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Validation
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Create SWOT Analysis</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Project *
              </label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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

            {['strengths', 'weaknesses', 'opportunities', 'threats', 'recommendations'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">
                  {field}
                </label>
                <div className="space-y-2">
                  {(formData[field as keyof typeof formData] as string[]).map((value, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          updateField(field as keyof typeof formData, index, e.target.value)
                        }
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder={`Enter ${field.slice(0, -1)}...`}
                      />
                      {(formData[field as keyof typeof formData] as string[]).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField(field as keyof typeof formData, index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addField(field as keyof typeof formData)}
                    className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add {field.slice(0, -1)}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Validation'}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {validations.map((validation) => (
          <div key={validation.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">{validation.project_name}</h3>
                <p className="text-sm text-slate-500">
                  {new Date(validation.created_at).toLocaleDateString()}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-lg border font-bold text-2xl ${getScoreColor(
                  validation.success_score
                )}`}
              >
                {validation.success_score}
              </div>
            </div>

            <div className="space-y-4">
              {validation.strengths.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-slate-900">Strengths</h4>
                  </div>
                  <ul className="space-y-1">
                    {validation.strengths.map((strength, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.weaknesses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <h4 className="text-sm font-semibold text-slate-900">Weaknesses</h4>
                  </div>
                  <ul className="space-y-1">
                    {validation.weaknesses.map((weakness, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.opportunities.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-slate-900">Opportunities</h4>
                  </div>
                  <ul className="space-y-1">
                    {validation.opportunities.map((opportunity, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.threats.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h4 className="text-sm font-semibold text-slate-900">Threats</h4>
                  </div>
                  <ul className="space-y-1">
                    {validation.threats.map((threat, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.recommendations.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {validation.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {validations.length === 0 && !showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Lightbulb className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No validations yet</h3>
          <p className="text-slate-600">
            Create your first SWOT analysis to validate your business idea
          </p>
        </div>
      )}
    </div>
  );
}
