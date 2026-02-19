import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Gift,
  Share2,
  Copy,
  Mail,
  Facebook,
  Twitter,
  MessageCircle,
  TrendingUp,
  Award,
  CheckCircle2,
  Star,
  Calendar,
  Target,
} from "lucide-react";

const ReferralProgram = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState(
    user
      ? `CF${user.name.replace(/\s+/g, "").toUpperCase()}${Date.now().toString().slice(-4)}`
      : "CFGUEST2024",
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralTiers = [
    {
      tier: "Bronze",
      referrals: "1-3",
      reward: "$50",
      bonus: "per referral",
      color: "bg-orange-100 text-orange-800",
      icon: Award,
    },
    {
      tier: "Silver",
      referrals: "4-9",
      reward: "$75",
      bonus: "per referral",
      color: "bg-gray-100 text-gray-800",
      icon: Star,
      popular: true,
    },
    {
      tier: "Gold",
      referrals: "10-19",
      reward: "$100",
      bonus: "per referral + $500 bonus",
      color: "bg-yellow-100 text-yellow-800",
      icon: TrendingUp,
    },
    {
      tier: "Platinum",
      referrals: "20+",
      reward: "$150",
      bonus: "per referral + $1000 bonus",
      color: "bg-purple-100 text-purple-800",
      icon: Target,
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Share Your Code",
      description: "Send your unique referral code to friends and family",
      icon: Share2,
    },
    {
      step: 2,
      title: "They Sign Up",
      description:
        "Your referral signs up using your code and completes onboarding",
      icon: Users,
    },
    {
      step: 3,
      title: "You Get Paid",
      description: "Receive your reward within 30 days of their first payment",
      icon: DollarSign,
    },
  ];

  const sharingOptions = [
    {
      platform: "Email",
      icon: Mail,
      color: "bg-blue-500",
      action: () => {
        const subject = "Transform Your Credit Score with CreditFix Pro";
        const body = `Hi! I've been using CreditFix Pro for my credit repair and tax services, and they're amazing! Use my referral code ${referralCode} to get started and save money. Check them out: ${window.location.origin}`;
        window.open(
          `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        );
      },
    },
    {
      platform: "Text Message",
      icon: MessageCircle,
      color: "bg-green-500",
      action: () => {
        const message = `Check out CreditFix Pro for credit repair! Use my code ${referralCode} to get started: ${window.location.origin}`;
        window.open(`sms:?body=${encodeURIComponent(message)}`);
      },
    },
    {
      platform: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(`Transform your credit score with CreditFix Pro! Use my referral code ${referralCode}`)}`;
        window.open(url, "_blank");
      },
    },
    {
      platform: "Twitter",
      icon: Twitter,
      color: "bg-blue-400",
      action: () => {
        const text = `Transform your credit score with @CreditFixPro! Use my referral code ${referralCode} to get started.`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
        window.open(url, "_blank");
      },
    },
  ];

  const stats = [
    { label: "Average Referral Earnings", value: "$500", icon: DollarSign },
    { label: "Top Referrer Earnings", value: "$5,000", icon: TrendingUp },
    { label: "People Referred", value: "25,000+", icon: Users },
    { label: "Success Rate", value: "94%", icon: CheckCircle2 },
  ];

  // Mock referral data for existing users
  const mockReferralData = {
    totalReferrals: 7,
    totalEarnings: 425,
    pendingEarnings: 150,
    currentTier: "Silver",
    nextTierReferrals: 2,
    recentReferrals: [
      { name: "John D.", status: "Completed", earning: 75, date: "2024-01-15" },
      { name: "Sarah M.", status: "Pending", earning: 75, date: "2024-01-10" },
      { name: "Mike R.", status: "Completed", earning: 75, date: "2024-01-08" },
    ],
  };

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

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Referral{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Program
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Earn money by helping others improve their credit and financial
              future
            </p>
          </div>
        </div>

        {user ? (
          // Authenticated User View
          <div className="space-y-8">
            {/* Dashboard Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {mockReferralData.totalReferrals}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Referrals
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${mockReferralData.totalEarnings}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Earned
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    ${mockReferralData.pendingEarnings}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Badge className="mb-2">{mockReferralData.currentTier}</Badge>
                  <div className="text-sm text-muted-foreground">
                    {mockReferralData.nextTierReferrals} more for next tier
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Referral Code */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Your Referral Code</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label>Share this code with friends:</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        value={referralCode}
                        readOnly
                        className="font-mono text-lg"
                      />
                      <Button onClick={handleCopyCode}>
                        <Copy className="w-4 h-4 mr-2" />
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Referrals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReferralData.recentReferrals.map((referral, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{referral.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(referral.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            referral.status === "Completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {referral.status}
                        </Badge>
                        <p className="text-sm font-medium text-green-600">
                          ${referral.earning}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Non-authenticated User View
          <div className="space-y-12">
            {/* Hero Stats */}
            <section>
              <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6 text-center">
                        <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                        <div className="text-2xl font-bold mb-2">
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

            {/* How It Works */}
            <section>
              <h2 className="text-3xl font-bold text-center mb-8">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {howItWorks.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card key={index} className="text-center">
                      <CardContent className="p-6">
                        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                          {step.step}
                        </div>
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Referral Tiers */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Referral Tiers & Rewards
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {referralTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <Card
                  key={index}
                  className={`relative ${tier.popular ? "ring-2 ring-primary" : ""}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">{tier.tier}</h3>
                    <Badge className={`mb-3 ${tier.color}`}>
                      {tier.referrals} referrals
                    </Badge>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {tier.reward}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tier.bonus}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Sharing Options */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Share & Earn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  Choose how you'd like to share CreditFix Pro with your network
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {sharingOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex-col space-y-2"
                      onClick={option.action}
                    >
                      <div
                        className={`${option.color} rounded-full w-12 h-12 flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span>{option.platform}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Terms & Conditions */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Program Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Eligibility</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Must be an active CreditFix Pro customer</li>
                    <li>• Referrals must be new customers</li>
                    <li>• One reward per unique referral</li>
                    <li>• Valid ID required for payouts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Terms</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Payments processed within 30 days</li>
                    <li>• Minimum payout threshold: $25</li>
                    <li>• PayPal, check, or account credit options</li>
                    <li>• Tax forms provided for earnings over $600</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary to-accent text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Start Earning Today!</h2>
              <p className="text-lg mb-6 opacity-90">
                Join our referral program and help others while earning money
              </p>
              {user ? (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  View Your Dashboard
                </Button>
              ) : (
                <div className="space-x-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => (window.location.href = "/signup")}
                  >
                    Join Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                    onClick={() => (window.location.href = "/contact")}
                  >
                    Learn More
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ReferralProgram;
