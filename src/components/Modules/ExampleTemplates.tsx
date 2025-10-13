import React from 'react';
import { FileText, TrendingUp, DollarSign, Megaphone, X } from 'lucide-react';

interface ExampleTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExampleTemplates: React.FC<ExampleTemplatesProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const templates = {
    marketResearch: {
      title: "SaaS Project Management Tool - Market Research",
      market_size_analysis: "The global project management software market is valued at $5.37 billion in 2023, with a CAGR of 10.67%. Our Total Addressable Market (TAM) is $2.1B (SMB segment), Serviceable Addressable Market (SAM) is $450M (companies under 500 employees), and our realistic Serviceable Obtainable Market (SOM) is $15M (3% market share in target regions within 3 years).",
      market_trends_tracking: "Key trends driving growth: 1) 73% increase in remote work driving collaboration tool adoption, 2) AI integration becoming standard (40% of tools adding AI features by 2024), 3) Integration-first approach with APIs and workflow automation, 4) Mobile-first design requirements increasing 60% YoY, 5) Demand for specialized industry solutions growing 35% annually.",
      competitor_identification: "Direct competitors: Asana ($3.2B valuation, strong UI/UX but limited customization), Monday.com ($4.2B, visual project tracking but expensive for SMBs), Trello (acquired by Atlassian for $425M, simple kanban but lacks advanced features). Indirect competitors: Microsoft Project (enterprise focus), Notion (all-in-one workspace but complex for project management). Market gap: No solution effectively serves creative agencies with integrated client collaboration and approval workflows.",
      positioning_strategy: "Position as 'The Creative Agency's Command Center' - combining traditional project management with client collaboration, asset management, and approval workflows. Key differentiators: Built-in proofing tools, client portal with real-time feedback, time tracking with creative-specific features, native integrations with design tools (Adobe Creative Suite, Figma, Sketch), and workflow templates for common creative projects.",
      target_segments: [
        {
          name: "Creative Agencies",
          size: "$2.5M market, 1,200 agencies",
          description: "Small to medium creative agencies (10-50 employees) specializing in brand design, digital marketing, and content creation. Currently using fragmented toolsets costing $200+/month per team."
        },
        {
          name: "Freelance Creative Teams",
          size: "$800K market, 3,500 freelancers",
          description: "Independent creative professionals and small collectives managing multiple clients. Need professional client collaboration tools but can't afford enterprise solutions."
        }
      ]
    },
    financialPlanning: {
      title: "SaaS Financial Plan 2024-2026",
      pricing_strategy: "Freemium model with value-based pricing: Free tier (up to 3 projects), Starter at $29/month (up to 10 projects), Professional at $79/month (unlimited projects + client portal), Team at $149/month (up to 10 users), Agency at $299/month (unlimited users + white-label). Price anchored against Asana ($10.99-24.99) and Monday.com ($8-16). Focus on ROI: customers save 15+ hours/week on project administration.",
      cost_structure: {
        fixed_costs: [
          { name: "AWS Hosting", amount: "2500", frequency: "monthly", description: "Scalable cloud infrastructure" },
          { name: "Development Team", amount: "25000", frequency: "monthly", description: "4 developers, 1 designer, 1 PM" },
          { name: "Marketing Tools", amount: "1200", frequency: "monthly", description: "HubSpot, Analytics, Social media tools" }
        ],
        variable_costs: [
          { name: "Customer Success", amount: "50", frequency: "monthly", description: "Per active customer support" },
          { name: "Payment Processing", amount: "0.029", frequency: "monthly", description: "2.9% of revenue" }
        ],
        one_time_costs: [
          { name: "Legal Setup", amount: "15000", frequency: "one-time", description: "Incorporation, IP, contracts" }
        ]
      },
      revenue_forecasts: {
        revenue_streams: [
          { name: "Subscription Revenue", pricing_model: "Monthly recurring", projected_revenue: "500000", description: "Primary revenue from SaaS subscriptions" },
          { name: "Implementation Services", pricing_model: "One-time", projected_revenue: "75000", description: "Custom setup and training services" }
        ],
        growth_assumptions: "Conservative 15% monthly growth for first 12 months, then 8% monthly growth. 5% monthly churn rate, improving to 3% by month 18. Average customer lifetime value of $2,400."
      },
      profit_margins: {
        gross_margin: "75",
        net_margin: "25",
        break_even_point: "180 customers by month 8",
        margin_analysis: "High-margin SaaS business model. Gross margin of 75% typical for B2B SaaS. Net margin of 25% achievable with efficient marketing spend (CAC:LTV ratio of 1:4)."
      },
      break_even_analysis: "Fixed costs: $35,000/month. Variable cost per customer: $8/month average. Average revenue per customer: $89/month. Break-even = 35,000 ÷ (89 - 8) = 432 customers. At 15% monthly growth from 50 initial customers, break-even reached in month 8. Sensitivity analysis: +/-10% in pricing changes break-even timeline by 2-3 months."
    },
    marketingStrategy: {
      title: "2024 Go-to-Market Strategy - Creative Agency SaaS",
      marketing_channels: {
        digital_channels: [
          { name: "Content Marketing + SEO", budget: "$8,000", kpi: "Organic traffic: 10K/month", description: "Blog posts, guides, templates targeting 'creative project management' keywords" },
          { name: "Google Ads", budget: "$12,000", kpi: "CPC: $3.50, CTR: 4%", description: "Search campaigns for high-intent keywords" },
          { name: "LinkedIn Ads", budget: "$6,000", kpi: "CPL: $45, CTR: 2.1%", description: "Targeting creative agency decision makers" }
        ],
        traditional_channels: [
          { name: "Industry Conferences", budget: "$15,000", kpi: "200 qualified leads/event", description: "99U, AIGA Design Conference, Marketing Land" }
        ],
        content_marketing: {
          strategy: "Position as thought leaders in creative project management. Focus on actionable advice, industry insights, and workflow optimization tips.",
          content_types: [
            { type: "Blog Posts", frequency: "3x per week", platform: "Company blog + Medium", objective: "SEO, thought leadership" },
            { type: "Video Tutorials", frequency: "2x per week", platform: "YouTube + embedded", objective: "Product education, engagement" },
            { type: "Industry Reports", frequency: "Monthly", platform: "Gated landing pages", objective: "Lead generation" }
          ],
          publishing_schedule: "Mondays: Industry insights, Wednesdays: How-to guides, Fridays: Product updates. Video content on Tuesdays and Thursdays."
        }
      },
      campaign_goals: "Primary goals: 1) Generate 500 qualified leads per month by Q2, 2) Achieve 15% lead-to-trial conversion rate, 3) Increase brand awareness by 40% (measured by branded search volume), 4) Build email list to 10,000 subscribers, 5) Maintain $50 Customer Acquisition Cost across all channels, 6) Achieve 25% market share in creative agency project management niche within 24 months.",
      funnel_strategies: {
        awareness_stage: "Content marketing, SEO optimization, industry conference presence, thought leadership articles, social media engagement, influencer partnerships with agency owners.",
        consideration_stage: "Free templates and resources, webinar series, product demos, comparison guides, case studies, email nurture sequences, retargeting campaigns.",
        decision_stage: "Free trial with onboarding support, personalized demos, ROI calculators, customer testimonials, limited-time offers, dedicated sales support.",
        retention_stage: "Customer success program, advanced feature training, user community, feedback loops, loyalty rewards, expansion opportunities."
      },
      retention_tactics: "1) Weekly 'Pro Tips' email series with advanced workflows, 2) Customer success onboarding program (90-day success journey), 3) Referral program with 20% discount for referrer and referee, 4) Quarterly user feedback surveys with feature voting, 5) Advanced users community forum with expert AMAs, 6) Loyalty tier system unlocking premium templates and priority support.",
      budget_allocation: {
        total_budget: "$50,000 monthly",
        timeline: "monthly",
        channel_allocation: [
          { channel: "Content Marketing", amount: "$15,000", percentage: "30%", notes: "High ROI, long-term asset building" },
          { channel: "Paid Advertising", amount: "$18,000", percentage: "36%", notes: "Google Ads + LinkedIn for immediate results" },
          { channel: "Events & Conferences", amount: "$10,000", percentage: "20%", notes: "High-quality leads, brand building" },
          { channel: "Tools & Software", amount: "$4,000", percentage: "8%", notes: "Marketing automation, analytics" },
          { channel: "Creative & Production", amount: "$3,000", percentage: "6%", notes: "Design, video production, copywriting" }
        ]
      }
    },
    businessPlan: {
      title: "TaskFlow Pro - Creative Agency Project Management Platform",
      executive_summary: "TaskFlow Pro is a specialized project management platform designed for creative agencies and freelance teams. Founded in 2024, we address the unique challenges of managing creative projects with integrated client collaboration, asset management, and approval workflows. Our platform combines traditional project management features with creative-specific tools, targeting the $2.1B creative services market. With a proven founding team, $500K initial investment, and early customer validation, we project $2M ARR by year 2 and profitability by month 18. Our competitive advantage lies in deep creative workflow integration and superior client collaboration features.",
      value_proposition: "TaskFlow Pro eliminates the chaos of creative project management by providing: 1) Integrated client collaboration portals that reduce email back-and-forth by 70%, 2) Built-in proofing and approval tools that accelerate project timelines by 40%, 3) Creative asset management with version control and brand guidelines, 4) Time tracking designed specifically for creative workflows and billing, 5) One unified platform replacing 3-4 separate tools, saving agencies $200+/month per team member, 6) Workflow templates for common creative projects (brand identity, website design, marketing campaigns).",
      target_audience: "Primary: Creative agencies (10-50 employees) specializing in brand design, digital marketing, and content creation with annual revenue $500K-$5M. Secondary: Freelance creative teams and in-house creative departments at mid-market companies. Characteristics: Currently using fragmented toolsets (Slack + Trello + Google Drive + email), spending 15+ hours/week on project administration, tech-forward but prioritizing usability over complexity, frustrated with generic project management tools that don't understand creative workflows.",
      revenue_model: "B2B SaaS subscription model: 1) Starter: $29/month (up to 5 users, core features), 2) Professional: $89/month (up to 15 users, client portals, advanced reporting), 3) Agency: $199/month (unlimited users, white-label, API access, priority support). Additional revenue streams: Implementation services ($2,500 average), custom integrations ($5,000-$15,000), premium support ($500/month). Revenue mix: 90% subscriptions, 7% implementation services, 3% custom development. Target: $2M ARR by year 2.",
      go_to_market_strategy: "Phase 1 (Months 1-6): Content marketing targeting 'creative project management' keywords, industry conference sponsorships (99U, AIGA), strategic partnerships with design tool vendors (Adobe, Figma). Phase 2 (Months 7-12): Paid acquisition (Google Ads, LinkedIn), affiliate program with creative consultants, customer referral program with incentives. Phase 3 (Year 2+): Inside sales team for enterprise accounts, international expansion starting with UK/Canada, vertical expansion to marketing agencies. Key distribution: Inbound marketing (40%), partnerships (30%), paid acquisition (20%), referrals (10%).",
      financial_projections: {
        year_1: { revenue: "$500,000", expenses: "$450,000", profit: "$50,000" },
        year_2: { revenue: "$2,000,000", expenses: "$1,400,000", profit: "$600,000" },
        year_3: { revenue: "$5,500,000", expenses: "$3,300,000", profit: "$2,200,000" },
        key_assumptions: "15% monthly customer growth year 1, 8% year 2. 5% monthly churn improving to 3%. $89 ARPU. 75% gross margin. Marketing spend: 40% of revenue year 1, 25% years 2-3."
      },
      team_structure: "Founding team: CEO (Product/Strategy, 10+ years PM experience at design agencies), CTO (Engineering, former senior developer at Asana with 8 years experience), VP Marketing (Creative agency background, 8 years growth marketing at B2B SaaS). Year 1 hiring plan: 2 full-stack developers, 1 UX designer, 1 customer success manager. Year 2 expansion: Sales director, 2 additional developers, content marketing specialist, customer success team lead. Advisory board: 3 successful agency owners, 1 former VP Product at Monday.com, 1 B2B SaaS GTM expert.",
      milestones: [
        {
          title: "Product MVP Launch",
          target_date: "Q1 2024",
          description: "Core project management features with basic client portal",
          success_criteria: "10 beta customers actively using the platform",
          status: "completed"
        },
        {
          title: "First 100 Paying Customers",
          target_date: "Q2 2024",
          description: "Achieve product-market fit with creative agencies",
          success_criteria: "100 paying customers, $25K MRR, 5% monthly churn",
          status: "in_progress"
        },
        {
          title: "Series A Funding",
          target_date: "Q4 2024",
          description: "Raise $3M Series A to accelerate growth",
          success_criteria: "$150K MRR, 300+ customers, proven unit economics",
          status: "planned"
        },
        {
          title: "Enterprise Features Launch",
          target_date: "Q1 2025",
          description: "Advanced features for larger agencies",
          success_criteria: "10+ enterprise customers, $500K ARR",
          status: "planned"
        }
      ]
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Business Plan Example Templates</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Market Research Example */}
          <div className="border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Market Research Example</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Title:</h4>
                <p className="text-gray-600">{templates.marketResearch.title}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Market Size Analysis:</h4>
                <p className="text-gray-600">{templates.marketResearch.market_size_analysis}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Target Segments:</h4>
                <div className="space-y-2">
                  {templates.marketResearch.target_segments.map((segment, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{segment.name} - {segment.size}</p>
                      <p className="text-gray-600">{segment.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Planning Example */}
          <div className="border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Financial Planning Example</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Pricing Strategy:</h4>
                <p className="text-gray-600">{templates.financialPlanning.pricing_strategy}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Revenue Streams:</h4>
                <div className="space-y-2">
                  {templates.financialPlanning.revenue_forecasts.revenue_streams.map((stream, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{stream.name} - ${stream.projected_revenue}</p>
                      <p className="text-gray-600">{stream.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Strategy Example */}
          <div className="border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Megaphone className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Marketing Strategy Example</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Campaign Goals:</h4>
                <p className="text-gray-600">{templates.marketingStrategy.campaign_goals}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Budget Allocation:</h4>
                <div className="space-y-2">
                  {templates.marketingStrategy.budget_allocation.channel_allocation.map((allocation, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded flex justify-between">
                      <div>
                        <p className="font-medium">{allocation.channel}</p>
                        <p className="text-gray-600">{allocation.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{allocation.amount}</p>
                        <p className="text-gray-600">{allocation.percentage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Business Plan Example */}
          <div className="border border-indigo-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Business Plan Example</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Executive Summary:</h4>
                <p className="text-gray-600">{templates.businessPlan.executive_summary}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Financial Projections:</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(templates.businessPlan.financial_projections).filter(([key]) => key.startsWith('year_')).map(([year, data]) => (
                    <div key={year} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium capitalize">{year.replace('_', ' ')}</p>
                      <p className="text-green-600">Revenue: {data.revenue}</p>
                      <p className="text-red-600">Expenses: {data.expenses}</p>
                      <p className="text-blue-600">Profit: {data.profit}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Key Milestones:</h4>
                <div className="space-y-2">
                  {templates.businessPlan.milestones.slice(0, 3).map((milestone, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{milestone.title}</p>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {milestone.status.replace('_', ' ')}
                          </span>
                          <p className="text-gray-600 text-xs mt-1">{milestone.target_date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close Examples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};