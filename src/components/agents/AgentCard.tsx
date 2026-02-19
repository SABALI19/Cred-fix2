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
  TrendingUp,
  Users,
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
}

const AgentCard = ({ agent }: AgentCardProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, openSignUp } = useAuth();

  const handleBookConsultation = () => {
    if (!user) {
      openSignUp();
    } else {
      // In a real app, this would open booking calendar
      alert(`Booking consultation with ${agent.name}...`);
    }
  };

  const handleSendMessage = () => {
    if (!user) {
      openSignUp();
    } else {
      // In a real app, this would open messaging interface
      alert(`Opening message chat with ${agent.name}...`);
    }
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="relative mx-auto mb-4">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl font-bold">
                {agent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          <h3 className="font-bold text-xl text-foreground">{agent.name}</h3>
          <p className="text-primary font-semibold">{agent.title}</p>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary mx-auto"
          >
            {agent.specialization}
          </Badge>

          <div className="flex items-center justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(agent.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              ({agent.rating})
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">
                {agent.clientsHelped}+
              </div>
              <div className="text-xs text-muted-foreground">
                Clients Helped
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">
                {agent.successRate}%
              </div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>{agent.experience} Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{agent.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" />
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
              onClick={handleBookConsultation}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Book Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agent Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={agent.avatar} alt={agent.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg font-bold">
                  {agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{agent.name}</DialogTitle>
                <DialogDescription className="text-lg font-semibold text-primary">
                  {agent.title}
                </DialogDescription>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(agent.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({agent.rating} • {agent.clientsHelped}+ clients)
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Bio */}
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-muted-foreground leading-relaxed">
                {agent.bio}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {agent.clientsHelped}+
                </div>
                <div className="text-sm text-muted-foreground">
                  Clients Helped
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {agent.successRate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {agent.experience}
                </div>
                <div className="text-sm text-muted-foreground">Experience</div>
              </div>
            </div>

            {/* Credentials */}
            <div>
              <h4 className="font-semibold mb-3">
                Credentials & Certifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {agent.credentials.map((credential, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {credential}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="font-semibold mb-3">Key Achievements</h4>
              <div className="space-y-2">
                {agent.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Award className="w-4 h-4 text-yellow-500 mt-0.5" />
                    {achievement}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages & Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.languages.map((language, index) => (
                    <Badge key={index} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Availability</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">{agent.availability}</span>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                onClick={handleBookConsultation}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Consultation
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSendMessage}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" size="icon">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Mail className="w-4 h-4" />
              </Button>
              {agent.linkedin && (
                <Button variant="outline" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentCard;
