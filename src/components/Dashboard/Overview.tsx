import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Lightbulb,
  TrendingUp,
  DollarSign,
  Target,
  FileText,
  Bot,
  BarChart3,
  ArrowRight,
  Search,
  Users,
  UserPlus,
  Globe,
} from 'lucide-react';

interface Stats {
  projects: number;
  validations: number;
  marketResearch: number;
  financialPlans: number;
  marketingStrategies: number;
  businessPlans: number;
  automations: number;
  reports: number;
}

interface OverviewProps {
  onNavigate: (view: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    validations: 0,
    marketResearch: 0,
    financialPlans: 0,
    marketingStrategies: 0,
    businessPlans: 0,
    automations: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const [projects, validations, marketResearch, financialPlans, marketingStrategies, businessPlans, automations, reports] = await Promise.all([
        supabase.from('business_projects').select('id', { count: 'exact', head: true }),
        supabase.from('idea_validations').select('id', { count: 'exact', head: true }),
        supabase.from('market_research').select('id', { count: 'exact', head: true }),
        supabase.from('financial_plans').select('id', { count: 'exact', head: true }),
        supabase.from('marketing_strategies').select('id', { count: 'exact', head: true }),
        supabase.from('business_plans').select('id', { count: 'exact', head: true }),
        supabase.from('automation_suggestions').select('id', { count: 'exact', head: true }),
        supabase.from('reports').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        projects: projects.count || 0,
        validations: validations.count || 0,
        marketResearch: marketResearch.count || 0,
        financialPlans: financialPlans.count || 0,
        marketingStrategies: marketingStrategies.count || 0,
        businessPlans: businessPlans.count || 0,
        automations: automations.count || 0,
        reports: reports.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: 'idea-validation',
      title: 'Business Idea Validation',
      description: 'Evaluate your business idea with SWOT analysis and success scoring',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      count: stats.validations,
    },
    {
      id: 'keyword-research',
      title: 'Keyword Research',
      description: 'Discover trending keywords with search volume and competition',
      icon: Search,
      color: 'from-green-500 to-emerald-500',
      count: 0,
    },
    {
      id: 'competitor-analysis',
      title: 'Competitor Analysis',
      description: 'Benchmark competitors and analyze their strategies',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      count: 0,
    },
    {
      id: 'lead-generation',
      title: 'Lead Generation',
      description: 'Collect and manage potential leads with export options',
      icon: UserPlus,
      color: 'from-pink-500 to-rose-500',
      count: 0,
    },
    {
      id: 'website-analysis',
      title: 'Website & Social Analysis',
      description: 'Analyze SEO, performance, and social media engagement',
      icon: Globe,
      color: 'from-purple-500 to-indigo-500',
      count: 0,
    },
    {
      id: 'financial-planning',
      title: 'Financial Planning',
      description: 'Pricing strategies, forecasts, and profit optimization',
      icon: DollarSign,
      color: 'from-blue-600 to-cyan-600',
      count: stats.financialPlans,
    },
    {
      id: 'marketing-strategy',
      title: 'Marketing Strategy',
      description: 'Digital campaigns, funnels, and retention tactics',
      icon: Target,
      color: 'from-pink-600 to-rose-600',
      count: stats.marketingStrategies,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back!</h2>
        <p className="text-slate-600">
          Your AI-powered business consultant dashboard. Let's grow your business together.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="text-slate-600 text-sm mb-1">Total Projects</div>
          <div className="text-3xl font-bold text-slate-900">{stats.projects}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="text-slate-600 text-sm mb-1">Active Analyses</div>
          <div className="text-3xl font-bold text-slate-900">
            {stats.validations + stats.marketResearch + stats.financialPlans}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="text-slate-600 text-sm mb-1">Generated Reports</div>
          <div className="text-3xl font-bold text-slate-900">{stats.reports}</div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Available Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => onNavigate(feature.id)}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all text-left group"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-600 mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{feature.count} created</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Need Quick Advice?</h3>
        <p className="mb-4 opacity-90">
          Ask me anything about your business. I'm here to help with pricing, marketing,
          fundraising, and more.
        </p>
        <button
          onClick={() => onNavigate('chat')}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
        >
          Start Q&A Chat
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
