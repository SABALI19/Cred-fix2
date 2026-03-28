import { useEffect, useMemo, useState } from "react";
import { Users, Award, TrendingUp, Shield, Loader2, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AgentCard from "@/components/agents/AgentCard";
import { useAuth } from "@/contexts/AuthContext";
import { authService, type AgentOption } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
import {
  buildMergedAgentProfiles,
  buildPublicAgentProfiles,
  type AgentProfile,
} from "@/lib/agentProfiles";

const AgentsSection = () => {
  const { user, openSignUp, selectAgent } = useAuth();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [isSavingAgentId, setIsSavingAgentId] = useState<string | null>(null);
  const isUser = user?.role === "user";
  const canPickPreferredAgent =
    isUser && Boolean(user?.selectedService) && !user?.assignedAgentId;

  useEffect(() => {
    const loadAgents = async () => {
      if (!isUser) {
        setAgents([]);
        return;
      }

      setIsLoadingAgents(true);
      try {
        const rows = await authService.getAvailableAgents();
        setAgents(rows);
      } catch (_error) {
        toast({
          title: "Could not load agents",
          description: "Please refresh or try again in a moment.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingAgents(false);
      }
    };

    loadAgents();
  }, [isUser]);

  const publicProfiles = useMemo(() => buildPublicAgentProfiles(), []);

  const userProfiles = useMemo(() => buildMergedAgentProfiles(agents), [agents]);

  const displayedProfiles = isUser ? userProfiles : publicProfiles;

  const selectedAgent = useMemo(
    () =>
      isUser
        ? userProfiles.find((agent) => agent.id === user?.assignedAgentId) ||
          null
        : null,
    [isUser, userProfiles, user?.assignedAgentId],
  );

  const handleChooseAgent = async (agent: AgentProfile) => {
    if (!user) {
      openSignUp();
      return;
    }

    if (user.role !== "user") {
      return;
    }

    if (!user.selectedService) {
      toast({
        title: "Service required",
        description: "Choose a service first before selecting your preferred agent.",
        variant: "destructive",
      });
      return;
    }

    if (user.assignedAgentId) {
      toast({
        title: "Agent already assigned",
        description:
          "You already have an assigned agent. Please contact support if you need a change.",
      });
      return;
    }

    setIsSavingAgentId(agent.id);
    try {
      await selectAgent(agent.id);
      toast({
        title: "Agent selected",
        description: `${agent.name} is now your preferred agent.`,
      });
      navigate("/dashboard");
    } catch (_error) {
      toast({
        title: "Could not assign agent",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingAgentId(null);
    }
  };

  return (
    <section id="agents-list" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse specialist profiles. Each registered user is assigned one
            designated agent during signup and chat stays locked to that agent.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">40+</div>
            <div className="text-sm text-muted-foreground">
              Professional Certifications
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <div className="text-2xl font-bold text-accent">8,025+</div>
            <div className="text-sm text-muted-foreground">Clients Served</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">71+</div>
            <div className="text-sm text-muted-foreground">
              Years Combined Experience
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">1:1</div>
            <div className="text-sm text-muted-foreground">Assigned Chat</div>
          </div>
        </div>

        {!user ? (
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle>Sign Up To Get Assigned An Agent</CardTitle>
              <CardDescription>
                Agent assignment happens during registration after service
                selection.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 flex-wrap">
              <Button onClick={openSignUp}>Create Account</Button>
              <Button variant="outline" asChild>
                <Link to="/specialists">Compare Specialists</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {isUser && selectedAgent ? (
          <Card className="mb-8 border-green-300 bg-green-50/60">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-green-800">Current Chat Agent</p>
                <p className="text-sm text-green-700">
                  {selectedAgent.name} ({selectedAgent.email})
                </p>
              </div>
              <Button asChild size="sm">
                <Link to="/dashboard">Open Chat</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {isUser && !user?.selectedService ? (
          <Card className="mb-8 border-amber-300 bg-amber-50/60">
            <CardContent className="p-4 text-sm text-amber-800">
              Select a service first to unlock preferred-agent assignment.
            </CardContent>
          </Card>
        ) : null}

        {isUser && !selectedAgent && user?.selectedService ? (
          <Card className="mb-8 border-amber-300 bg-amber-50/60">
            <CardContent className="p-4 text-sm text-amber-800">
              Choose your preferred agent to continue. Your chat will be locked
              to that designated agent.
            </CardContent>
          </Card>
        ) : null}

        {isUser && isLoadingAgents ? (
          <Card className="mb-12">
            <CardContent className="p-6 flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading agents...
            </CardContent>
          </Card>
        ) : null}

        {isUser && !isLoadingAgents && displayedProfiles.length === 0 ? (
          <Card className="mb-12">
            <CardContent className="p-6 text-center text-muted-foreground">
              No agents are available right now.
            </CardContent>
          </Card>
        ) : null}

        {!isUser || !isLoadingAgents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {displayedProfiles.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                showChatSelect={canPickPreferredAgent}
                onSelectForChat={
                  canPickPreferredAgent && agent.canSelectForChat
                    ? () => handleChooseAgent(agent)
                    : undefined
                }
                isSelectedForChat={isUser && user?.assignedAgentId === agent.id}
                isSelectingForChat={isSavingAgentId === agent.id}
                canSelectForChat={Boolean(agent.canSelectForChat)}
              />
            ))}
          </div>
        ) : null}

        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Ready To Work With Our Experts?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            During signup, choose your service first, then select your assigned
            agent from the list. Dashboard chat remains locked to that assigned
            agent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-block text-center"
            >
              Schedule Free Consultation
            </Link>
            <Link
              to="/specialists"
              className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-block text-center"
            >
              Compare All Specialists
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
