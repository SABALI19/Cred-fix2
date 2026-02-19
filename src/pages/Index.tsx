import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthButton from "@/components/auth/AuthButton";
import AgentsSection from "@/components/agents/AgentsSection";
import {
  Shield,
  TrendingUp,
  CheckCircle,
  Users,
  Clock,
  DollarSign,
  Star,
  ArrowRight,
  BarChart3,
  FileText,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  AnimatedContainer,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  FloatContainer,
  CountUp,
  PageTransition,
} from "@/components/animations/AnimatedComponents";
import { useScrollAnimation } from "@/hooks/useAnimations";
import DetailedPricingModal from "@/components/pricing/DetailedPricingModal";

const Index = () => {
  const { user } = useAuth();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<
    "credit" | "tax" | null
  >(null);

  const handleGetStarted = (serviceType: "credit" | "tax" | "bundle") => {
    if (serviceType === "bundle") {
      // For bundle, go directly to dashboard
      window.location.href = "/dashboard";
    } else {
      // For individual services, show detailed pricing modal
      setSelectedServiceType(serviceType);
      setIsPricingModalOpen(true);
    }
  };

  const closePricingModal = () => {
    setIsPricingModalOpen(false);
    setSelectedServiceType(null);
  };

  const features = [
    {
      icon: Shield,
      title: "Credit Monitoring",
      description:
        "24/7 monitoring of your credit reports from all three bureaus",
      cta: "Start Monitoring",
    },
    {
      icon: FileText,
      title: "Dispute Management",
      description: "Professional dispute letters sent on your behalf",
      cta: "Begin Disputes",
    },
    {
      icon: TrendingUp,
      title: "Score Improvement",
      description: "Proven strategies to boost your credit score",
      cta: "Improve Score",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Real-time dashboard to track your credit repair journey",
      cta: "Track Progress",
    },
    {
      icon: DollarSign,
      title: "Tax Filing Services",
      description:
        "Professional tax preparation and filing with maximum refunds",
      cta: "File Your Taxes",
    },
    {
      icon: Zap,
      title: "Fast Results",
      description: "See improvements in as little as 30-60 days",
      cta: "Get Fast Results",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated credit & tax specialists to guide you",
      cta: "Get Support",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      score: "580 → 720",
      text: "CreditFix Pro helped me increase my credit score by 140 points in just 6 months!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      score: "620 → 780",
      text: "Amazing service! I was able to qualify for my dream home mortgage.",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      score: "$3,200 Refund",
      text: "Their tax service found deductions I missed and got me $3,200 more than I expected!",
      rating: 5,
    },
    {
      name: "David Wilson",
      score: "550 → 680",
      text: "The combination of credit repair and tax services saved me thousands in interest rates.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Credit Repair",
      price: "$99",
      period: "/month",
      description: "Professional credit repair services",
      features: [
        "Complete credit report analysis",
        "Unlimited dispute letters",
        "Monthly progress reports",
        "Credit coaching calls",
        "Score simulator access",
        "Email & phone support",
        "Goodwill letter assistance",
      ],
      popular: false,
      category: "credit",
    },
    {
      name: "Tax Services",
      price: "$149",
      period: "/month",
      description: "Professional tax preparation & filing",
      features: [
        "Personal tax preparation",
        "Business tax filing",
        "Refund optimization",
        "Tax planning strategy",
        "Audit protection",
        "Year-round support",
        "Maximum deduction finding",
      ],
      popular: false,
      category: "tax",
    },
    {
      name: "Complete Bundle",
      price: "$199",
      period: "/month",
      originalPrice: "$248",
      description: "Best value - Credit repair + Tax services",
      features: [
        "Everything in Credit Repair",
        "Everything in Tax Services",
        "Priority processing",
        "Dedicated specialist",
        "Advanced dispute strategies",
        "Attorney review",
        "24/7 phone support",
        "Save $49/month",
      ],
      popular: true,
      category: "bundle",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Trusted by 50,000+ clients
                  </Badge>
                </motion.div>
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Transform Your
                  <motion.span
                    className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    Financial Future
                  </motion.span>
                  in 60 Days
                </motion.h1>
                <motion.p
                  className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  Professional credit repair and tax filing services with
                  guaranteed results. Monitor your progress with our
                  personalized dashboard.
                </motion.p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {user ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/dashboard" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
                      >
                        View Your Dashboard
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AuthButton
                        size="lg"
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
                        redirectTo="/dashboard"
                      >
                        Start Repair
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </AuthButton>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AuthButton
                        variant="outline"
                        size="lg"
                        className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
                        redirectTo="/dashboard"
                      >
                        Get Free Analysis
                      </AuthButton>
                    </motion.div>
                  </>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
                    onClick={() => (window.location.href = "/booking")}
                  >
                    Book Consultation
                  </Button>
                </motion.div>
              </motion.div>

              <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-4 px-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    98%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Success Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-accent">
                    +130
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg. Score Increase
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">45</div>
                  <div className="text-sm text-muted-foreground">
                    Days to Results
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credit Progress Demo Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 backdrop-blur-sm border border-border/50">
                <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                      Your Credit Progress
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent"
                    >
                      Live Demo
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Credit Score
                      </span>
                      <span className="text-2xl font-bold text-accent">
                        720
                      </span>
                    </div>

                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-to-r from-primary to-accent h-3 rounded-full w-[75%]"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-accent">
                          +45
                        </div>
                        <div className="text-xs text-muted-foreground">
                          This Month
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-primary">
                          12
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Items Removed
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-accent">
                          95%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Complete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedContainer className="text-center mb-16">
              <motion.h2
                className="text-3xl lg:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Complete Financial Services Solution
              </motion.h2>
              <motion.p
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Everything you need to rebuild your credit score, maximize tax
                refunds, and secure your financial future
              </motion.p>
            </AnimatedContainer>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <StaggerItem key={index}>
                    <HoverCard className="h-full">
                      <Card className="border-border/50 h-full">
                        <CardHeader>
                          <motion.div
                            className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="w-6 h-6 text-primary" />
                          </motion.div>
                          <CardTitle className="text-xl">
                            {feature.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription className="text-base">
                            {feature.description}
                          </CardDescription>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <AuthButton
                              size="sm"
                              variant="outline"
                              className="w-full"
                              redirectTo="/dashboard"
                            >
                              {feature.cta}
                            </AuthButton>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </HoverCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Our Expert Team Section */}
        <AgentsSection />

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Real Results from Real People
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how our clients have transformed their credit scores and
                their lives
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <Badge
                        variant="outline"
                        className="text-accent border-accent/30"
                      >
                        {testimonial.score}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {testimonial.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">
                      "{testimonial.text}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Affordable pricing for every budget with no hidden fees
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative border-border/50 ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-accent">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      {plan.originalPrice && (
                        <div className="text-sm text-muted-foreground mb-1">
                          <span className="line-through">
                            {plan.originalPrice}/month
                          </span>
                          <span className="ml-2 text-green-600 font-medium">
                            Save $49
                          </span>
                        </div>
                      )}
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-2">
                      <Button
                        className={`w-full ${plan.popular ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() =>
                          handleGetStarted(
                            plan.category as "credit" | "tax" | "bundle",
                          )
                        }
                      >
                        Get Started
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => (window.location.href = "/booking")}
                      >
                        Book Consultation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have improved their
              credit scores and maximized their tax refunds with CreditFix Pro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8"
                  >
                    View Your Dashboard
                    <BarChart3 className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <AuthButton
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8"
                  redirectTo="/dashboard"
                >
                  View Dashboard Demo
                  <BarChart3 className="w-5 h-5 ml-2" />
                </AuthButton>
              )}
              <AuthButton
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-primary"
                redirectTo="/dashboard"
              >
                Start Free Consultation
              </AuthButton>
            </div>
          </div>
        </section>

        {/* Comprehensive Footer */}
        <Footer />

        {/* Detailed Pricing Modal */}
        <DetailedPricingModal
          isOpen={isPricingModalOpen}
          onClose={closePricingModal}
          serviceType={selectedServiceType}
        />
      </div>
    </PageTransition>
  );
};

export default Index;
