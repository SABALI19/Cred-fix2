import { useEffect, useMemo, useState } from "react";
import { Users, Award, TrendingUp, Shield, Loader2, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AgentCard from "@/components/agents/AgentCard";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

interface AvailableAgent {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  phone?: string;
  bio?: string;
  clientCount: number;
}

interface AgentProfile {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  rating: number;
  clientsHelped: number;
  successRate: number;
  location: string;
  avatar: string;
  bio: string;
  credentials: string[];
  achievements: string[];
  languages: string[];
  availability: string;
  email: string;
  phone: string;
  linkedin?: string;
  canSelectForChat?: boolean;
}

const MOCK_AGENT_PROFILES: Omit<AgentProfile, "id">[] = [
  {
    name: "Sarah Mitchell",
    title: "Senior Credit Repair Specialist",
    specialization: "Credit Restoration",
    experience: "8+ Years",
    rating: 4.9,
    clientsHelped: 1250,
    successRate: 96,
    location: "New York, NY",
    avatar: "/placeholder.svg",
    bio: "Sarah is a certified credit counselor focused on complex credit restoration and dispute strategy.",
    credentials: [
      "Certified Credit Counselor (NACC)",
      "FICO Score Professional Certification",
      "Credit Repair Organizations Act Specialist",
      "Fair Credit Reporting Act Expert",
    ],
    achievements: [
      "720+ scores achieved for 85% of clients",
      "Removed 15,000+ negative items",
      "98% client satisfaction",
    ],
    languages: ["English", "Spanish"],
    availability: "Available Today",
    email: "sarah.mitchell@creditfixpro.com",
    phone: "+1 (555) 123-0001",
    linkedin: "sarah-mitchell-credit",
  },
  {
    name: "Michael Rodriguez",
    title: "Tax Preparation Expert",
    specialization: "Tax Optimization",
    experience: "12+ Years",
    rating: 4.8,
    clientsHelped: 2100,
    successRate: 94,
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg",
    bio: "Michael is a CPA focused on refund optimization, tax planning, and IRS compliance support.",
    credentials: [
      "Certified Public Accountant (CPA)",
      "IRS Enrolled Agent",
      "Tax Resolution Specialist",
    ],
    achievements: [
      "Average refund increase: $2,400",
      "150+ IRS audit cases resolved",
      "$2.5M+ tax savings for clients",
    ],
    languages: ["English", "Spanish", "Portuguese"],
    availability: "Available Tomorrow",
    email: "michael.rodriguez@creditfixpro.com",
    phone: "+1 (555) 123-0002",
    linkedin: "michael-rodriguez-cpa",
  },
  {
    name: "Jennifer Chen",
    title: "Financial Planning Advisor",
    specialization: "Wealth Building",
    experience: "10+ Years",
    rating: 4.9,
    clientsHelped: 890,
    successRate: 92,
    location: "Chicago, IL",
    avatar: "/placeholder.svg",
    bio: "Jennifer combines credit improvement with long-term planning and wealth-building strategy.",
    credentials: [
      "Certified Financial Planner (CFP)",
      "Chartered Financial Consultant (ChFC)",
      "Investment Advisor Representative",
    ],
    achievements: [
      "$89M combined client wealth growth",
      "Average net-worth increase: $125,000",
      "2023 Financial Advisor Excellence Award",
    ],
    languages: ["English", "Mandarin", "Cantonese"],
    availability: "Available Today",
    email: "jennifer.chen@creditfixpro.com",
    phone: "+1 (555) 123-0003",
    linkedin: "jennifer-chen-cfp",
  },
  {
    name: "David Thompson",
    title: "Business Credit Specialist",
    specialization: "Business Finance",
    experience: "15+ Years",
    rating: 4.7,
    clientsHelped: 650,
    successRate: 91,
    location: "Dallas, TX",
    avatar: "/placeholder.svg",
    bio: "David helps founders build business credit and secure financing for growth initiatives.",
    credentials: [
      "Certified Business Credit Professional",
      "SBA Lending Specialist",
      "Commercial Finance Consultant",
    ],
    achievements: [
      "$45M+ funding secured for clients",
      "500+ companies onboarded to business credit",
      "Average business credit gain: 180 points",
    ],
    languages: ["English", "French"],
    availability: "Available in 2 hours",
    email: "david.thompson@creditfixpro.com",
    phone: "+1 (555) 123-0004",
    linkedin: "david-thompson-business",
  },
  {
    name: "Amanda Williams",
    title: "Credit Dispute Specialist",
    specialization: "Dispute Resolution",
    experience: "6+ Years",
    rating: 4.8,
    clientsHelped: 975,
    successRate: 97,
    location: "Atlanta, GA",
    avatar: "/placeholder.svg",
    bio: "Amanda specializes in difficult disputes and high-impact removal strategies.",
    credentials: [
      "Advanced Credit Dispute Certification",
      "Consumer Protection Law Specialist",
      "Fair Debt Collection Practices Specialist",
    ],
    achievements: [
      "97% dispute success rate",
      "Average score lift: 145 points",
      "Featured on Credit Repair Today",
    ],
    languages: ["English", "French"],
    availability: "Available Today",
    email: "amanda.williams@creditfixpro.com",
    phone: "+1 (555) 123-0005",
    linkedin: "amanda-williams-disputes",
  },
  {
    name: "Maria Gonzalez",
    title: "Credit Counseling Expert",
    specialization: "Credit Education",
    experience: "9+ Years",
    rating: 4.9,
    clientsHelped: 1340,
    successRate: 95,
    location: "Phoenix, AZ",
    avatar: "/placeholder.svg",
    bio: "Maria delivers bilingual credit education and sustainable score-improvement programs.",
    credentials: [
      "Certified Credit Counselor (NFCC)",
      "HUD-Approved Housing Counselor",
      "Financial Literacy Instructor Certification",
    ],
    achievements: [
      "95% long-term score retention",
      "200+ financial literacy workshops",
      "Outstanding Credit Counselor Award",
    ],
    languages: ["English", "Spanish", "Italian"],
    availability: "Available Tomorrow",
    email: "maria.gonzalez@creditfixpro.com",
    phone: "+1 (555) 123-0006",
    linkedin: "maria-gonzalez-counselor",
  },
  {
    name: "Robert Kim",
    title: "Identity Theft Recovery Specialist",
    specialization: "Identity Protection",
    experience: "11+ Years",
    rating: 4.7,
    clientsHelped: 820,
    successRate: 93,
    location: "Seattle, WA",
    avatar: "/placeholder.svg",
    bio: "Robert handles fraud recovery and identity theft remediation with end-to-end dispute support.",
    credentials: [
      "Certified Identity Theft Risk Management Specialist",
      "Fraud Investigation Certification",
      "Privacy Protection Professional",
    ],
    achievements: [
      "93% identity theft case resolution",
      "Average recovered fraud amount: $45,000",
      "85% restoration to pre-theft profile",
    ],
    languages: ["English", "Korean", "Japanese"],
    availability: "Available in 3 hours",
    email: "robert.kim@creditfixpro.com",
    phone: "+1 (555) 123-0007",
    linkedin: "robert-kim-identity",
  },
  {
    name: "Robert Kim",
    title: "Identity Theft Recovery Specialist",
    specialization: "Identity Protection",
    experience: "11+ Years",
    rating: 4.7,
    clientsHelped: 820,
    successRate: 93,
    location: "Seattle, WA",
    avatar: "/placeholder.svg",
    bio: "Robert handles fraud recovery and identity theft remediation with end-to-end dispute support.",
    credentials: [
      "Certified Identity Theft Risk Management Specialist",
      "Fraud Investigation Certification",
      "Privacy Protection Professional",
    ],
    achievements: [
      "93% identity theft case resolution",
      "Average recovered fraud amount: $45,000",
      "85% restoration to pre-theft profile",
    ],
    languages: ["English", "Korean", "Japanese"],
    availability: "Available in 3 hours",
    email: "robert.kim@creditfixpro.com",
    phone: "+1 (555) 123-0007",
    linkedin: "robert-kim-identity",
  },
];

const fallbackProfileFromBackend = (agent: AvailableAgent): AgentProfile => ({
  id: agent._id,
  name: agent.name,
  title: "Credit Specialist",
  specialization: "Credit Support",
  experience: "5+ Years",
  rating: 4.8,
  clientsHelped: Math.max(agent.clientCount, 1),
  successRate: 92,
  location: "United States",
  avatar: agent.profilePhoto || "/placeholder.svg",
  bio: agent.bio || "Experienced specialist ready to help with your case.",
  credentials: ["Certified Financial Support Specialist"],
  achievements: ["Trusted by active clients"],
  languages: ["English"],
  availability: "Available Today",
  email: agent.email,
  phone: agent.phone || "",
  canSelectForChat: true,
});

const AgentsSection = () => {
  const { user, openSignUp, selectAgent } = useAuth();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AvailableAgent[]>([]);
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

  const mockByEmail = useMemo(
    () =>
      new Map(
        MOCK_AGENT_PROFILES.map((profile) => [
          profile.email.toLowerCase(),
          profile,
        ]),
      ),
    [],
  );

  const publicProfiles = useMemo(
    () =>
      MOCK_AGENT_PROFILES.map((profile, index) => ({
        ...profile,
        id: `mock-${index + 1}`,
        canSelectForChat: false,
      })),
    [],
  );

  const userProfiles = useMemo(
    () => {
      const matchedProfiles = agents.map((agent) => {
        const matched = mockByEmail.get(agent.email.toLowerCase());
        if (!matched) {
          return fallbackProfileFromBackend(agent);
        }

        return {
          ...matched,
          id: agent._id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone || matched.phone,
          avatar: agent.profilePhoto || matched.avatar,
          bio: agent.bio || matched.bio,
          clientsHelped: Math.max(matched.clientsHelped, agent.clientCount),
          canSelectForChat: true,
        };
      });

      const matchedEmails = new Set(
        agents.map((agent) => agent.email.toLowerCase()),
      );
      const hardcodedOnlyProfiles = MOCK_AGENT_PROFILES.filter(
        (profile) => !matchedEmails.has(profile.email.toLowerCase()),
      ).map((profile, index) => ({
        ...profile,
        id: `mock-user-${index + 1}`,
        canSelectForChat: false,
      }));

      return [...matchedProfiles, ...hardcodedOnlyProfiles];
    },
    [agents, mockByEmail],
  );

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
