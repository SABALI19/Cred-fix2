import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Upload,
  User,
  Mail,
  Phone,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Edit,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  AnimatedContainer,
  HoverCard,
} from "@/components/animations/AnimatedComponents";

const ProfileSettings = () => {
  const { user, updateProfile, selectAgent } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [agents, setAgents] = useState<
    Array<{
      _id: string;
      name: string;
      email: string;
      profilePhoto?: string;
      phone?: string;
      bio?: string;
      clientCount: number;
    }>
  >([]);
  const [isAgentsLoading, setIsAgentsLoading] = useState(false);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(
    user?.assignedAgentId || "unassigned",
  );

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    profilePhoto: user?.profilePhoto || "",
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, profilePhoto: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, profilePhoto: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        profilePhoto: formData.profilePhoto,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentPhoto = previewImage || formData.profilePhoto;

  useEffect(() => {
    setSelectedAgentId(user?.assignedAgentId || "unassigned");
  }, [user?.assignedAgentId]);

  useEffect(() => {
    if (!user || user.role !== "user") return;

    const loadAgents = async () => {
      setIsAgentsLoading(true);
      try {
        const rows = await authService.getAvailableAgents();
        setAgents(rows);
      } catch (_error) {
        toast({
          title: "Could not load agents",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      } finally {
        setIsAgentsLoading(false);
      }
    };

    loadAgents();
  }, [user]);

  const handleSaveAgentSelection = async () => {
    if (!user || user.role !== "user") return;
    setIsSavingAgent(true);
    try {
      await selectAgent(selectedAgentId === "unassigned" ? null : selectedAgentId);
      toast({
        title: "Agent updated",
        description:
          selectedAgentId === "unassigned"
            ? "You are currently not assigned to an agent."
            : "Your selected agent has been saved.",
      });
    } catch (_error) {
      toast({
        title: "Could not save agent",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingAgent(false);
    }
  };

  return (
    <AnimatedContainer className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={currentPhoto} alt={formData.name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {user?.role && (
                <Badge
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 text-xs"
                >
                  {user.role}
                </Badge>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">{formData.name}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{formData.email}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Profile Photo</span>
          </CardTitle>
          <CardDescription>
            Upload a profile photo to personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative flex-shrink-0">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                <AvatarImage src={currentPhoto} alt="Profile" />
                <AvatarFallback className="text-2xl sm:text-4xl bg-muted">
                  <User className="w-12 h-12 sm:w-16 sm:h-16" />
                </AvatarFallback>
              </Avatar>

              {currentPhoto && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
              )}
            </div>

            <div className="space-y-4 w-full sm:w-auto text-center sm:text-left">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="space-x-2 w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </Button>
              </div>

              <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <p>• Recommended size: 400x400 pixels</p>
                <p>• Maximum file size: 5MB</p>
                <p>• Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Role</Label>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <Badge variant="secondary" className="capitalize">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Tell us a bit about yourself..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/500 characters
              </p>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setFormData({
                    name: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    bio: user?.bio || "",
                    profilePhoto: user?.profilePhoto || "",
                  });
                  setPreviewImage(null);
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="space-x-2 w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {user?.role === "user" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Choose Your Agent</span>
            </CardTitle>
            <CardDescription>
              Select the specialist you want to work with on your credit journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assigned-agent">Available Agents</Label>
              <Select
                value={selectedAgentId}
                onValueChange={setSelectedAgentId}
                disabled={isAgentsLoading || isSavingAgent}
              >
                <SelectTrigger id="assigned-agent">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">No preference</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent._id} value={agent._id}>
                      {agent.name} ({agent.clientCount} clients)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {user.assignedAgent ? (
              <div className="rounded-lg border border-border/60 p-3 bg-muted/30 text-sm">
                <p className="font-medium">{user.assignedAgent.name}</p>
                <p className="text-muted-foreground">{user.assignedAgent.email}</p>
                {user.assignedAgent.phone ? (
                  <p className="text-muted-foreground">{user.assignedAgent.phone}</p>
                ) : null}
              </div>
            ) : null}

            <div className="flex justify-end">
              <Button onClick={handleSaveAgentSelection} disabled={isSavingAgent || isAgentsLoading}>
                {isSavingAgent ? "Saving..." : "Save Agent Selection"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Security Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-primary">Privacy & Security</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your profile information is protected and will only be visible
                to authorized support staff. Profile photos are stored securely
                and can be removed at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedContainer>
  );
};

export default ProfileSettings;
