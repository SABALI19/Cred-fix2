import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Award,
  Users,
  TrendingUp,
  Shield,
  Heart,
  Target,
  Star,
  CheckCircle2,
  Calendar,
  Building,
} from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, value: "50,000+", label: "Clients Served" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: CheckCircle2, value: "500K+", label: "Items Removed" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Your financial information is protected with bank-level security and handled with the utmost confidentiality.",
    },
    {
      icon: Heart,
      title: "Client-Centered",
      description:
        "Every decision we make is focused on achieving the best possible outcomes for our clients' financial futures.",
    },
    {
      icon: Target,
      title: "Results-Driven",
      description:
        "We're committed to delivering measurable results and won't rest until you achieve your credit goals.",
    },
    {
      icon: Star,
      title: "Excellence",
      description:
        "We maintain the highest standards in everything we do, from customer service to dispute resolution.",
    },
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Founder & CEO",
      description:
        "Former credit analyst with 15+ years experience helping families rebuild their financial futures.",
      image: "/api/placeholder/120/120",
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Tax Services",
      description:
        "CPA with 12+ years specializing in tax optimization and IRS representation.",
      image: "/api/placeholder/120/120",
    },
    {
      name: "Jennifer Chen",
      role: "Chief Technology Officer",
      description:
        "Fintech expert ensuring our platform provides the best user experience and security.",
      image: "/api/placeholder/120/120",
    },
    {
      name: "David Thompson",
      role: "Head of Credit Operations",
      description:
        "Credit industry veteran with expertise in dispute resolution and credit law.",
      image: "/api/placeholder/120/120",
    },
  ];

  const milestones = [
    {
      year: "2008",
      title: "Company Founded",
      description:
        "Started with a mission to democratize credit repair services",
    },
    {
      year: "2012",
      title: "10,000 Clients",
      description:
        "Reached our first major milestone of helping 10,000 families",
    },
    {
      year: "2016",
      title: "Tax Services Added",
      description:
        "Expanded to offer comprehensive tax filing and optimization services",
    },
    {
      year: "2020",
      title: "Digital Platform",
      description:
        "Launched our state-of-the-art digital platform for better client experience",
    },
    {
      year: "2024",
      title: "50,000+ Success Stories",
      description:
        "Celebrating over 50,000 clients who achieved their financial goals",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CreditFix Pro
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              For over 15 years, we've been helping individuals and families
              transform their financial futures through expert credit repair and
              tax services.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              onClick={() => (window.location.href = "/booking")}
            >
              Start Your Journey
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                We believe everyone deserves a second chance at financial
                success. Our mission is to provide accessible, professional
                credit repair and tax services that empower individuals and
                families to achieve their dreams of homeownership, business
                ownership, and financial independence.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and every decision we make
              for our clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our experienced team combines decades of expertise in credit
              repair, tax services, and financial technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="text-lg">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a small startup to a trusted leader in financial services,
              here's how we've grown.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                      {milestone.year.slice(-2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-px h-16 bg-border mt-4"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{milestone.year}</Badge>
                      <h3 className="font-semibold">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary to-accent text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Financial Future?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of satisfied clients who have achieved their
                credit and financial goals with CreditFix Pro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => (window.location.href = "/booking")}
                >
                  Book Free Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => (window.location.href = "/contact")}
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
