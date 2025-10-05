import { ReactNode, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Target,
  FileText,
  Bot,
  BarChart3,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Briefcase,
  Search,
  Users,
  UserPlus,
  Globe,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'My Projects', icon: Briefcase },
  { id: 'idea-validation', label: 'Idea Validation', icon: Lightbulb },
  { id: 'keyword-research', label: 'Keyword Research', icon: Search },
  { id: 'competitor-analysis', label: 'Competitor Analysis', icon: Users },
  { id: 'lead-generation', label: 'Lead Generation', icon: UserPlus },
  { id: 'website-analysis', label: 'Website & Social Analysis', icon: Globe },
  { id: 'market-research', label: 'Market Research', icon: TrendingUp },
  { id: 'financial-planning', label: 'Financial Planning', icon: DollarSign },
  { id: 'marketing-strategy', label: 'Marketing Strategy', icon: Target },
  { id: 'business-plan', label: 'Business Plan', icon: FileText },
  { id: 'automation', label: 'AI Automation', icon: Bot },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'chat', label: 'Q&A Chat', icon: MessageSquare },
];

export function DashboardLayout({ children, currentView, onViewChange }: DashboardLayoutProps) {
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6]">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-[#d6c2a3]/20 z-30">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-[#f5f0e6] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#d6c2a3] to-[#c4a87f] rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 hidden sm:block">
                Business Consultant AI
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-slate-600">{user?.email}</div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-[#f5f0e6] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-[#d6c2a3]/20 z-20 transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] text-white shadow-md'
                    : 'text-slate-700 hover:bg-[#f5f0e6]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="lg:pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}