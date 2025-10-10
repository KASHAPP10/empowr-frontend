import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Target, TrendingUp, Shield, Users, Linkedin, ArrowRight, CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto max-w-6xl relative">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">Our Mission</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Democratizing Access to Capital
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed">
            EmpowrAI is building an AI-driven microfinance platform that eliminates systemic bias, 
            empowers minority and women-owned businesses, and fosters inclusive economic growth.
          </p>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="shadow-soft hover-lift border-destructive/20">
              <CardHeader>
                <Target className="w-12 h-12 text-destructive mb-4" />
                <CardTitle className="text-2xl">The Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Minority and women-owned businesses are disproportionately denied loans or offered 
                  unfavorable terms due to biased credit scoring and limited access to networks and resources.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Traditional lending systems fail underrepresented founders through outdated financial 
                  metrics that don't capture the full picture of creditworthiness.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover-lift border-success/20">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-success mb-4" />
                <CardTitle className="text-2xl">Our Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  An unbiased, AI-powered loan application and scoring process that evaluates applicants 
                  holistically using alternative data points.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We leverage advanced AI to assess creditworthiness beyond traditional metrics, enabling 
                  fair lending decisions and financial empowerment for underserved founders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Co-Founders Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Leadership</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet the Co-Founders</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Driven by a shared passion for inclusive finance and social impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Maansi Prasad */}
            <Card className="shadow-glow hover-lift border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="w-32 h-32 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center text-6xl font-bold text-primary-foreground">
                  MP
                </div>
                <CardTitle className="text-2xl">Maansi Prasad</CardTitle>
                <CardDescription className="text-base">Co-Founder & CEO</CardDescription>
                <a 
                  href="https://www.linkedin.com/in/maansiprasad/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-smooth mt-2"
                >
                  <Linkedin className="w-5 h-5" />
                  Connect on LinkedIn
                </a>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Business student at McCombs with a focus in accounting. Experienced in financial 
                  modeling, operations, and social entrepreneurship. Passionate about building 
                  technology that reduces systemic inequities in access to opportunity.
                </p>
              </CardContent>
            </Card>

            {/* Malhaar Kashyap */}
            <Card className="shadow-glow hover-lift border-secondary/20">
              <CardHeader className="text-center pb-4">
                <div className="w-32 h-32 rounded-full gradient-secondary mx-auto mb-4 flex items-center justify-center text-6xl font-bold text-secondary-foreground">
                  MK
                </div>
                <CardTitle className="text-2xl">Malhaar Kashyap</CardTitle>
                <CardDescription className="text-base">Co-Founder & CTO</CardDescription>
                <a 
                  href="https://www.linkedin.com/in/malhaarkashyap/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-smooth mt-2"
                >
                  <Linkedin className="w-5 h-5" />
                  Connect on LinkedIn
                </a>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Engineer and technologist with expertise in AI and data-driven product design. 
                  Experienced in building scalable platforms and committed to leveraging technology 
                  for inclusive finance. Passionate about using innovation to solve complex social problems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-success/10 text-success border-success/20">Our Impact</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Building for Scale</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ambitious goals to transform access to capital for underserved founders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-soft hover-lift">
              <CardHeader>
                <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                  100K+
                </div>
                <CardTitle className="text-xl">Small Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built to serve in the next 5 years
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft hover-lift">
              <CardHeader>
                <div className="text-5xl font-bold gradient-secondary bg-clip-text text-transparent mb-2">
                  40%
                </div>
                <CardTitle className="text-xl">Bias Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI model designed to reduce lending bias (projected)
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft hover-lift">
              <CardHeader>
                <div className="text-5xl font-bold gradient-success bg-clip-text text-transparent mb-2">
                  $50M+
                </div>
                <CardTitle className="text-xl">Fair Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Goal to unlock for underserved founders by 2030
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Trust & Security</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built on Trust</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Committed to the highest standards of compliance, security, and privacy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-soft">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Compliance Standards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Fair Credit Reporting Act (FCRA)</p>
                    <p className="text-sm text-muted-foreground">Ensuring accurate and fair credit reporting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Equal Credit Opportunity Act (ECOA)</p>
                    <p className="text-sm text-muted-foreground">Prohibiting discrimination in lending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <Users className="w-12 h-12 text-secondary mb-4" />
                <CardTitle className="text-2xl">Partnerships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <p>Community Banks</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <p>Community Development Financial Institutions (CDFIs)</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <p>Fintech Accelerators</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 shadow-soft border-accent/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Shield className="w-8 h-8 text-accent" />
                Privacy-First Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Your data is encrypted, anonymized for AI training, and never sold. We believe in 
                transparent, ethical data practices that put your privacy first while enabling 
                innovation in credit assessment.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto max-w-4xl text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of underserved founders accessing fair and equitable financing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="fintech" className="text-lg">
              <Link to="/assessment">
                Start Your Assessment
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
