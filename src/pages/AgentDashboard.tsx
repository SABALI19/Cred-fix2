import { useCallback, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AgentClientInbox from "@/components/chat/AgentClientInbox";
import { useAuth } from "@/contexts/AuthContext";
import { agentService, type AgentDashboardData } from "@/services/agentService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  MessageSquare,
  RefreshCw,
  Users,
} from "lucide-react";

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

const formatServiceLabel = (value?: string | null) =>
  value ? value.replaceAll("_", " ") : "Not selected";

const formatConsultationType = (value?: string | null) =>
  value ? value.replaceAll("_", " ") : "Not set";

const formatCurrency = (value?: number | null) =>
  value === null || value === undefined
    ? "N/A"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);

const AgentDashboard = () => {
  const { user } = useAuth();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [dashboard, setDashboard] = useState<AgentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await agentService.getDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <ProtectedRoute allowedRoles={["agent", "admin"]}>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Agent Dashboard - {user?.name || "Agent"}</h1>
              <p className="text-muted-foreground">
                Track assigned clients, their active plans, and scheduled appointments.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={loadDashboard} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant={isChatVisible ? "default" : "outline"}
                size="sm"
                onClick={() => setIsChatVisible((prev) => !prev)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {isChatVisible ? "Hide Chat" : "Open Chat"}
              </Button>
            </div>
          </div>

          {error ? (
            <Card className="border-red-200">
              <CardContent className="pt-6 text-sm text-red-600">{error}</CardContent>
            </Card>
          ) : null}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assigned Clients</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard?.summary.totalClients || 0}</div>
                <p className="text-xs text-muted-foreground">Clients currently assigned to you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <CreditCard className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.summary.clientsWithActivePlans || 0}
                </div>
                <p className="text-xs text-muted-foreground">Assigned clients with a saved plan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.summary.scheduledAppointments || 0}
                </div>
                <p className="text-xs text-muted-foreground">Saved appointment records for clients</p>
              </CardContent>
            </Card>
          </div>

          {isChatVisible ? <AgentClientInbox /> : null}

          <Card>
            <CardHeader>
              <CardTitle>Client Plans</CardTitle>
              <CardDescription>
                Current plans, latest scores, and saved appointment details for your clients.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Active Plan</TableHead>
                    <TableHead>Latest Score</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(dashboard?.clients || []).map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-xs text-muted-foreground">{client.email}</div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {formatServiceLabel(client.selectedService)}
                      </TableCell>
                      <TableCell>
                        {client.activePlan.name ? (
                          <div>
                            <div className="font-medium">{client.activePlan.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(client.activePlan.price)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No active plan</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.latestScore ? (
                          <div>
                            <div className="font-medium">{client.latestScore.score}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {client.latestScore.bureau}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No score yet</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.latestAppointment?.schedule.date ? (
                          <div>
                            <div className="font-medium">
                              {formatDate(client.latestAppointment.schedule.date)} at{" "}
                              {client.latestAppointment.schedule.time || "TBD"}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {formatConsultationType(
                                client.latestAppointment.schedule.consultationType,
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No appointment</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={client.status === "active" ? "secondary" : "destructive"}
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && (dashboard?.clients || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                        No assigned clients found yet.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Appointments</CardTitle>
              <CardDescription>
                Appointments saved through the consultation booking flow.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Booked With</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(dashboard?.appointments || []).map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium">{appointment.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {appointment.user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{appointment.plan.name || "No plan"}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(appointment.plan.price)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {appointment.schedule.date
                            ? `${formatDate(appointment.schedule.date)} at ${
                                appointment.schedule.time || "TBD"
                              }`
                            : "Not scheduled"}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {formatConsultationType(appointment.schedule.consultationType)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {appointment.agent.name || user?.name || "Unassigned"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {appointment.agent.title || "Agent"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={appointment.status === "closed" ? "outline" : "secondary"}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && (dashboard?.appointments || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                        No appointment records yet.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {isLoading ? (
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                Loading dashboard data...
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && dashboard?.clients?.length ? (
            <Card className="border-green-200 bg-green-50/60">
              <CardContent className="pt-6 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-green-900">
                  Client plans and appointment details are now coming from the live backend,
                  including each client&apos;s saved active plan.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AgentDashboard;
