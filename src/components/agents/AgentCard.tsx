import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Calendar,
  Phone,
  Mail,
  Award,
  Clock,
  CheckCircle2,
  MapPin,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Agent {
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
}

interface AgentCardProps {
  agent: Agent;
  onSelectForChat?: (agent: Agent) => void;
  isSelectedForChat?: boolean;
  isSelectingForChat?: boolean;
  showChatSelect?: boolean;
  canSelectForChat?: boolean;
}

const AgentCard = ({
  agent,
  onSelectForChat,
  isSelectedForChat = false,
  isSelectingForChat = false,
  showChatSelect = false,
  canSelectForChat = true,
}: AgentCardProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, openSignUp } = useAuth();

  const handleBookConsultation = () => {
    if (!user) {
      openSignUp();
    } else {
      alert(`Booking consultation with ${agent.name}...`);
    }
  };

  const handleSendMessage = () => {
    if (!user) {
      openSignUp();
    } else if (onSelectForChat) {
      onSelectForChat(agent);
    } else {
      alert(`Opening message chat with ${agent.name}...`);
    }
  };

  return (
    <>
      <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="pb-4 text-center">
          <div className="relative mx-auto mb-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-xl font-bold text-white">
                {agent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground">{agent.name}</h3>
          <p className="font-semibold text-primary">{agent.title}</p>
          <Badge variant="secondary" className="mx-auto bg-primary/10 text-primary">
            {agent.specialization}
          </Badge>

          <div className="mt-2 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(agent.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-muted-foreground">({agent.rating})</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{agent.clientsHelped}+</div>
              <div className="text-xs text-muted-foreground">Clients Helped</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">{agent.successRate}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>{agent.experience} Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{agent.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-green-600">{agent.availability}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsProfileOpen(true)}
            >
              View Profile
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              onClick={showChatSelect ? handleSendMessage : handleBookConsultation}
              disabled={showChatSelect && (!canSelectForChat || isSelectingForChat)}
            >
              {showChatSelect ? (
                <>
                  <MessageCircle className="mr-1 h-4 w-4" />
                  {isSelectingForChat
                    ? "Saving..."
                    : isSelectedForChat
                      ? "Assigned"
                      : canSelectForChat
                        ? "Choose Agent"
                        : "Unavailable"}
                </>
              ) : (
                <>
                  <Calendar className="mr-1 h-4 w-4" />
                  Book Call
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] overflow-hidden rounded-xl p-0 sm:max-w-2xl sm:rounded-2xl">
          <div className="flex max-h-[92vh] flex-col">
            <DialogHeader className="border-b px-4 pb-4 pt-10 sm:px-6 sm:pb-5">
              <div className="flex flex-col gap-4 pr-8 sm:flex-row sm:items-center">
                <Avatar className="mx-auto h-16 w-16 sm:mx-0 sm:h-20 sm:w-20">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-bold text-white">
                    {agent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 text-center sm:text-left">
                  <DialogTitle className="text-xl sm:text-2xl">{agent.name}</DialogTitle>
                  <DialogDescription className="text-base font-semibold text-primary sm:text-lg">
                    {agent.title}
                  </DialogDescription>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-1 sm:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(agent.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-muted-foreground">
                      ({agent.rating} - {agent.clientsHelped}+ clients)
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 overflow-y-auto px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
              <div>
                <h4 className="mb-2 font-semibold">About</h4>
                <p className="leading-relaxed text-muted-foreground">{agent.bio}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3 sm:gap-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-2xl font-bold text-primary">{agent.clientsHelped}+</div>
                  <div className="text-sm text-muted-foreground">Clients Helped</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-2xl font-bold text-accent">{agent.successRate}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-2xl font-bold text-blue-500">{agent.experience}</div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold">Credentials & Certifications</h4>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {agent.credentials.map((credential, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                      <span className="min-w-0">{credential}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold">Key Achievements</h4>
                <div className="space-y-2">
                  {agent.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Award className="mt-0.5 h-4 w-4 text-yellow-500" />
                      <span className="min-w-0">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Availability</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">{agent.availability}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 sm:flex-1"
                    onClick={handleBookConsultation}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Consultation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:flex-1"
                    onClick={handleSendMessage}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-3">
                    <Button variant="outline" size="icon" className="w-full sm:w-10 sm:px-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-full sm:w-10 sm:px-0">
                      <Mail className="h-4 w-4" />
                    </Button>
                    {agent.linkedin ? (
                      <Button
                        variant="outline"
                        size="icon"
                        className="col-span-2 w-full sm:col-span-1 sm:w-10 sm:px-0"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentCard;
