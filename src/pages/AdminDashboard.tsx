import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Users,
  AlertCircle,
  CheckCircle2,
  Download,
  Settings,
  Shield,
  Activity,
  UserCheck,
  BarChart3,
  RefreshCw,
  FileText,
  Clock3,
} from "lucide-react";
import type { PieLabelRenderProps } from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { Link } from "react-router-dom";
import { adminService, type AdminDashboardData } from "@/services/adminService";

const OVERVIEW_COLORS = ["#3b82f6", "#22c55e", "#f59e0b"];
const CASE_COLORS = ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps): JSX.Element | null => {
  if (
    typeof cx !== "number" ||
    typeof cy !== "number" ||
    typeof midAngle !== "number" ||
    typeof innerRadius !== "number" ||
    typeof outerRadius !== "number" ||
    typeof percent !== "number" ||
    percent < 0.05
  ) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

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

const formatNumber = (value: number) => value.toLocaleString();

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getRoleBadge = (role: "user" | "agent" | "admin") => {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Admin
        </Badge>
      );
    case "agent":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Agent
        </Badge>
      );
    default:
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          User
        </Badge>
      );
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getDashboard();
      setDashboard(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const systemOverviewData = useMemo(
    () =>
      (dashboard?.systemOverview || []).map((item, index) => ({
        ...item,
        color: OVERVIEW_COLORS[index % OVERVIEW_COLORS.length],
      })),
    [dashboard?.systemOverview],
  );

  const caseBreakdownData = useMemo(
    () =>
      (dashboard?.caseBreakdown || []).map((item, index) => ({
        ...item,
        color: CASE_COLORS[index % CASE_COLORS.length],
      })),
    [dashboard?.caseBreakdown],
  );

  const totalActive = useMemo(
    () => systemOverviewData.reduce((sum, item) => sum + item.value, 0),
    [systemOverviewData],
  );

  const totalDisputes = useMemo(
    () => caseBreakdownData.reduce((sum, item) => sum + item.value, 0),
    [caseBreakdownData],
  );

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Admin Dashboard - {user?.name || "Administrator"}
              </h1>
              <p className="text-muted-foreground">
                Live platform metrics and operations monitoring
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={loadDashboard} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
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
            </div>
          </div>

          {error && (
            <Card className="mb-8 border-red-200">
              <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-sm text-red-600">
                  Could not load dashboard data: {error}
                </p>
                <Button size="sm" variant="outline" onClick={loadDashboard} disabled={isLoading}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {isLoading && !dashboard ? (
            <Card className="mb-8">
              <CardContent className="pt-6 text-sm text-muted-foreground">
                Loading dashboard data...
              </CardContent>
            </Card>
          ) : null}

          {/* System Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(dashboard?.summary.totalUsers || 0)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />+
                  {formatNumber(dashboard?.summary.newUsersThisMonth || 0)} this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <UserCheck className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(dashboard?.summary.activeAgents || 0)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Activity className="h-3 w-3 mr-1" />
                  Available across the platform
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
                <FileText className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(dashboard?.summary.pendingCases || 0)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock3 className="h-3 w-3 mr-1" />
                  {formatNumber(dashboard?.summary.openSupportTickets || 0)} support tickets in
                  progress
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {(dashboard?.summary.systemHealth || 0).toFixed(1)}%
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Based on case resolution rate
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  System Overview
                </CardTitle>
                <CardDescription>Active users, agents, and open case volume</CardDescription>
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
                        dataKey="value"
                      >
                        {systemOverviewData.map((entry, index) => (
                          <Cell key={`system-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2">
                    <div className="text-2xl font-bold text-primary">
                      {formatNumber(totalActive)}
                    </div>
                    <div className="text-sm text-muted-foreground">Tracked Entities</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Dispute Status
                </CardTitle>
                <CardDescription>Current case outcomes across all disputes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={caseBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        {caseBreakdownData.map((entry, index) => (
                          <Cell key={`case-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2">
                    <div className="text-2xl font-bold text-yellow-500">
                      {formatNumber(totalDisputes)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Disputes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>Monthly users and dispute volume trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboard?.monthlyTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
                        dataKey="users"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="hsl(var(--primary))"
                        fillOpacity={0.15}
                        name="Users"
                      />
                      <Area
                        type="monotone"
                        dataKey="disputes"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fill="#f59e0b"
                        fillOpacity={0.12}
                        name="Disputes"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Users */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Platform Users</CardTitle>
              <CardDescription>Latest registrations and dispute activity snapshot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Disputes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(dashboard?.recentUsers || []).map((recentUser) => (
                      <TableRow key={recentUser.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {recentUser.name
                                  .split(" ")
                                  .map((namePart) => namePart[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{recentUser.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {recentUser.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(recentUser.role)}</TableCell>
                        <TableCell className="text-sm">{formatDate(recentUser.joinedAt)}</TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatNumber(recentUser.disputeCount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link to="/admin-management">
                            <Button size="sm" variant="outline">
                              <Settings className="w-3 h-3 mr-1" />
                              Manage
                            </Button>
                          </Link>
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
              <CardDescription>Important operational updates from live system data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(dashboard?.systemAlerts || []).map((alert, index) => (
                  <div
                    key={`${alert.message}-${index}`}
                    className="flex items-start gap-3 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-tight">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-2">{getSeverityBadge(alert.severity)}</div>
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
