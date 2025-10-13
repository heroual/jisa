import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Send, MessageSquare, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  created_at: string;
}

const sampleQuestions = [
  'How do I price my product in Morocco?',
  'What are the best marketing channels for clothing business?',
  'How do I get investors for my startup?',
  'What payment methods work best in MENA region?',
  'How to calculate break-even point?',
];

const generateAnswer = (question: string): string => {
  const lowerQ = question.toLowerCase();

  if (lowerQ.includes('price') || lowerQ.includes('pricing')) {
    return `For pricing in Morocco/MENA:\n\n1. **Cost-Plus Pricing**: Calculate total costs and add 20-40% margin\n2. **Competition Analysis**: Research 3-5 competitors and position accordingly\n3. **Value-Based**: If you offer unique value, you can charge premium (15-30% above market)\n4. **Psychological Pricing**: Use 99, 95 endings (e.g., 299 MAD instead of 300)\n5. **Test & Iterate**: Start with one price, A/B test after 2-3 weeks\n\nFor Morocco specifically, consider local purchasing power and payment preferences (cash, cards, mobile money).`;
  }

  if (lowerQ.includes('marketing') || lowerQ.includes('channel')) {
    return `Best marketing channels for ${lowerQ.includes('clothing') ? 'clothing' : 'your'} business:\n\n1. **Instagram & TikTok**: Visual platforms perfect for product showcase. Post 3-5x/week with reels/stories\n2. **Facebook Ads**: Highly targeted, cost-effective in MENA (CPM $2-5)\n3. **Influencer Marketing**: Micro-influencers (5K-50K followers) give better ROI than celebrities\n4. **WhatsApp Business**: Direct customer communication, share catalogs, process orders\n5. **Google Ads**: For search intent when people actively look for products\n\nStart with Instagram + Facebook ads (budget: 1,000-3,000 MAD/month), track ROI after 30 days.`;
  }

  if (lowerQ.includes('investor') || lowerQ.includes('funding')) {
    return `Getting investors in Morocco/MENA:\n\n**Preparation (2-3 months)**:\n1. Solid business plan with financial projections\n2. Pitch deck (10-15 slides)\n3. MVP or proof of concept\n4. Traction metrics (users, revenue, growth rate)\n\n**Finding Investors**:\n1. **Angel Networks**: Morocco Angels, ABAN (African Business Angel Network)\n2. **VCs**: Outlierz Ventures, Savannah Fund, Algebra Ventures\n3. **Accelerators**: Startup Morocco, Flat6Labs, Impact Lab\n4. **Competitions**: Seedstars, Maghreb Startup Initiative\n\n**What they look for**:\n- Market size ($100M+)\n- Strong team\n- 10x potential return\n- Clear exit strategy\n\nTip: Start with friends/family for first $10K-50K, then approach angels.`;
  }

  if (lowerQ.includes('payment')) {
    return `Payment methods for MENA region:\n\n**Morocco**:\n1. Cash on Delivery (COD) - 60-70% of e-commerce\n2. CMI cards (local cards)\n3. Visa/Mastercard\n4. Mobile wallets emerging\n\n**Popular Payment Gateways**:\n- **Morocco**: CMI, PayZone, Maroc Telecommerce\n- **Regional**: PayTabs, Telr, Checkout.com\n- **International**: Stripe (limited), PayPal (receiving only in some countries)\n\n**Recommendations**:\n- Always offer COD for higher conversion\n- Integrate local payment gateway first\n- Add international later for export\n- Consider installment payments (popular in Morocco)\n\nStart with CMI + COD, expect 3-4 weeks integration time.`;
  }

  if (lowerQ.includes('break') || lowerQ.includes('break-even')) {
    return `How to calculate break-even point:\n\n**Formula**:\nBreak-Even Point (units) = Fixed Costs / (Price per Unit - Variable Cost per Unit)\n\n**Example**:\n- Fixed Costs: 50,000 MAD/month (rent, salaries, utilities)\n- Price per Unit: 500 MAD\n- Variable Cost per Unit: 300 MAD (materials, packaging, shipping)\n\nBreak-Even = 50,000 / (500 - 300) = 250 units/month\n\n**Steps**:\n1. List all fixed costs (costs that don't change with sales)\n2. Calculate variable cost per unit (changes with production)\n3. Set your selling price\n4. Apply formula\n5. Add 20-30% buffer for safety\n\n**In months**: Divide annual fixed costs by monthly contribution margin.\n\nGoal: Break-even within 12-18 months for most startups.`;
  }

  return `Great question! Here's strategic advice for your business:\n\n**Key Considerations**:\n1. **Market Research**: Understand your target audience deeply - their needs, pain points, and buying behavior\n2. **Competitive Analysis**: Study 5-10 competitors. What do they do well? Where are the gaps?\n3. **Financial Planning**: Create realistic projections for 12-24 months. Track cash flow weekly\n4. **Start Small, Scale Fast**: Test with MVP, validate, then invest more\n5. **Focus on Retention**: It's 5x cheaper to keep customers than acquire new ones\n\n**For Morocco/MENA specifically**:\n- Local partnerships are crucial\n- Mobile-first approach (80%+ mobile usage)\n- Build trust through testimonials and social proof\n- Consider cultural nuances in marketing\n\n**Next Steps**:\n1. Create a 90-day action plan\n2. Set measurable KPIs\n3. Talk to 20 potential customers\n4. Build MVP or test campaign\n5. Iterate based on feedback\n\nNeed more specific advice? Feel free to ask follow-up questions!`;
};

export function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('consultation_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    setMessages(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setLoading(true);

    const answer = generateAnswer(question);

    try {
      const { data, error } = await supabase
        .from('consultation_history')
        .insert({
          user_id: user.id,
          question,
          answer,
          category: 'general',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages([...messages, data]);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Q&A MerkeWin</h2>
        <p className="text-slate-600 mt-1">Ask me anything about your business</p>
      </div>

      <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Start a conversation</h3>
              <p className="text-slate-600 mb-6">
                Ask me about pricing, marketing, funding, or any business challenge
              </p>
              <div className="space-y-2 max-w-2xl mx-auto">
                <p className="text-sm text-slate-500 mb-3">Try these questions:</p>
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuestion(question)}
                    className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 bg-blue-50 rounded-lg p-4">
                  <p className="text-slate-900">{message.question}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-900 whitespace-pre-wrap">{message.answer}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600">Thinking...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your business..."
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
