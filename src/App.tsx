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
import { MarketResearch } from './components/Modules/MarketResearch/MarketResearch';
import { FinancialPlanning } from './components/Modules/FinancialPlanning/FinancialPlanning';
import { MarketingStrategy } from './components/Modules/MarketingStrategy/MarketingStrategy';
import { BusinessPlan } from './components/Modules/BusinessPlan/BusinessPlan';
import { ReportsAnalytics } from './components/Reports/ReportsAnalytics';
import { Bot } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
    const moduleProps = { project: selectedProject };
    const needsProject = [
      'idea-validation',
      'market-research',
      'financial-planning',
      'marketing-strategy',
      'business-plan',
      'reports',
    ];

    if (needsProject.includes(currentView) && !selectedProject) {
      return (
        <div className="p-8 text-center">
          <h3 className="text-xl font-semibold">Please select a project</h3>
          <p className="text-slate-500 mt-2">
            Please select a project from the 'Projects' tab to access this module.
          </p>
          <button 
            onClick={() => setCurrentView('projects')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go to Projects
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'overview':
        return <Overview onNavigate={setCurrentView} />;
      case 'projects':
        return <ProjectsList onProjectSelect={setSelectedProject} />;
      case 'idea-validation':
        return <IdeaValidation project={selectedProject} />;
      case 'keyword-research':
        return <KeywordResearch />;
      case 'competitor-analysis':
        return <CompetitorAnalysis />;
      case 'lead-generation':
        return <LeadGeneration />;
      case 'website-analysis':
        return <WebsiteAnalysis />;
      case 'market-research':
        return <MarketResearch {...moduleProps} />;
      case 'financial-planning':
        return <FinancialPlanning {...moduleProps} />;
      case 'marketing-strategy':
        return <MarketingStrategy {...moduleProps} />;
      case 'business-plan':
        return <BusinessPlan {...moduleProps} />;
      case 'reports':
        return <ReportsAnalytics {...moduleProps} />;
      case 'automation':
        return (
          <ComingSoon
            title="AI Automation Suggestions"
            description="Identify repetitive tasks and get AI tool recommendations to save time"
            icon={Bot}
            color="from-[#d6c2a3] to-[#c4a87f]"
          />
        );
      case 'chat':
        return <ChatInterface />;
      default:
        return <Overview onNavigate={setCurrentView} />;
    }
  };

  return (
    <DashboardLayout 
      currentView={currentView} 
      onViewChange={setCurrentView} 
      selectedProject={selectedProject}
    >
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