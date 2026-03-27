import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  adminService,
  type ConsultationRecord,
  type ContactMessageRecord,
  type ManagedUser,
  type ManagedUserPatch,
  type PlatformControls,
  type SupportTicketRecord,
} from "@/services/adminService";
import type { CreditAccount, CreditScore } from "@/services/creditService";
import type { Dispute } from "@/services/disputeService";

const ROLE_OPTIONS = ["user", "agent", "admin"] as const;
const STATUS_OPTIONS = ["active", "suspended"] as const;
const SERVICE_OPTIONS = ["credit_repair", "tax_services", "comprehensive"] as const;
const ACCOUNT_TYPES = ["credit_card", "auto_loan", "mortgage", "personal_loan", "student_loan", "other"] as const;
const ACCOUNT_STATUSES = ["open", "closed", "dispute"] as const;
const BUREAUS = ["experian", "equifax", "transunion"] as const;
const DISPUTE_BUREAUS = ["experian", "equifax", "transunion", "all"] as const;
const DISPUTE_STATUSES = ["pending", "investigating", "resolved", "rejected"] as const;
const DISPUTE_PRIORITIES = ["low", "medium", "high"] as const;
const SUPPORT_STATUSES = ["open", "in-progress", "waiting", "resolved", "closed"] as const;
const SUPPORT_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
const CONTACT_STATUSES = ["new", "in-review", "resolved", "closed"] as const;
const CONSULTATION_STATUSES = ["new", "contacted", "booked", "closed"] as const;

type UserDetail = Awaited<ReturnType<typeof adminService.getUserDetail>>;

type AccountForm = {
  id: string | null;
  accountName: string;
  accountType: CreditAccount["accountType"];
  creditorName: string;
  balance: string;
  creditLimit: string;
  paymentHistory: string;
  lastPaymentDate: string;
  accountStatus: CreditAccount["accountStatus"];
};

type ScoreForm = {
  id: string | null;
  bureau: CreditScore["bureau"];
  score: string;
  utilizationRate: string;
  paymentHistoryScore: string;
  creditAge: string;
  scoreFactors: string;
};

type DisputeForm = {
  id: string | null;
  accountId: string;
  disputeReason: string;
  bureau: Dispute["bureau"];
  status: Dispute["status"];
  priority: Dispute["priority"];
  resolutionNotes: string;
};

const emptyAccountForm = (): AccountForm => ({ id: null, accountName: "", accountType: "credit_card", creditorName: "", balance: "0", creditLimit: "", paymentHistory: "", lastPaymentDate: "", accountStatus: "open" });
const emptyScoreForm = (): ScoreForm => ({ id: null, bureau: "experian", score: "", utilizationRate: "", paymentHistoryScore: "", creditAge: "", scoreFactors: "" });
const emptyDisputeForm = (): DisputeForm => ({ id: null, accountId: "", disputeReason: "", bureau: "experian", status: "pending", priority: "medium", resolutionNotes: "" });
const formatDate = (value?: string | null) => value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";
const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
const formatServiceLabel = (value?: string | null) => (value ? value.replaceAll("_", " ") : "None");
const scoreBadge = (score?: number) => !score ? <Badge variant="secondary">No score</Badge> : score >= 740 ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{score}</Badge> : score >= 670 ? <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{score}</Badge> : score >= 580 ? <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{score}</Badge> : <Badge variant="destructive">{score}</Badge>;

const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [agents, setAgents] = useState<Awaited<ReturnType<typeof adminService.getAgents>>>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserDetail | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [userForm, setUserForm] = useState<ManagedUserPatch>({});
  const [accountForm, setAccountForm] = useState<AccountForm>(emptyAccountForm);
  const [scoreForm, setScoreForm] = useState<ScoreForm>(emptyScoreForm);
  const [disputeForm, setDisputeForm] = useState<DisputeForm>(emptyDisputeForm);
  const [supportTickets, setSupportTickets] = useState<SupportTicketRecord[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessageRecord[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [supportDrafts, setSupportDrafts] = useState<Record<string, { status: string; priority: string }>>({});
  const [contactDrafts, setContactDrafts] = useState<Record<string, string>>({});
  const [consultationDrafts, setConsultationDrafts] = useState<Record<string, string>>({});
  const [platformControls, setPlatformControls] = useState<PlatformControls | null>(null);
  const [agentForm, setAgentForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const selectedUser = selectedUserDetail?.user || null;
  const primaryScore = useMemo(() => selectedUser?.latestScoresByBureau?.[0]?.score, [selectedUser?.latestScoresByBureau]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({
        search: userSearch || undefined,
        role: userRoleFilter === "all" ? undefined : userRoleFilter,
        status: userStatusFilter === "all" ? undefined : userStatusFilter,
      });
      setUsers(response.users);
      if (!selectedUserId && response.users[0]?._id) setSelectedUserId(response.users[0]._id);
      if (selectedUserId && !response.users.some((user) => user._id === selectedUserId)) setSelectedUserId(response.users[0]?._id || "");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [selectedUserId, userRoleFilter, userSearch, userStatusFilter]);

  const loadUserDetail = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const detail = await adminService.getUserDetail(userId);
      setSelectedUserDetail(detail);
      setUserForm({ name: detail.user.name, email: detail.user.email, role: detail.user.role, status: detail.user.status, selectedService: detail.user.selectedService ?? null, phone: detail.user.phone || "", profilePhoto: detail.user.profilePhoto || "", bio: detail.user.bio || "", assignedAgentId: detail.user.assignedAgentId ?? null, address: detail.user.address || {} });
      setAccountForm(emptyAccountForm());
      setScoreForm(emptyScoreForm());
      setDisputeForm(emptyDisputeForm());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load user detail");
    }
  }, []);

  const loadOperations = useCallback(async () => {
    try {
      const [supportResponse, contactResponse, consultationResponse] = await Promise.all([
        adminService.listSupportTickets(),
        adminService.listContactMessages(),
        adminService.listConsultations(),
      ]);
      setSupportTickets(supportResponse.tickets);
      setContactMessages(contactResponse.messages);
      setConsultations(consultationResponse.consultations);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load operations data");
    }
  }, []);

  const loadPlatformData = useCallback(async () => {
    try {
      const [agentsResponse, controlsResponse] = await Promise.all([
        adminService.getAgents(),
        adminService.getPlatformControls(),
      ]);
      setAgents(agentsResponse);
      setPlatformControls(controlsResponse);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load platform data");
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadPlatformData();
  }, [loadPlatformData, loadUsers]);

  useEffect(() => {
    if (selectedUserId) loadUserDetail(selectedUserId);
  }, [loadUserDetail, selectedUserId]);

  useEffect(() => {
    if (activeTab === "operations" && supportTickets.length === 0) loadOperations();
  }, [activeTab, loadOperations, supportTickets.length]);

  const refreshSelectedUser = async () => {
    if (!selectedUserId) return;
    await Promise.all([loadUsers(), loadUserDetail(selectedUserId)]);
  };

  const saveUser = async () => {
    if (!selectedUserId) return;
    try {
      await adminService.updateUser(selectedUserId, userForm);
      toast.success("User updated");
      await refreshSelectedUser();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    }
  };

  const deleteAccount = async (accountId: string) => {
    await adminService.deleteCreditAccount(selectedUserId, accountId);
    toast.success("Credit account deleted");
    await refreshSelectedUser();
  };

  const deleteScore = async (scoreId: string) => {
    await adminService.deleteCreditScore(selectedUserId, scoreId);
    toast.success("Credit score deleted");
    await refreshSelectedUser();
  };

  const deleteDispute = async (disputeId: string) => {
    await adminService.deleteDispute(selectedUserId, disputeId);
    toast.success("Dispute deleted");
    await refreshSelectedUser();
  };

  const updateSupportRow = async (ticketId: string) => {
    const draft = supportDrafts[ticketId];
    if (!draft) return;
    await adminService.updateSupportTicket(ticketId, draft);
    toast.success("Support ticket updated");
    await loadOperations();
  };

  const saveAccount = async () => {
    if (!selectedUserId) return;
    const payload = {
      accountName: accountForm.accountName,
      accountType: accountForm.accountType,
      creditorName: accountForm.creditorName,
      balance: Number(accountForm.balance || 0),
      creditLimit: accountForm.creditLimit ? Number(accountForm.creditLimit) : null,
      paymentHistory: accountForm.paymentHistory,
      lastPaymentDate: accountForm.lastPaymentDate || null,
      accountStatus: accountForm.accountStatus,
      bureauExperian: true,
      bureauEquifax: true,
      bureauTransunion: true,
    };
    if (accountForm.id) {
      await adminService.updateCreditAccount(selectedUserId, accountForm.id, payload);
      toast.success("Credit account updated");
    } else {
      await adminService.createCreditAccount(selectedUserId, payload);
      toast.success("Credit account created");
    }
    setAccountForm(emptyAccountForm());
    await refreshSelectedUser();
  };

  const saveScore = async () => {
    if (!selectedUserId) return;
    const payload = {
      bureau: scoreForm.bureau,
      score: Number(scoreForm.score),
      utilizationRate: scoreForm.utilizationRate ? Number(scoreForm.utilizationRate) : null,
      paymentHistoryScore: scoreForm.paymentHistoryScore ? Number(scoreForm.paymentHistoryScore) : null,
      creditAge: scoreForm.creditAge ? Number(scoreForm.creditAge) : null,
      scoreFactors: scoreForm.scoreFactors ? JSON.parse(scoreForm.scoreFactors) : null,
    };
    if (scoreForm.id) {
      await adminService.updateCreditScore(selectedUserId, scoreForm.id, payload);
      toast.success("Credit score updated");
    } else {
      await adminService.createCreditScore(selectedUserId, payload);
      toast.success("Credit score created");
    }
    setScoreForm(emptyScoreForm());
    await refreshSelectedUser();
  };

  const saveDispute = async () => {
    if (!selectedUserId) return;
    const payload = {
      accountId: disputeForm.accountId || null,
      disputeReason: disputeForm.disputeReason,
      bureau: disputeForm.bureau,
      status: disputeForm.status,
      priority: disputeForm.priority,
      resolutionNotes: disputeForm.resolutionNotes,
      documents: [],
    };
    if (disputeForm.id) {
      await adminService.updateDispute(selectedUserId, disputeForm.id, payload);
      toast.success("Dispute updated");
    } else {
      await adminService.createDispute(selectedUserId, payload);
      toast.success("Dispute created");
    }
    setDisputeForm(emptyDisputeForm());
    await refreshSelectedUser();
  };

  const savePlatformControls = async () => {
    if (!platformControls) return;
    const updated = await adminService.updatePlatformControls(platformControls);
    setPlatformControls(updated);
    toast.success("Platform controls updated");
  };

  const createAgent = async () => {
    await adminService.createAgent(agentForm);
    setAgentForm({ name: "", email: "", password: "", phone: "" });
    toast.success("Agent created");
    await loadPlatformData();
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Management</h1>
              <p className="text-muted-foreground">
                Live admin controls for users, casework, inbound requests, and platform settings.
              </p>
            </div>
            <Button variant="outline" onClick={() => Promise.all([loadUsers(), loadOperations(), loadPlatformData()])}>
              Refresh Data
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="platform">Platform</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader className="gap-4">
                  <CardTitle>User Directory</CardTitle>
                  <div className="grid gap-3 md:grid-cols-4">
                    <Input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search name or email" />
                    <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                      <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        {ROLE_OPTIONS.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                      <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {STATUS_OPTIONS.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button onClick={loadUsers} disabled={loading}>{loading ? "Loading..." : "Apply Filters"}</Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Disputes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id} className={selectedUserId === user._id ? "bg-muted/50" : ""} onClick={() => setSelectedUserId(user._id)}>
                          <TableCell><div className="font-medium">{user.name}</div><div className="text-xs text-muted-foreground">{user.email}</div></TableCell>
                          <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                          <TableCell><Badge variant={user.status === "active" ? "secondary" : "destructive"}>{user.status}</Badge></TableCell>
                          <TableCell>{formatServiceLabel(user.selectedService)}</TableCell>
                          <TableCell>{scoreBadge(user.latestScoresByBureau?.[0]?.score)}</TableCell>
                          <TableCell>{user.disputeCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              {selectedUser ? (
                <div className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
                  <Card>
                    <CardHeader><CardTitle>User Profile</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Name</Label><Input value={userForm.name || ""} onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))} /></div>
                        <div><Label>Email</Label><Input value={userForm.email || ""} onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))} /></div>
                        <div><Label>Role</Label><Select value={userForm.role || "user"} onValueChange={(value) => setUserForm((prev) => ({ ...prev, role: value as ManagedUser["role"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ROLE_OPTIONS.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent></Select></div>
                        <div><Label>Status</Label><Select value={userForm.status || "active"} onValueChange={(value) => setUserForm((prev) => ({ ...prev, status: value as ManagedUser["status"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STATUS_OPTIONS.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select></div>
                        <div><Label>Phone</Label><Input value={userForm.phone || ""} onChange={(e) => setUserForm((prev) => ({ ...prev, phone: e.target.value }))} /></div>
                        <div><Label>Selected Service</Label><Select value={userForm.selectedService || "none"} onValueChange={(value) => setUserForm((prev) => ({ ...prev, selectedService: value === "none" ? null : (value as ManagedUser["selectedService"]) }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{SERVICE_OPTIONS.map((service) => <SelectItem key={service} value={service}>{service}</SelectItem>)}</SelectContent></Select></div>
                        <div><Label>Assigned Agent</Label><Select value={userForm.assignedAgentId || "none"} onValueChange={(value) => setUserForm((prev) => ({ ...prev, assignedAgentId: value === "none" ? null : value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No assigned agent</SelectItem>{agents.filter((agent) => agent.status === "active").map((agent) => <SelectItem key={agent._id} value={agent._id}>{agent.name}</SelectItem>)}</SelectContent></Select></div>
                        <div><Label>Profile Photo URL</Label><Input value={userForm.profilePhoto || ""} onChange={(e) => setUserForm((prev) => ({ ...prev, profilePhoto: e.target.value }))} /></div>
                      </div>
                      <div><Label>Bio</Label><Textarea value={userForm.bio || ""} onChange={(e) => setUserForm((prev) => ({ ...prev, bio: e.target.value }))} /></div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Street</Label><Input value={userForm.address?.streetAddress || ""} onChange={(e) => setUserForm((prev) => ({ ...prev, address: { ...prev.address, streetAddress: e.target.value } }))} /></div>
                        <div><Label>City</Label><Input value={userForm.address?.city || ""} onChange={(e) => setUserForm((prev) => ({ ...prev, address: { ...prev.address, city: e.target.value } }))} /></div>
                        <div><Label>State</Label><Input value={userForm.address?.state || ""} onChange={(e) => setUserForm((prev) => ({ ...prev, address: { ...prev.address, state: e.target.value } }))} /></div>
                        <div><Label>ZIP Code</Label><Input value={userForm.address?.zipCode || ""} onChange={(e) => setUserForm((prev) => ({ ...prev, address: { ...prev.address, zipCode: e.target.value } }))} /></div>
                      </div>
                      <Button onClick={saveUser}>Save User Changes</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Account Snapshot</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between"><span>User ID</span><span className="font-mono text-xs">{selectedUser._id}</span></div>
                      <div className="flex justify-between"><span>Joined</span><span>{formatDate(selectedUser.createdAt)}</span></div>
                      <div className="flex justify-between"><span>Assigned Agent</span><span>{selectedUser.assignedAgent?.name || "Unassigned"}</span></div>
                      <div className="flex justify-between"><span>Total Accounts</span><span>{selectedUserDetail?.accountSummary.totalAccounts || 0}</span></div>
                      <div className="flex justify-between"><span>Total Balance</span><span>{formatCurrency(selectedUserDetail?.accountSummary.totalBalance || 0)}</span></div>
                      <div className="flex justify-between"><span>Total Limit</span><span>{formatCurrency(selectedUserDetail?.accountSummary.totalLimit || 0)}</span></div>
                      <div className="flex justify-between"><span>Utilization</span><span>{(selectedUserDetail?.accountSummary.utilization || 0).toFixed(1)}%</span></div>
                      <div className="flex justify-between"><span>Primary Score</span><span>{primaryScore ? scoreBadge(primaryScore) : "No score history"}</span></div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}

              {selectedUserDetail ? (
                <Tabs defaultValue="accounts" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="accounts">Credit Accounts</TabsTrigger>
                    <TabsTrigger value="scores">Credit Scores</TabsTrigger>
                    <TabsTrigger value="disputes">Disputes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="accounts" className="space-y-4">
                    <Card><CardHeader><CardTitle>Accounts</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Account</TableHead><TableHead>Creditor</TableHead><TableHead>Balance</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{selectedUserDetail.accounts.map((account) => <TableRow key={account._id}><TableCell>{account.accountName}</TableCell><TableCell>{account.creditorName}</TableCell><TableCell>{formatCurrency(account.balance)}</TableCell><TableCell>{account.accountStatus}</TableCell><TableCell className="space-x-2"><Button size="sm" variant="outline" onClick={() => setAccountForm({ id: account._id, accountName: account.accountName, accountType: account.accountType, creditorName: account.creditorName, balance: String(account.balance), creditLimit: account.creditLimit ? String(account.creditLimit) : "", paymentHistory: account.paymentHistory || "", lastPaymentDate: account.lastPaymentDate ? account.lastPaymentDate.slice(0, 10) : "", accountStatus: account.accountStatus })}>Edit</Button><Button size="sm" variant="destructive" onClick={() => deleteAccount(account._id)}>Delete</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
                    <Card><CardHeader><CardTitle>{accountForm.id ? "Edit Account" : "Add Account"}</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div><Label>Account Name</Label><Input value={accountForm.accountName} onChange={(e) => setAccountForm((prev) => ({ ...prev, accountName: e.target.value }))} /></div><div><Label>Creditor</Label><Input value={accountForm.creditorName} onChange={(e) => setAccountForm((prev) => ({ ...prev, creditorName: e.target.value }))} /></div><div><Label>Type</Label><Select value={accountForm.accountType} onValueChange={(value) => setAccountForm((prev) => ({ ...prev, accountType: value as CreditAccount["accountType"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ACCOUNT_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><div><Label>Status</Label><Select value={accountForm.accountStatus} onValueChange={(value) => setAccountForm((prev) => ({ ...prev, accountStatus: value as CreditAccount["accountStatus"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ACCOUNT_STATUSES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><div><Label>Balance</Label><Input value={accountForm.balance} onChange={(e) => setAccountForm((prev) => ({ ...prev, balance: e.target.value }))} /></div><div><Label>Credit Limit</Label><Input value={accountForm.creditLimit} onChange={(e) => setAccountForm((prev) => ({ ...prev, creditLimit: e.target.value }))} /></div><div><Label>Last Payment Date</Label><Input type="date" value={accountForm.lastPaymentDate} onChange={(e) => setAccountForm((prev) => ({ ...prev, lastPaymentDate: e.target.value }))} /></div><div><Label>Payment History</Label><Input value={accountForm.paymentHistory} onChange={(e) => setAccountForm((prev) => ({ ...prev, paymentHistory: e.target.value }))} /></div><div className="md:col-span-2 flex gap-3"><Button onClick={saveAccount}>{accountForm.id ? "Update Account" : "Create Account"}</Button><Button variant="outline" onClick={() => setAccountForm(emptyAccountForm())}>Reset</Button></div></CardContent></Card>
                  </TabsContent>

                  <TabsContent value="scores" className="space-y-4">
                    <Card><CardHeader><CardTitle>Score History</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Bureau</TableHead><TableHead>Score</TableHead><TableHead>Updated</TableHead><TableHead /></TableRow></TableHeader><TableBody>{selectedUserDetail.scores.map((score) => <TableRow key={score._id}><TableCell>{score.bureau}</TableCell><TableCell>{scoreBadge(score.score)}</TableCell><TableCell>{formatDate(score.createdAt)}</TableCell><TableCell className="space-x-2"><Button size="sm" variant="outline" onClick={() => setScoreForm({ id: score._id, bureau: score.bureau, score: String(score.score), utilizationRate: score.utilizationRate === null ? "" : String(score.utilizationRate), paymentHistoryScore: score.paymentHistoryScore === null ? "" : String(score.paymentHistoryScore), creditAge: score.creditAge === null ? "" : String(score.creditAge), scoreFactors: score.scoreFactors ? JSON.stringify(score.scoreFactors) : "" })}>Edit</Button><Button size="sm" variant="destructive" onClick={() => deleteScore(score._id)}>Delete</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
                    <Card><CardHeader><CardTitle>{scoreForm.id ? "Edit Score" : "Add Score"}</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div><Label>Bureau</Label><Select value={scoreForm.bureau} onValueChange={(value) => setScoreForm((prev) => ({ ...prev, bureau: value as CreditScore["bureau"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{BUREAUS.map((bureau) => <SelectItem key={bureau} value={bureau}>{bureau}</SelectItem>)}</SelectContent></Select></div><div><Label>Score</Label><Input value={scoreForm.score} onChange={(e) => setScoreForm((prev) => ({ ...prev, score: e.target.value }))} /></div><div><Label>Utilization Rate</Label><Input value={scoreForm.utilizationRate} onChange={(e) => setScoreForm((prev) => ({ ...prev, utilizationRate: e.target.value }))} /></div><div><Label>Payment History Score</Label><Input value={scoreForm.paymentHistoryScore} onChange={(e) => setScoreForm((prev) => ({ ...prev, paymentHistoryScore: e.target.value }))} /></div><div><Label>Credit Age</Label><Input value={scoreForm.creditAge} onChange={(e) => setScoreForm((prev) => ({ ...prev, creditAge: e.target.value }))} /></div><div><Label>Score Factors JSON</Label><Input value={scoreForm.scoreFactors} onChange={(e) => setScoreForm((prev) => ({ ...prev, scoreFactors: e.target.value }))} /></div><div className="md:col-span-2 flex gap-3"><Button onClick={saveScore}>{scoreForm.id ? "Update Score" : "Create Score"}</Button><Button variant="outline" onClick={() => setScoreForm(emptyScoreForm())}>Reset</Button></div></CardContent></Card>
                  </TabsContent>

                  <TabsContent value="disputes" className="space-y-4">
                    <Card><CardHeader><CardTitle>Disputes</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Reason</TableHead><TableHead>Bureau</TableHead><TableHead>Status</TableHead><TableHead>Priority</TableHead><TableHead /></TableRow></TableHeader><TableBody>{selectedUserDetail.disputes.map((dispute) => <TableRow key={dispute._id}><TableCell>{dispute.disputeReason}</TableCell><TableCell>{dispute.bureau}</TableCell><TableCell>{dispute.status}</TableCell><TableCell>{dispute.priority}</TableCell><TableCell className="space-x-2"><Button size="sm" variant="outline" onClick={() => setDisputeForm({ id: dispute._id, accountId: dispute.accountId || "", disputeReason: dispute.disputeReason, bureau: dispute.bureau, status: dispute.status, priority: dispute.priority, resolutionNotes: dispute.resolutionNotes || "" })}>Edit</Button><Button size="sm" variant="destructive" onClick={() => deleteDispute(dispute._id)}>Delete</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
                    <Card><CardHeader><CardTitle>{disputeForm.id ? "Edit Dispute" : "Add Dispute"}</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div><Label>Linked Account</Label><Select value={disputeForm.accountId || "none"} onValueChange={(value) => setDisputeForm((prev) => ({ ...prev, accountId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No linked account</SelectItem>{selectedUserDetail.accounts.map((account) => <SelectItem key={account._id} value={account._id}>{account.accountName}</SelectItem>)}</SelectContent></Select></div><div><Label>Bureau</Label><Select value={disputeForm.bureau} onValueChange={(value) => setDisputeForm((prev) => ({ ...prev, bureau: value as Dispute["bureau"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DISPUTE_BUREAUS.map((bureau) => <SelectItem key={bureau} value={bureau}>{bureau}</SelectItem>)}</SelectContent></Select></div><div><Label>Status</Label><Select value={disputeForm.status} onValueChange={(value) => setDisputeForm((prev) => ({ ...prev, status: value as Dispute["status"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DISPUTE_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select></div><div><Label>Priority</Label><Select value={disputeForm.priority} onValueChange={(value) => setDisputeForm((prev) => ({ ...prev, priority: value as Dispute["priority"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DISPUTE_PRIORITIES.map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}</SelectContent></Select></div><div className="md:col-span-2"><Label>Dispute Reason</Label><Textarea value={disputeForm.disputeReason} onChange={(e) => setDisputeForm((prev) => ({ ...prev, disputeReason: e.target.value }))} /></div><div className="md:col-span-2"><Label>Resolution Notes</Label><Textarea value={disputeForm.resolutionNotes} onChange={(e) => setDisputeForm((prev) => ({ ...prev, resolutionNotes: e.target.value }))} /></div><div className="md:col-span-2 flex gap-3"><Button onClick={saveDispute}>{disputeForm.id ? "Update Dispute" : "Create Dispute"}</Button><Button variant="outline" onClick={() => setDisputeForm(emptyDisputeForm())}>Reset</Button></div></CardContent></Card>
                  </TabsContent>
                </Tabs>
              ) : null}
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <Card><CardHeader><CardTitle>Support Tickets</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Requester</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Priority</TableHead><TableHead /></TableRow></TableHeader><TableBody>{supportTickets.map((ticket) => <TableRow key={ticket._id}><TableCell>{ticket.name}<div className="text-xs text-muted-foreground">{ticket.email}</div></TableCell><TableCell>{ticket.subject}</TableCell><TableCell><Select value={supportDrafts[ticket._id]?.status || ticket.status} onValueChange={(value) => setSupportDrafts((prev) => ({ ...prev, [ticket._id]: { status: value, priority: prev[ticket._id]?.priority || ticket.priority } }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SUPPORT_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select></TableCell><TableCell><Select value={supportDrafts[ticket._id]?.priority || ticket.priority} onValueChange={(value) => setSupportDrafts((prev) => ({ ...prev, [ticket._id]: { status: prev[ticket._id]?.status || ticket.status, priority: value } }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SUPPORT_PRIORITIES.map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}</SelectContent></Select></TableCell><TableCell><Button size="sm" onClick={() => updateSupportRow(ticket._id)}>Save</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>

              <Card><CardHeader><CardTitle>Contact Messages</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Sender</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{contactMessages.map((message) => <TableRow key={message._id}><TableCell>{message.firstName} {message.lastName}<div className="text-xs text-muted-foreground">{message.email}</div></TableCell><TableCell>{message.subject || "General inquiry"}</TableCell><TableCell><Select value={contactDrafts[message._id] || message.status} onValueChange={(value) => setContactDrafts((prev) => ({ ...prev, [message._id]: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CONTACT_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select></TableCell><TableCell><Button size="sm" onClick={async () => { await adminService.updateContactMessage(message._id, (contactDrafts[message._id] || message.status) as ContactMessageRecord["status"]); toast.success("Contact message updated"); await loadOperations(); }}>Save</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>

              <Card><CardHeader><CardTitle>Consultation Requests</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Prospect</TableHead><TableHead>Requested</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{consultations.map((item) => <TableRow key={item._id}><TableCell>{item.name}<div className="text-xs text-muted-foreground">{item.email}</div></TableCell><TableCell>{formatDate(item.createdAt)}</TableCell><TableCell><Select value={consultationDrafts[item._id] || item.status} onValueChange={(value) => setConsultationDrafts((prev) => ({ ...prev, [item._id]: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CONSULTATION_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select></TableCell><TableCell><Button size="sm" onClick={async () => { await adminService.updateConsultation(item._id, (consultationDrafts[item._id] || item.status) as ConsultationRecord["status"]); toast.success("Consultation updated"); await loadOperations(); }}>Save</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
            </TabsContent>

            <TabsContent value="platform" className="space-y-6">
              <Card><CardHeader><CardTitle>Create Agent</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div><Label>Name</Label><Input value={agentForm.name} onChange={(e) => setAgentForm((prev) => ({ ...prev, name: e.target.value }))} /></div><div><Label>Email</Label><Input value={agentForm.email} onChange={(e) => setAgentForm((prev) => ({ ...prev, email: e.target.value }))} /></div><div><Label>Password</Label><Input type="password" value={agentForm.password} onChange={(e) => setAgentForm((prev) => ({ ...prev, password: e.target.value }))} /></div><div><Label>Phone</Label><Input value={agentForm.phone} onChange={(e) => setAgentForm((prev) => ({ ...prev, phone: e.target.value }))} /></div><div className="md:col-span-2"><Button onClick={createAgent}>Create Agent</Button></div></CardContent></Card>
              <Card><CardHeader><CardTitle>Agents</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead></TableRow></TableHeader><TableBody>{agents.map((agent) => <TableRow key={agent._id}><TableCell>{agent.name}</TableCell><TableCell>{agent.email}</TableCell><TableCell><Badge variant={agent.status === "active" ? "secondary" : "destructive"}>{agent.status}</Badge></TableCell><TableCell>{formatDate(agent.createdAt)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
              {platformControls ? (
                <Card><CardHeader><CardTitle>Platform Controls</CardTitle></CardHeader><CardContent className="space-y-6"><div className="space-y-3"><h3 className="font-medium">Charts</h3>{Object.entries(platformControls.charts).map(([key, value]) => <div key={key} className="flex items-center justify-between rounded border p-3"><span>{key}</span><Switch checked={value.enabled} onCheckedChange={(checked) => setPlatformControls((prev) => prev ? { ...prev, charts: { ...prev.charts, [key]: { enabled: checked } } } : prev)} /></div>)}</div><div className="space-y-4"><h3 className="font-medium">Service Cards</h3>{Object.entries(platformControls.services).map(([key, value]) => <div key={key} className="space-y-3 rounded border p-4"><div className="flex items-center justify-between"><span className="font-medium">{key}</span><Switch checked={value.enabled} onCheckedChange={(checked) => setPlatformControls((prev) => prev ? { ...prev, services: { ...prev.services, [key]: { ...prev.services[key as keyof PlatformControls["services"]], enabled: checked } } } : prev)} /></div><Input value={value.title} onChange={(e) => setPlatformControls((prev) => prev ? { ...prev, services: { ...prev.services, [key]: { ...prev.services[key as keyof PlatformControls["services"]], title: e.target.value } } } : prev)} placeholder="Title" /><Textarea value={value.description} onChange={(e) => setPlatformControls((prev) => prev ? { ...prev, services: { ...prev.services, [key]: { ...prev.services[key as keyof PlatformControls["services"]], description: e.target.value } } } : prev)} /><Input value={value.ctaLabel} onChange={(e) => setPlatformControls((prev) => prev ? { ...prev, services: { ...prev.services, [key]: { ...prev.services[key as keyof PlatformControls["services"]], ctaLabel: e.target.value } } } : prev)} placeholder="CTA label" /></div>)}</div><Button onClick={savePlatformControls}>Save Platform Controls</Button></CardContent></Card>
              ) : null}
            </TabsContent>

            <TabsContent value="architecture">
              <Card>
                <CardHeader><CardTitle>Backend Flow</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p>The admin backend now follows a clearer operational path:</p>
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">{`config/env + config/db
        |
   express app
        |
middleware
  - cors
  - json
  - morgan
  - requireAuth / optionalAuth / requireAdmin
        |
routes
  - /api/auth
  - /api/credit
  - /api/disputes
  - /api/support-tickets
  - /api/contact
  - /api/consultations
  - /api/admin
  - /api/messages
        |
models
  - User
  - CreditAccount
  - CreditScore
  - Dispute
  - SupportTicket
  - ContactMessage
  - ConsultationRequest
  - PlatformControl
  - AgentMessage
        |
socket.io
  - presence
  - typing
  - new message events`}</pre>
                  <p>Operational list endpoints that used to be public are now admin-protected for reads, while public form submissions remain open where appropriate.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminManagement;
