import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import { Overview } from './components/Dashboard/Overview';
import { ProjectsList } from './components/Projects/ProjectsList';
import { IdeaValidation } from './components/Modules/IdeaValidation';
import { ChatInterface } from './components/Chat/ChatInterface';
import { ComingSoon } from './components/Modules/ComingSoon';
import { KeywordResearch } from './components/Research/KeywordResearch';
import { CompetitorAnalysis } from './components/Research/CompetitorAnalysis';
import { LeadGeneration } from './components/Research/LeadGeneration';
import { WebsiteAnalysis } from './components/Research/WebsiteAnalysis';
import { LandingPage } from './components/Landing/LandingPage';
import {
  TrendingUp,
  DollarSign,
  Target,
  FileText,
  Bot,
  BarChart3,
} from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('overview');
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (showAuth) {
      return <AuthForm />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview onNavigate={setCurrentView} />;
      case 'projects':
        return <ProjectsList />;
      case 'idea-validation':
        return <IdeaValidation />;
      case 'keyword-research':
        return <KeywordResearch />;
      case 'competitor-analysis':
        return <CompetitorAnalysis />;
      case 'lead-generation':
        return <LeadGeneration />;
      case 'website-analysis':
        return <WebsiteAnalysis />;
      case 'market-research':
        return (
          <ComingSoon
            title="Market Research"
            description="Get competitor insights, market trends, and positioning strategies"
            icon={TrendingUp}
            color="from-green-500 to-emerald-500"
          />
        );
      case 'financial-planning':
        return (
          <ComingSoon
            title="Financial Planning"
            description="Create pricing strategies, revenue forecasts, and profit optimization plans"
            icon={DollarSign}
            color="from-blue-500 to-cyan-500"
          />
        );
      case 'marketing-strategy':
        return (
          <ComingSoon
            title="Marketing Strategy"
            description="Design digital campaigns, optimize funnels, and plan retention tactics"
            icon={Target}
            color="from-pink-500 to-rose-500"
          />
        );
      case 'business-plan':
        return (
          <ComingSoon
            title="Business Plan Generator"
            description="Create comprehensive business plans and pitch decks for investors"
            icon={FileText}
            color="from-violet-500 to-purple-500"
          />
        );
      case 'automation':
        return (
          <ComingSoon
            title="AI Automation Suggestions"
            description="Identify repetitive tasks and get AI tool recommendations to save time"
            icon={Bot}
            color="from-indigo-500 to-blue-500"
          />
        );
      case 'reports':
        return (
          <ComingSoon
            title="Reports & Analytics"
            description="Generate detailed reports and export insights in multiple formats"
            icon={BarChart3}
            color="from-teal-500 to-cyan-500"
          />
        );
      case 'chat':
        return <ChatInterface />;
      default:
        return <Overview onNavigate={setCurrentView} />;
    }
  };

  return (
    <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
