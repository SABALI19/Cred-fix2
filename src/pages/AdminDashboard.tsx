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
  Settings,
  Shield,
  Activity,
  UserCheck,
  Building,
  BarChart3,
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
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();

  // System overview data
  const systemOverviewData = [
    { name: "Active Users", value: 2847, color: "#3b82f6" },
    { name: "Active Agents", value: 89, color: "#22c55e" },
    { name: "Pending Cases", value: 156, color: "#f59e0b" },
  ];

  // Revenue trends
  const revenueData = [
    { month: "Jan", revenue: 45000, users: 2200 },
    { month: "Feb", revenue: 52000, users: 2350 },
    { month: "Mar", revenue: 58000, users: 2500 },
    { month: "Apr", revenue: 65000, users: 2650 },
    { month: "May", revenue: 72000, users: 2780 },
    { month: "Jun", revenue: 78000, users: 2850 },
  ];

  // Agent performance data
  const topAgents = [
    {
      id: 1,
      name: "Jessica Parker",
      email: "j.parker@creditfix.com",
      clients: 78,
      avgImprovement: 124,
      successRate: 94,
      revenue: 15640,
      status: "top-performer",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      email: "m.rodriguez@creditfix.com",
      clients: 65,
      avgImprovement: 118,
      successRate: 91,
      revenue: 13200,
      status: "excellent",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Sarah Chen",
      email: "s.chen@creditfix.com",
      clients: 72,
      avgImprovement: 115,
      successRate: 89,
      revenue: 14100,
      status: "excellent",
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "d.wilson@creditfix.com",
      clients: 45,
      avgImprovement: 98,
      successRate: 85,
      revenue: 9800,
      status: "good",
      avatar: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Emily Davis",
      email: "e.davis@creditfix.com",
      clients: 38,
      avgImprovement: 87,
      successRate: 82,
      revenue: 8200,
      status: "needs-training",
      avatar: "/placeholder.svg",
    },
  ];

  // System alerts
  const systemAlerts = [
    {
      type: "warning",
      message: "High dispute volume detected - consider adding more agents",
      timestamp: "2 hours ago",
      severity: "medium",
    },
    {
      type: "success",
      message: "Monthly revenue target exceeded by 15%",
      timestamp: "4 hours ago",
      severity: "low",
    },
    {
      type: "info",
      message: "New compliance updates available for review",
      timestamp: "1 day ago",
      severity: "low",
    },
    {
      type: "error",
      message: "Payment processing issues reported by 3 users",
      timestamp: "2 days ago",
      severity: "high",
    },
  ];

  // User satisfaction data
  const satisfactionData = [
    { name: "Excellent", value: 68, color: "#22c55e" },
    { name: "Good", value: 24, color: "#3b82f6" },
    { name: "Fair", value: 6, color: "#f59e0b" },
    { name: "Poor", value: 2, color: "#ef4444" },
  ];

  const getAgentStatusBadge = (status: string) => {
    switch (status) {
      case "top-performer":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Star className="w-3 h-3 mr-1" />
            Top Performer
          </Badge>
        );
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
      case "needs-training":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Needs Training
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "info":
        return <Activity className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Low
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
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
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Admin Dashboard - {user?.name || "Administrator"}
              </h1>
              <p className="text-muted-foreground">
                System overview and management console
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Link to="/admin-management">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Management Panel
                </Button>
              </Link>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>

          {/* System Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +127 this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Agents
                </CardTitle>
                <UserCheck className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5 this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$778,240</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18% vs last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Health
                </CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">99.8%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  All systems operational
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* System Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  System Overview
                </CardTitle>
                <CardDescription>
                  Active users and agents breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={systemOverviewData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {systemOverviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2">
                    <div className="text-2xl font-bold text-primary">3,092</div>
                    <div className="text-sm text-muted-foreground">
                      Total Active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  User Satisfaction
                </CardTitle>
                <CardDescription>Customer satisfaction ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={satisfactionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {satisfactionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2">
                    <div className="text-2xl font-bold text-yellow-500">
                      4.6/5
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Rating
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>
                  Monthly revenue and user growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
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
                        dataKey="revenue"
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

          {/* Top Performing Agents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
              <CardDescription>
                Agent performance metrics and rankings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead>Avg Improvement</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={agent.avatar} />
                              <AvatarFallback>
                                {agent.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {agent.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{agent.clients}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-600">
                              +{agent.avgImprovement}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {agent.successRate}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            ${agent.revenue.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getAgentStatusBadge(agent.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <BarChart3 className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="w-3 h-3 mr-1" />
                              Manage
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

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Notifications</CardTitle>
              <CardDescription>
                Important system updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-tight">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {alert.timestamp}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(alert.severity)}
                          <Button size="sm" variant="outline">
                            Resolve
                          </Button>
                        </div>
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

export default AdminDashboard;
