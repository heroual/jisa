import { useState } from 'react';
import {
  Sparkles,
  Search,
  Users,
  UserPlus,
  Globe,
  TrendingUp,
  Target,
  BarChart3,
  Check,
  Star,
  Mail,
  ChevronRight,
  Zap,
  Shield,
  Clock,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: Search,
      title: 'Keyword Research',
      description: 'Discover high-value keywords with search volumes and competition analysis',
    },
    {
      icon: Users,
      title: 'Competitor Benchmarking',
      description: 'Analyze competitor strategies and market positioning in real-time',
    },
    {
      icon: UserPlus,
      title: 'Lead Generation',
      description: 'Automatically find and qualify potential leads for your business',
    },
    {
      icon: Globe,
      title: 'Website & Social Analysis',
      description: 'Deep insights into SEO, performance, and social media engagement',
    },
    {
      icon: TrendingUp,
      title: 'Market Research',
      description: 'Stay ahead with market trends and consumer behavior insights',
    },
    {
      icon: Target,
      title: 'Strategy Planning',
      description: 'AI-powered business strategies tailored to your goals',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      features: [
        'Up to 3 projects',
        'Basic keyword research',
        '10 competitor analyses/month',
        '50 leads/month',
        'Email support',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$49',
      period: 'per month',
      features: [
        'Unlimited projects',
        'Advanced keyword research',
        'Unlimited competitor analyses',
        '500 leads/month',
        'Website & social analysis',
        'Priority support',
        'Export to CSV/Excel',
      ],
      cta: 'Start Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$149',
      period: 'per month',
      features: [
        'Everything in Professional',
        'Unlimited leads',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'White-label options',
        'Advanced analytics',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO, TechVenture',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      quote: 'This AI consultant transformed how we approach market research. The insights are incredibly accurate.',
      rating: 5,
    },
    {
      name: 'Emma Rodriguez',
      role: 'Marketing Director',
      image: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200',
      quote: 'The competitor analysis feature alone saved us hundreds of hours. Absolutely worth every penny.',
      rating: 5,
    },
    {
      name: 'Aisha Hassan',
      role: 'Startup Founder',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
      quote: 'As a solo founder, having an AI business consultant has been game-changing for my growth strategy.',
      rating: 5,
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f0e6] to-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-[#d6c2a3]/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d6c2a3] to-[#c4a87f] rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Jisa Consultant</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-700 hover:text-[#c4a87f] transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-700 hover:text-[#c4a87f] transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-slate-700 hover:text-[#c4a87f] transition-colors">
                Testimonials
              </a>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] text-white rounded-full hover:shadow-lg hover:shadow-[#d6c2a3]/30 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#d6c2a3]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#d6c2a3]/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#d6c2a3]/20">
                <Sparkles className="w-4 h-4 text-[#c4a87f]" />
                <span className="text-sm text-slate-700">Powered by Advanced AI</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                Empower Your
                <span className="block bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] bg-clip-text text-transparent">
                  Business
                </span>
                with Intelligent AI
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Your personal AI consultant for smart insights and growth. Make data-driven decisions with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="group px-8 py-4 bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-[#d6c2a3]/40 transition-all flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 rounded-full font-semibold border-2 border-[#d6c2a3]/30 hover:border-[#d6c2a3] transition-all">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d6c2a3] to-[#c4a87f] border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">10,000+ users</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-[#d6c2a3] text-[#d6c2a3]" />
                  ))}
                  <span className="ml-2 text-sm text-slate-600">4.9/5 rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d6c2a3]/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-[#d6c2a3]/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#d6c2a3] to-[#c4a87f] rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">AI Assistant</div>
                      <div className="font-semibold text-slate-900">Analyzing your business...</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    {[
                      { label: 'Market Analysis', value: 94 },
                      { label: 'Competitor Insights', value: 87 },
                      { label: 'Growth Strategy', value: 92 },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">{metric.label}</span>
                          <span className="font-semibold text-[#c4a87f]">{metric.value}%</span>
                        </div>
                        <div className="h-2 bg-[#f5f0e6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] rounded-full transition-all duration-1000"
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f0e6] rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#c4a87f]" />
            <span className="text-sm text-slate-700">About Jisa Consultant</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Your Intelligent Business Partner
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Jisa Consultant combines cutting-edge artificial intelligence with elegant design to help entrepreneurs,
            startups, and SMEs make smarter decisions. From market research to lead generation, we provide
            actionable insights that drive real growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Zap, label: 'Lightning Fast', desc: 'Get insights in seconds' },
              { icon: Shield, label: 'Secure & Private', desc: 'Your data is protected' },
              { icon: Clock, label: '24/7 Available', desc: 'AI that never sleeps' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 bg-[#f5f0e6] rounded-2xl hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#d6c2a3] to-[#c4a87f] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.label}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-gradient-to-b from-[#f5f0e6] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#c4a87f]" />
              <span className="text-sm text-slate-700">Powerful Features</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need to Succeed
            </h2>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive AI-powered tools designed for modern business professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl border border-[#d6c2a3]/20 hover:border-[#d6c2a3] hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#d6c2a3] to-[#c4a87f] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#d6c2a3]/30 transition-all">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f0e6] rounded-full mb-6">
              <BarChart3 className="w-4 h-4 text-[#c4a87f]" />
              <span className="text-sm text-slate-700">Dashboard Preview</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Beautiful, Intuitive Interface
            </h2>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience elegance and functionality in perfect harmony
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#f5f0e6] to-white rounded-3xl p-8 shadow-2xl border border-[#d6c2a3]/20">
            <div className="aspect-video bg-white rounded-2xl shadow-inner flex items-center justify-center border border-[#d6c2a3]/10">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-[#d6c2a3] mx-auto mb-4" />
                <p className="text-slate-500">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-[#f5f0e6] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#c4a87f]" />
              <span className="text-sm text-slate-700">Pricing Plans</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Choose Your Perfect Plan
            </h2>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Flexible pricing for businesses of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 bg-white rounded-3xl border-2 transition-all ${
                  plan.popular
                    ? 'border-[#d6c2a3] shadow-2xl shadow-[#d6c2a3]/20 scale-105'
                    : 'border-[#d6c2a3]/20 hover:border-[#d6c2a3] hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] text-white rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                    {plan.price !== 'Free' && (
                      <span className="text-slate-500 ml-2">/ {plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#c4a87f] flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-4 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] text-white hover:shadow-lg hover:shadow-[#d6c2a3]/30'
                      : 'bg-[#f5f0e6] text-slate-900 hover:bg-[#d6c2a3]/20'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f0e6] rounded-full mb-6">
              <Star className="w-4 h-4 text-[#c4a87f]" />
              <span className="text-sm text-slate-700">Testimonials</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Loved by Professionals
            </h2>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join thousands of successful entrepreneurs using Jisa Consultant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-[#f5f0e6] to-white rounded-2xl hover:shadow-xl transition-all border border-[#d6c2a3]/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#d6c2a3] text-[#d6c2a3]" />
                  ))}
                </div>

                <p className="text-slate-700 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#d6c2a3]"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-[#f5f0e6] via-white to-[#f5f0e6]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm">
            <Mail className="w-4 h-4 text-[#c4a87f]" />
            <span className="text-sm text-slate-700">Stay Updated</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Get AI Insights Weekly
          </h2>

          <p className="text-lg text-slate-600 mb-8">
            Subscribe to receive expert tips, industry trends, and exclusive updates
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border-2 border-[#d6c2a3]/30 focus:border-[#d6c2a3] focus:outline-none transition-all"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-[#d6c2a3] to-[#c4a87f] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[#d6c2a3]/30 transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="py-12 px-6 bg-white border-t border-[#d6c2a3]/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#d6c2a3] to-[#c4a87f] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Jisa Consultant</span>
              </div>
              <p className="text-slate-600 max-w-sm">
                Empowering businesses with intelligent AI insights for smarter decisions and sustainable growth.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-600 hover:text-[#c4a87f] transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-600 hover:text-[#c4a87f] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-600 hover:text-[#c4a87f] transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-[#c4a87f] transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-600 hover:text-[#c4a87f] transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-600 hover:text-[#c4a87f] transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#d6c2a3]/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © 2025 Jisa Consultant. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#f5f0e6] flex items-center justify-center text-[#c4a87f] hover:bg-[#d6c2a3] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#f5f0e6] flex items-center justify-center text-[#c4a87f] hover:bg-[#d6c2a3] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#f5f0e6] flex items-center justify-center text-[#c4a87f] hover:bg-[#d6c2a3] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
