import { useMemo } from "react";
import { AlertTriangle, CreditCard, FileText, RefreshCw, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAccountSummary,
  useCreditAccounts,
  useCreditScoreHistory,
  useDisputeStats,
} from "@/hooks/useCredit";

const LiveDashboard = () => {
  const { user, openLogin } = useAuth();
  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useAccountSummary();
  const {
    data: accounts,
    isLoading: accountsLoading,
    refetch: refetchAccounts,
  } = useCreditAccounts();
  const {
    data: scores,
    isLoading: scoresLoading,
    refetch: refetchScores,
  } = useCreditScoreHistory(10);
  const {
    data: disputeStats,
    isLoading: disputesLoading,
    refetch: refetchDisputes,
  } = useDisputeStats();

  const latestScore = useMemo(() => {
    if (!scores || scores.length === 0) {
      return null;
    }
    return [...scores].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    )[0];
  }, [scores]);

  const isLoading =
    summaryLoading || accountsLoading || scoresLoading || disputesLoading;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                Please sign in to access live dashboard data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={openLogin} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Live Dashboard</h1>
            <p className="text-muted-foreground">
              MongoDB-backed account and dispute metrics
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              refetchSummary();
              refetchAccounts();
              refetchScores();
              refetchDisputes();
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {isLoading && (
          <Card>
            <CardContent className="py-8 flex items-center justify-center text-muted-foreground">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Loading data...
            </CardContent>
          </Card>
        )}

        {!isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Latest Credit Score</CardDescription>
                  <CardTitle className="text-2xl">
                    {latestScore?.score ?? "N/A"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge>{latestScore?.bureau ?? "No bureau data"}</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Accounts</CardDescription>
                  <CardTitle className="text-2xl">
                    {summary?.totalAccounts ?? 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Active tracked accounts
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Utilization</CardDescription>
                  <CardTitle className="text-2xl">
                    {Math.round(summary?.utilization ?? 0)}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Based on reported balances
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Disputes</CardDescription>
                  <CardTitle className="text-2xl">
                    {disputeStats?.activeDisputes ?? 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    Pending review and investigation
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Credit Accounts</CardTitle>
                <CardDescription>
                  Most recently added accounts in your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {accounts && accounts.length > 0 ? (
                  accounts.slice(0, 5).map((account) => (
                    <div
                      key={account._id}
                      className="rounded-lg border p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <div className="font-medium">{account.accountName}</div>
                        <div className="text-xs text-muted-foreground">
                          {account.creditorName} • {account.accountType}
                        </div>
                      </div>
                      <div className="text-sm">
                        Balance: ${account.balance.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    No accounts found yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveDashboard;
