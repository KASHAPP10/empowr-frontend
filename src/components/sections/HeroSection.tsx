import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-fintech.jpg";

export function HeroSection() {
  const features = [
    {
      icon: Shield,
      title: "Alternative Credit Scoring",
      description: "Beyond FICO - we evaluate gig work, payment history, and community trust"
    },
    {
      icon: TrendingUp,
      title: "Empowr Score",
      description: "Our proprietary AI model creates fairer assessments for entrepreneurs"
    },
    {
      icon: Users,
      title: "Inclusive Finance",
      description: "Empowering underserved communities with holistic credit evaluation"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Credit Beyond
                <span className="block bg-gradient-to-r from-accent-glow to-secondary-glow bg-clip-text text-transparent">
                  Traditional Scores
                </span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                EmpowrAI uses advanced AI to evaluate alternative data points, creating fair 
                credit assessments that recognize your full financial picture - not just your FICO score.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild className="group">
                <Link to="/assessment">
                  Start Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button variant="glass" size="xl" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-white/80 text-sm">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-white/80 text-sm">Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10x</div>
                <div className="text-white/80 text-sm">Faster Approval</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img
                src={heroImage}
                alt="EmpowrAI Credit Assessment Dashboard"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass rounded-xl p-6 hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 gradient-secondary rounded-lg shadow-soft">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}