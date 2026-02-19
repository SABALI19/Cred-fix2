import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Users,
  Settings,
  DollarSign,
  FileText,
  Shield,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MessageCircle,
  Activity,
  Bell,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  Ban,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Database,
  Lock,
  Unlock,
  RefreshCw,
} from "lucide-react";

const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data for demonstration
  const users = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      status: "active",
      plan: "Professional",
      joinDate: "2024-01-15",
      creditScore: 720,
      lastActivity: "2 hours ago",
      totalSpent: "$298",
      disputes: 5,
      avatar: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      status: "suspended",
      plan: "Premium",
      joinDate: "2023-12-08",
      creditScore: 680,
      lastActivity: "1 day ago",
      totalSpent: "$597",
      disputes: 12,
      avatar: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "m.wilson@email.com",
      status: "active",
      plan: "Basic",
      joinDate: "2024-02-01",
      creditScore: 590,
      lastActivity: "5 minutes ago",
      totalSpent: "$89",
      disputes: 2,
      avatar: "/placeholder.svg",
    },
  ];

  const agents = [
    {
      id: "1",
      name: "Sarah Mitchell",
      email: "sarah.mitchell@creditfixpro.com",
      role: "Senior Credit Specialist",
      status: "online",
      clientsAssigned: 78,
      successRate: 96,
      workload: "high",
      lastLogin: "5 minutes ago",
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      email: "michael.rodriguez@creditfixpro.com",
      role: "Tax Expert",
      status: "offline",
      clientsAssigned: 45,
      successRate: 94,
      workload: "medium",
      lastLogin: "2 hours ago",
    },
  ];

  const systemLogs = [
    {
      id: "1",
      timestamp: "2024-01-20 14:30:00",
      level: "info",
      action: "User Login",
      user: "john.smith@email.com",
      details: "Successful login from IP 192.168.1.1",
    },
    {
      id: "2",
      timestamp: "2024-01-20 14:25:00",
      level: "warning",
      action: "Failed Payment",
      user: "sarah.j@email.com",
      details: "Credit card payment failed - insufficient funds",
    },
    {
      id: "3",
      timestamp: "2024-01-20 14:20:00",
      level: "error",
      action: "System Error",
      user: "system",
      details: "Credit bureau API timeout - retrying",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 hover:bg-green-100",
      suspended: "bg-red-100 text-red-800 hover:bg-red-100",
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      online: "bg-green-100 text-green-800 hover:bg-green-100",
      offline: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getLogLevelBadge = (level: string) => {
    const variants = {
      info: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      error: "bg-red-100 text-red-800 hover:bg-red-100",
    };

    return (
      <Badge className={variants[level as keyof typeof variants] || ""}>
        {level.toUpperCase()}
      </Badge>
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
              <h1 className="text-3xl font-bold mb-2">Admin Management</h1>
              <p className="text-muted-foreground">
                Comprehensive platform administration and control
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Agents
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">7 online now</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$778,240</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Health
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">99.8%</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            {/* Users Management */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Credit Score</TableHead>
                        <TableHead>Disputes</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.plan}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {user.creditScore}
                            </span>
                          </TableCell>
                          <TableCell>{user.disputes}</TableCell>
                          <TableCell>{user.totalSpent}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                {user.status === "active" ? (
                                  <>
                                    <Ban className="w-3 h-3 mr-1" />
                                    Suspend
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Activate
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Agents Management */}
            <TabsContent value="agents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Agent Management
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Manage agent assignments and performance
                    </p>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Agent
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Clients</TableHead>
                        <TableHead>Success Rate</TableHead>
                        <TableHead>Workload</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agents.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {agent.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{agent.role}</TableCell>
                          <TableCell>{getStatusBadge(agent.status)}</TableCell>
                          <TableCell>{agent.clientsAssigned}</TableCell>
                          <TableCell>{agent.successRate}%</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                agent.workload === "high"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : agent.workload === "medium"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : "bg-green-100 text-green-800 hover:bg-green-100"
                              }
                            >
                              {agent.workload}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <BarChart3 className="w-3 h-3 mr-1" />
                                Stats
                              </Button>
                              <Button size="sm" variant="outline">
                                <Users className="w-3 h-3 mr-1" />
                                Assign
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Message
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Management */}
            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Credit Repair Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Cases</span>
                      <Badge>1,247</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Disputes</span>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        156
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Success Rate</span>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        94%
                      </Badge>
                    </div>
                    <Button className="w-full" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Disputes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Tax Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Returns Filed</span>
                      <Badge>2,891</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Reviews</span>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        89
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Refund</span>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        $2,400
                      </Badge>
                    </div>
                    <Button className="w-full" variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Review Returns
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Finance Management */}
            <TabsContent value="finance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Revenue Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Monthly Revenue</span>
                      <span className="font-bold text-green-600">$778,240</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Payments</span>
                      <span className="font-bold text-yellow-600">$12,450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Failed Payments</span>
                      <span className="font-bold text-red-600">$3,210</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Processing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Process Refunds
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Transactions
                    </Button>
                    <Button className="w-full" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry Failed Payments
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Basic Plans</span>
                      <Badge>890</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Professional Plans</span>
                      <Badge>1,240</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Premium Plans</span>
                      <Badge>345</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Management */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Website Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Homepage
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Agents Profiles
                    </Button>
                    <Button className="w-full" variant="outline">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Update Pricing
                    </Button>
                    <Button className="w-full" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Terms & Conditions
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Communications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Templates
                    </Button>
                    <Button className="w-full" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chatbot Responses
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Management */}
            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      System Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {systemLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 p-3 border border-border/50 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            {getLogLevelBadge(log.level)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">
                                {log.action}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {log.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.details}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      System Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenance">Maintenance Mode</Label>
                      <Switch id="maintenance" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="registrations">New Registrations</Label>
                      <Switch id="registrations" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="chatbot">Chatbot</Label>
                      <Switch id="chatbot" defaultChecked />
                    </div>
                    <Button className="w-full" variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export System Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminManagement;
