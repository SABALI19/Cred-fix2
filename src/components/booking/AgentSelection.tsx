import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Check, Clock, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authService, type AgentOption } from "@/services/authService";
import {
  buildMergedAgentProfiles,
  filterAgentProfilesByService,
  type AgentProfile,
} from "@/lib/agentProfiles";
import { toast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  specialties: string[];
  experience: string;
  clientsServed: number;
  successRate: number;
  nextAvailable: string;
  recommended?: boolean;
}
interface AgentSelectionProps {
  selectedService: string;
  selectedAgent: Agent | null;
  onAgentSelect: (agent: Agent) => void;
}

const toBookingAgent = (profile: AgentProfile, index: number): Agent => ({
  id: profile.id,
  name: profile.name,
  title: profile.title,
  avatar: profile.avatar,
  rating: profile.rating,
  specialties: [profile.specialization, ...profile.credentials.slice(0, 2)],
  experience: profile.experience,
  clientsServed: profile.clientsHelped,
  successRate: profile.successRate,
  nextAvailable: profile.availability,
  recommended: index === 0,
});

const AgentSelection = ({
  selectedService,
  selectedAgent,
  onAgentSelect,
}: AgentSelectionProps) => {
  const { user } = useAuth();
  const [availableAgents, setAvailableAgents] = useState<AgentOption[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const rows =
          user?.role === "user"
            ? await authService.getAvailableAgents()
            : await authService.getPublicAgents();
        setAvailableAgents(rows);
      } catch (_error) {
        toast({
          title: "Could not load agents",
          description: "Showing the standard specialist lineup for now.",
          variant: "destructive",
        });
        setAvailableAgents([]);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    loadAgents();
  }, [user?.role]);

  const agents = useMemo(
    () =>
      filterAgentProfilesByService(
        buildMergedAgentProfiles(availableAgents),
        selectedService,
      ).map(toBookingAgent),
    [availableAgents, selectedService],
  );

  const getServiceTitle = () => {
    switch (selectedService) {
      case "credit_repair":
        return "Credit Repair Specialists";
      case "tax_services":
        return "Tax Experts";
      case "comprehensive":
        return "Financial Specialists";
      default:
        return "Our Specialists";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h3 className="text-xl font-semibold mb-2">{getServiceTitle()}</h3>
        <p className="text-muted-foreground">
          Choose the specialist who will guide your financial journey
        </p>
      </div>

      {isLoadingAgents ? (
        <Card>
          <CardContent className="flex items-center justify-center p-6 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading specialists...
          </CardContent>
        </Card>
      ) : null}

      {!isLoadingAgents && agents.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No specialists are available right now.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {agents.map((agent) => {
          const isSelected = selectedAgent?.id === agent.id;

          return (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all hover:shadow-lg relative ${
                isSelected
                  ? "ring-2 ring-primary border-primary shadow-lg"
                  : "hover:border-primary/50"
              }`}
              onClick={() => onAgentSelect(agent)}
            >
              {agent.recommended && (
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}

              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0 sm:space-x-4">
                  <Avatar className="h-16 w-16 self-center sm:self-auto">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {agent.title}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="bg-primary text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-3 text-sm sm:gap-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{agent.rating}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{agent.clientsServed}+ clients</span>
                      </div>
                      <div className="text-muted-foreground">
                        {agent.experience}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-4">
                      <div>
                        <div className="text-muted-foreground">
                          Success Rate
                        </div>
                        <div className="font-semibold text-green-600">
                          {agent.successRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">
                          Next Available
                        </div>
                        <div className="font-semibold flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {agent.nextAvailable}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Why Choose Your Specialist */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-4 sm:p-6">
          <h4 className="font-semibold mb-4 text-center">
            Why Choose a Dedicated Specialist?
          </h4>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h5 className="font-medium mb-1">Personalized Support</h5>
              <p className="text-muted-foreground">
                Your specialist understands your unique financial situation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h5 className="font-medium mb-1">Proven Results</h5>
              <p className="text-muted-foreground">
                All specialists have 90%+ success rates with satisfied clients
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h5 className="font-medium mb-1">Ongoing Partnership</h5>
              <p className="text-muted-foreground">
                Regular check-ins and support throughout your journey
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentSelection;
