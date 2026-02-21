import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TaxFilingRequirements from "@/components/tax/TaxFilingRequirements";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Target,
  Calendar,
  Download,
  DollarSign,
  Edit,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import CreditScoreGauge from "@/components/charts/CreditScoreGauge";
import DisputesGauge from "@/components/charts/DisputesGauge";
import AccountStatusGauge from "@/components/charts/AccountStatusGauge";
import UserAgentChat from "@/components/chat/UserAgentChat";

const Dashboard = () => {
  const { user } = useAuth();
  const [isTaxFilingOpen, setIsTaxFilingOpen] = useState(false);
  const [isRefundOptimizationOpen, setIsRefundOptimizationOpen] =
    useState(false);
  const [isAuditProtectionOpen, setIsAuditProtectionOpen] = useState(false);
  // Dashboard Data
  const currentScore = 720;
  const previousScore = 675; // Last month's score
  const resolvedDisputes = 12;
  const inProgressDisputes = 5;
  const pendingDisputes = 3;
  const accountsGoodStanding = 13;
  const accountsNeedingAttention = 2;

  // Monthly progress data for line chart
  const monthlyProgress = [
    { month: "Jan", score: 580 },
    { month: "Feb", score: 595 },
    { month: "Mar", score: 620 },
    { month: "Apr", score: 645 },
    { month: "May", score: 680 },
    { month: "Jun", score: 720 },
  ];

  // Recent activity data
  const recentActivity = [
    {
      type: "dispute",
      title: "Late Payment Dispute Filed",
      description: "Chase Credit Card - Late payment from 2022",
      status: "in-progress",
      date: "2 days ago",
      icon: FileText,
    },
    {
      type: "improvement",
      title: "Credit Score Increased",
      description: "Your score improved by 15 points",
      status: "success",
      date: "1 week ago",
      icon: TrendingUp,
    },
    {
      type: "resolved",
      title: "Collection Account Removed",
      description: "Medical collection account successfully removed",
      status: "success",
      date: "2 weeks ago",
      icon: CheckCircle2,
    },
    {
      type: "dispute",
      title: "Credit Inquiry Dispute",
      description: "Unauthorized hard inquiry from ABC Lending",
      status: "pending",
      date: "3 weeks ago",
      icon: AlertCircle,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-accent" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            Success
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "agent", "admin"]}>
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* IRS ID.me Verification Notice Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b border-blue-500">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Shield className="w-5 h-5 text-blue-200" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm lg:text-base mb-1">
                    🔐 IRS Security Notice: ID.me Verification May Be Required
                  </h3>
                  <p className="text-xs lg:text-sm text-blue-100 leading-relaxed">
                    To protect your identity and ensure fast refund processing,
                    the IRS may require you to verify through ID.me — their
                    official identity verification partner. Make sure you have a
                    government-issued ID, your SSN, and a camera-ready device.
                    This is a one-time secure process.
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 w-full lg:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-blue-50 w-full lg:w-auto whitespace-nowrap"
                  onClick={() => window.open("https://www.irs.gov", "_blank")}
                >
                  ��� Learn more on IRS.gov
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="relative flex-shrink-0">
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                  <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                  <AvatarFallback className="text-sm sm:text-lg bg-primary/10 text-primary">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Link
                  to="/profile"
                  className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/90 transition-colors"
                  title="Edit profile"
                >
                  <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  Welcome back, {user?.name || "User"}!
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Track your credit improvement journey
                </p>
                {user?.bio && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md truncate">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 lg:mt-0 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full sm:w-auto"
              >
                <Link to="/profile">
                  <User className="w-4 h-4 mr-2" />
                  <span className="sm:inline">Edit Profile</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                <span className="sm:inline">Export</span>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span className="sm:inline">Schedule Call</span>
              </Button>
            </div>
          </div>

          {/* Welcome Message */}
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2 text-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span className="text-lg sm:text-xl font-semibold text-primary">
                  We're excited to help you with your credit and tax goals!
                </span>
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-center text-sm sm:text-base text-muted-foreground">
                Your free credit analysis is ready. Let's start improving your
                financial health together!
              </p>
            </CardContent>
          </Card>

          {user?.role === "user" ? <UserAgentChat className="mb-8" /> : null}

          {/* IRS Security Alert */}
          <Card className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center space-x-3 min-w-0">
                  <div className="bg-red-500 rounded-full p-2">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-red-800 dark:text-red-200">
                      🔐 Protect Yourself from IRS Scams
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Learn how to verify your identity and avoid fraud with
                      official IRS resources.
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  onClick={() =>
                    window.open(
                      "https://www.irs.gov/identity-theft-fraud-scams",
                      "_blank",
                    )
                  }
                >
                  👉 Visit IRS.gov
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Referral Program Banner */}
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center space-x-3 min-w-0">
                  <div className="bg-green-500 rounded-full p-2">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Earn $50-$150 per referral!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Share CreditFix Pro with friends and earn money for each
                      successful referral.
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  onClick={() => (window.location.href = "/referral-program")}
                >
                  Start Earning
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Score
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">720</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +45 this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Items Disputed
                </CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  12 resolved
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Accounts Monitored
                </CardTitle>
                <CreditCard className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Shield className="h-3 w-3 mr-1" />
                  85% good standing
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Goal Progress
                </CardTitle>
                <Target className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Target: 750
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Credit Score Gauge */}
            <CreditScoreGauge
              score={currentScore}
              previousScore={previousScore}
              title="Credit Score Progress"
              subtitle="Current score out of 850"
              showImprovement={true}
              size="md"
              animated={true}
            />

            {/* Disputes Progress Gauge */}
            <DisputesGauge
              resolved={resolvedDisputes}
              inProgress={inProgressDisputes}
              pending={pendingDisputes}
              title="Disputes Progress"
              subtitle="Status of credit disputes"
              animated={true}
            />

            {/* Account Status Gauge */}
            <AccountStatusGauge
              goodStanding={accountsGoodStanding}
              needsAttention={accountsNeedingAttention}
              title="Account Status"
              subtitle="Health of your accounts"
              animated={true}
            />
          </div>

          {/* Additional Charts and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Progress Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>6-Month Score Trend</CardTitle>
                <CardDescription>
                  Your credit score improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyProgress}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis
                        domain={["dataMin - 10", "dataMax + 10"]}
                        className="text-xs"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{
                          fill: "hsl(var(--primary))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates on your credit repair progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <h4 className="text-sm font-medium leading-tight">
                              {activity.title}
                            </h4>
                            {getStatusBadge(activity.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tax Filing Services */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Tax Filing Services
              </CardTitle>
              <CardDescription>
                Maximize your refunds with professional tax preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">Document Preparation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Organize and upload your tax documents securely
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsTaxFilingOpen(true)}
                  >
                    View Requirements
                  </Button>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h3 className="font-medium">Refund Optimization</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Find every deduction and credit you're entitled to
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsRefundOptimizationOpen(true)}
                  >
                    Learn More
                  </Button>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium">Audit Protection</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Professional representation if you're audited
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsAuditProtectionOpen(true)}
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-green-900 dark:text-green-100">
                      Ready to File Your Taxes?
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                      Get started with professional tax preparation and maximize
                      your refund
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => (window.location.href = "/documents")}
                    >
                      Upload Documents
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 w-full sm:w-auto"
                      onClick={() => setIsTaxFilingOpen(true)}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Start Tax Filing
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>
                Steps to further improve your credit score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    <h3 className="font-medium">Pay Down Balances</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Reduce credit utilization to under 30% on all cards
                  </p>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: 65% target: 30%
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-medium">Monitor Reports</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Regular monitoring for new negative items
                  </p>
                  <Progress value={90} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Last check: 2 days ago
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">Build History</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Keep old accounts open to maintain credit history
                  </p>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg age: 8.5 years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Filing Requirements Modal */}
          <TaxFilingRequirements
            isOpen={isTaxFilingOpen}
            onClose={() => setIsTaxFilingOpen(false)}
          />

          {/* Refund Optimization Modal */}
          <Dialog
            open={isRefundOptimizationOpen}
            onOpenChange={setIsRefundOptimizationOpen}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <DialogTitle className="text-xl">
                    Refund Optimization
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base leading-relaxed">
                  Refers to legally maximizing your tax refund or reducing how
                  much you owe when filing your taxes. It's about using tax
                  laws, credits, deductions, and planning strategies to your
                  advantage.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-6">
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    What We Do for You:
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Identify all eligible deductions and credits</li>
                    <li>
                      • Review your financial situation for missed opportunities
                    </li>
                    <li>
                      • Apply proper tax strategies within legal boundaries
                    </li>
                    <li>• Maximize your refund while staying compliant</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsRefundOptimizationOpen(false)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Got It
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Audit Protection Modal */}
          <Dialog
            open={isAuditProtectionOpen}
            onOpenChange={setIsAuditProtectionOpen}
          >
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-6 h-6 text-blue-500" />
                  <DialogTitle className="text-xl">
                    Audit Protection
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base leading-relaxed">
                  Comprehensive protection and professional representation if
                  the IRS selects your tax return for audit.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* What is Audit Protection */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                    What is Audit Protection?
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    Audit protection is a service that provides professional
                    representation and support if the IRS audits your tax
                    return. It includes having qualified tax professionals
                    handle all communications with the IRS on your behalf,
                    ensuring your rights are protected throughout the process.
                  </p>
                </div>

                {/* Why You Need It */}
                <div>
                  <h4 className="font-semibold mb-3">
                    Why You Need Audit Protection:
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          Avoid costly mistakes during audit proceedings
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          Professional representation saves time and stress
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          Expert knowledge of tax laws and audit procedures
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          Protect your legal rights throughout the process
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          Minimize additional taxes, penalties, and interest
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          Peace of mind knowing experts handle everything
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div>
                  <h4 className="font-semibold mb-3">
                    What's Included in Our Audit Protection:
                  </h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-1">
                        Full IRS Representation
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        Our certified professionals communicate directly with
                        the IRS on your behalf
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-1">
                        Document Preparation & Review
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        We prepare and review all required documentation for
                        your audit
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-1">
                        Audit Correspondence Management
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        Handle all letters, notices, and communication from the
                        IRS
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-1">
                        Appeals Process Support
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        Representation if you need to appeal the audit results
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-1">
                        24/7 Support Access
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        Get answers to your questions throughout the audit
                        process
                      </p>
                    </div>
                  </div>
                </div>

                {/* Types of Audits */}
                <div className="bg-gray-50 dark:bg-gray-950/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">
                    Types of Audits We Handle:
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <h5 className="font-medium mb-1">Correspondence Audit</h5>
                      <p className="text-xs text-muted-foreground">
                        Most common - handled by mail
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Office Audit</h5>
                      <p className="text-xs text-muted-foreground">
                        In-person meeting at IRS office
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Field Audit</h5>
                      <p className="text-xs text-muted-foreground">
                        IRS visits your location
                      </p>
                    </div>
                  </div>
                </div>

                {/* Peace of Mind */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                      Your Peace of Mind
                    </h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    With our audit protection, you'll never have to face the IRS
                    alone. Our experienced professionals have successfully
                    handled thousands of audits, ensuring the best possible
                    outcome for our clients.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsAuditProtectionOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAuditProtectionOpen(false);
                      window.location.href = "/booking";
                    }}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Get Protected Now
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
