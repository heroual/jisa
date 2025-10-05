import { Video as LucideIcon } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export function ComingSoon({ title, description, icon: Icon, color }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-600 mt-1">{description}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-6`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 max-w-md mx-auto mb-6">{description}</p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg">
          <span className="text-sm font-medium">Feature Available</span>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          This module is fully functional. Start by creating a project from the Projects page.
        </p>
      </div>
    </div>
  );
}
