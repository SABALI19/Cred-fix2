import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Target,
  Calendar,
  Download,
  Phone,
  Mail,
  Star,
  Award,
  DollarSign,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

const AgentDashboard = () => {
  const { user } = useAuth();

  // Agent performance data
  const agentPerformanceData = [
    { name: "Clients Helped", value: 47, color: "#22c55e" },
    { name: "In Progress", value: 23, color: "#3b82f6" },
    { name: "New Clients", value: 8, color: "#f59e0b" },
  ];

  // Monthly client acquisition
  const monthlyAcquisition = [
    { month: "Jan", clients: 8 },
    { month: "Feb", clients: 12 },
    { month: "Mar", clients: 15 },
    { month: "Apr", clients: 18 },
    { month: "May", clients: 22 },
    { month: "Jun", clients: 25 },
  ];

  // Client portfolio overview
  const clientPortfolio = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      currentScore: 720,
      startingScore: 580,
      improvement: 140,
      status: "excellent",
      lastContact: "2 days ago",
      nextAction: "Monthly review",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      currentScore: 680,
      startingScore: 620,
      improvement: 60,
      status: "good",
      lastContact: "1 week ago",
      nextAction: "Follow up dispute",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      email: "lisa.r@email.com",
      currentScore: 650,
      startingScore: 550,
      improvement: 100,
      status: "improving",
      lastContact: "3 days ago",
      nextAction: "Schedule call",
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "d.wilson@email.com",
      currentScore: 590,
      startingScore: 540,
      improvement: 50,
      status: "needs-attention",
      lastContact: "1 day ago",
      nextAction: "Review strategy",
      avatar: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Emily Davis",
      email: "emily.d@email.com",
      currentScore: 710,
      startingScore: 630,
      improvement: 80,
      status: "good",
      lastContact: "5 days ago",
      nextAction: "Progress update",
      avatar: "/placeholder.svg",
    },
  ];

  // Recent activities across all clients
  const recentActivities = [
    {
      clientName: "Sarah Johnson",
      action: "Credit score increased by 15 points",
      timestamp: "2 hours ago",
      type: "success",
      icon: TrendingUp,
    },
    {
      clientName: "Michael Chen",
      action: "Dispute resolution completed",
      timestamp: "4 hours ago",
      type: "success",
      icon: CheckCircle2,
    },
    {
      clientName: "Lisa Rodriguez",
      action: "New dispute filed",
      timestamp: "1 day ago",
      type: "progress",
      icon: FileText,
    },
    {
      clientName: "David Wilson",
      action: "Requires follow-up call",
      timestamp: "1 day ago",
      type: "attention",
      icon: AlertCircle,
    },
    {
      clientName: "Emily Davis",
      action: "Collection account removed",
      timestamp: "2 days ago",
      type: "success",
      icon: CheckCircle2,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Excellent
          </Badge>
        );
      case "good":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Good
          </Badge>
        );
      case "improving":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Improving
          </Badge>
        );
      case "needs-attention":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Needs Attention
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "attention":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["agent", "admin"]}>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Agent Dashboard - {user?.name || "Agent"}
              </h1>
              <p className="text-muted-foreground">
                Manage your client portfolio and track performance
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Training
              </Button>
            </div>
          </div>

          {/* Agent Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8 this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Score Improvement
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">+124</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Above target
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <Award className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">94%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Top performer
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$15,640</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Client Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Client Status Distribution
                </CardTitle>
                <CardDescription>
                  Overview of your client portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={agentPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {agentPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2">
                    <div className="text-2xl font-bold text-primary">78</div>
                    <div className="text-sm text-muted-foreground">
                      Total Clients
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Client Acquisition */}
            <Card>
              <CardHeader>
                <CardTitle>Client Acquisition Trend</CardTitle>
                <CardDescription>
                  New clients acquired each month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyAcquisition}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="clients"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="hsl(var(--primary))"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Client Portfolio Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Client Portfolio</CardTitle>
              <CardDescription>
                Detailed overview of all your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Current Score</TableHead>
                      <TableHead>Improvement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Next Action</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientPortfolio.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={client.avatar} />
                              <AvatarFallback>
                                {client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {client.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-lg">
                              {client.currentScore}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              from {client.startingScore}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-600">
                              +{client.improvement}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell className="text-sm">
                          {client.lastContact}
                        </TableCell>
                        <TableCell className="text-sm">
                          {client.nextAction}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-3 h-3 mr-1" />
                              Email
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Client Activities</CardTitle>
              <CardDescription>
                Latest updates across your client portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-medium leading-tight">
                            {activity.clientName}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.action}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AgentDashboard;
