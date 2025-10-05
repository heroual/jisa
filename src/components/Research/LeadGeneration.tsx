import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { UserPlus, Mail, Phone, Building2, MapPin, Download, Plus, Star, Filter } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface Lead {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  industry: string | null;
  location: string | null;
  lead_score: number;
  status: string;
  source: string | null;
  notes: string | null;
  tags: string[];
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-green-100 text-green-700',
  converted: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
};

export function LeadGeneration() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    project_id: '',
    name: '',
    company: '',
    role: '',
    email: '',
    phone: '',
    linkedin_url: '',
    industry: '',
    location: '',
    source: '',
    notes: '',
    tags: '',
  });

  useEffect(() => {
    loadProjects();
    loadLeads();
  }, [user]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.status === statusFilter));
    }
  }, [leads, statusFilter]);

  const loadProjects = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('business_projects')
      .select('id, name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setProjects(data || []);
  };

  const loadLeads = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('lead_score', { ascending: false });

    setLeads(data || []);
  };

  const calculateLeadScore = () => {
    let score = 50;
    if (formData.email) score += 15;
    if (formData.phone) score += 10;
    if (formData.linkedin_url) score += 10;
    if (formData.company) score += 10;
    if (formData.role) score += 5;
    return Math.min(100, score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.project_id) return;

    setLoading(true);
    try {
      const leadScore = calculateLeadScore();
      const tags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t);

      const { error } = await supabase.from('leads').insert({
        user_id: user.id,
        project_id: formData.project_id,
        name: formData.name,
        company: formData.company || null,
        role: formData.role || null,
        email: formData.email || null,
        phone: formData.phone || null,
        linkedin_url: formData.linkedin_url || null,
        industry: formData.industry || null,
        location: formData.location || null,
        source: formData.source || null,
        notes: formData.notes || null,
        tags: tags,
        lead_score: leadScore,
        status: 'new',
      });

      if (error) throw error;

      setFormData({
        project_id: '',
        name: '',
        company: '',
        role: '',
        email: '',
        phone: '',
        linkedin_url: '',
        industry: '',
        location: '',
        source: '',
        notes: '',
        tags: '',
      });
      setShowForm(false);
      loadLeads();
    } catch (error) {
      console.error('Error adding lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;
      loadLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Company',
      'Role',
      'Email',
      'Phone',
      'LinkedIn',
      'Industry',
      'Location',
      'Lead Score',
      'Status',
      'Source',
    ];
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.company || '',
      lead.role || '',
      lead.email || '',
      lead.phone || '',
      lead.linkedin_url || '',
      lead.industry || '',
      lead.location || '',
      lead.lead_score,
      lead.status,
      lead.source || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Lead Generation</h2>
          <p className="text-slate-600 mt-1">Collect and manage potential leads for your business</p>
        </div>
        <div className="flex gap-3">
          {leads.length > 0 && (
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
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg hover:from-pink-700 hover:to-rose-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'All Leads', value: leads.length, status: 'all' },
          { label: 'New', value: leads.filter((l) => l.status === 'new').length, status: 'new' },
          {
            label: 'Qualified',
            value: leads.filter((l) => l.status === 'qualified').length,
            status: 'qualified',
          },
          {
            label: 'Converted',
            value: leads.filter((l) => l.status === 'converted').length,
            status: 'converted',
          },
        ].map((stat) => (
          <button
            key={stat.status}
            onClick={() => setStatusFilter(stat.status)}
            className={`bg-white rounded-xl p-4 border transition-all ${
              statusFilter === stat.status
                ? 'border-pink-500 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-slate-600 text-sm mb-1">{stat.label}</div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Lead</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Project *
              </label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Company Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="CEO, Marketing Manager, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="+212 6XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Tech, Fashion, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Casablanca, Morocco"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="LinkedIn, Referral, Website, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="hot lead, decision maker"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Additional notes about this lead..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Lead'}
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

      {filteredLeads.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <UserPlus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {statusFilter === 'all' ? 'No leads yet' : `No ${statusFilter} leads`}
          </h3>
          <p className="text-slate-600">
            {statusFilter === 'all'
              ? 'Start adding leads to build your contact database'
              : 'Try selecting a different status filter'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Company
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Contact
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Location
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">Score</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{lead.name}</div>
                        {lead.role && <div className="text-sm text-slate-500">{lead.role}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.company && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900">{lead.company}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {lead.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {lead.email}
                            </a>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.location && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {lead.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Star className={`w-4 h-4 ${getScoreColor(lead.lead_score)}`} />
                        <span className={`font-semibold ${getScoreColor(lead.lead_score)}`}>
                          {lead.lead_score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                          statusColors[lead.status]
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
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
