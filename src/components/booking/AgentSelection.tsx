import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Check, Clock, Users } from "lucide-react";

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

const getAgentsForService = (service: string): Agent[] => {
  const creditAgents = [
    {
      id: "sarah-mitchell",
      name: "Sarah Mitchell",
      title: "Senior Credit Repair Specialist",
      avatar: "/api/placeholder/100/100",
      rating: 4.9,
      specialties: ["Credit Disputes", "Score Optimization", "Debt Management"],
      experience: "8+ years",
      clientsServed: 1250,
      successRate: 96,
      nextAvailable: "Today 2:00 PM",
      recommended: true,
    },
    {
      id: "amanda-williams",
      name: "Amanda Williams",
      title: "Credit Dispute Resolution Expert",
      avatar: "/api/placeholder/100/100",
      rating: 4.8,
      specialties: [
        "Dispute Resolution",
        "Credit Education",
        "Financial Planning",
      ],
      experience: "6+ years",
      clientsServed: 890,
      successRate: 97,
      nextAvailable: "Tomorrow 10:00 AM",
    },
    {
      id: "robert-kim",
      name: "Robert Kim",
      title: "Identity Theft Recovery Specialist",
      avatar: "/api/placeholder/100/100",
      rating: 4.9,
      specialties: ["Identity Theft", "Fraud Recovery", "Credit Monitoring"],
      experience: "11+ years",
      clientsServed: 2100,
      successRate: 94,
      nextAvailable: "Today 4:30 PM",
    },
  ];

  const taxAgents = [
    {
      id: "michael-rodriguez",
      name: "Michael Rodriguez",
      title: "Senior Tax Strategist",
      avatar: "/api/placeholder/100/100",
      rating: 4.9,
      specialties: ["Tax Planning", "Business Taxes", "IRS Representation"],
      experience: "12+ years",
      clientsServed: 1800,
      successRate: 98,
      nextAvailable: "Today 3:00 PM",
      recommended: true,
    },
    {
      id: "jennifer-chen",
      name: "Jennifer Chen",
      title: "Tax Preparation Expert",
      avatar: "/api/placeholder/100/100",
      rating: 4.8,
      specialties: [
        "Personal Taxes",
        "Deduction Optimization",
        "Refund Maximization",
      ],
      experience: "10+ years",
      clientsServed: 1450,
      successRate: 96,
      nextAvailable: "Tomorrow 11:00 AM",
    },
  ];

  if (service === "tax_services") {
    return taxAgents;
  }

  if (service === "comprehensive") {
    return [...creditAgents, ...taxAgents];
  }

  return creditAgents;
};

const AgentSelection = ({
  selectedService,
  selectedAgent,
  onAgentSelect,
}: AgentSelectionProps) => {
  const agents = getAgentsForService(selectedService);

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
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">{getServiceTitle()}</h3>
        <p className="text-muted-foreground">
          Choose the specialist who will guide your financial journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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

              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
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

                    <div className="flex items-center space-x-4 mb-3 text-sm">
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

                    <div className="grid grid-cols-2 gap-4 text-sm">
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
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 text-center">
            Why Choose a Dedicated Specialist?
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
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
