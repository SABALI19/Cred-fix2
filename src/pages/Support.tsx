import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SupportTicket, { TicketList } from "@/components/support/SupportTicket";
import EnhancedFAQSearch from "@/components/faq/EnhancedFAQSearch";
import { AchievementsList } from "@/components/progress/ProgressCelebration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  MessageSquare,
  BookOpen,
  Video,
  Phone,
  Mail,
  Clock,
  Users,
  Award,
  Plus,
} from "lucide-react";

const Support = () => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketRefreshKey, setTicketRefreshKey] = useState(0);

  // Mock FAQ data for the enhanced search
  const mockFAQs = [
    {
      id: "1",
      question: "How long does credit repair take?",
      answer: "Most clients see improvements within 45-90 days...",
      category: "Credit Repair",
      tags: ["timeline", "results", "expectations"],
      popularity: 245,
      lastUpdated: new Date(),
    },
    {
      id: "2", 
      question: "What documents do I need for tax filing?",
      answer: "You'll need W-2s, 1099s, receipts for deductions...",
      category: "Tax Services",
      tags: ["documents", "filing", "requirements"],
      popularity: 189,
      lastUpdated: new Date(),
    },
    // Add more mock FAQs as needed
  ];

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageSquare,
      action: () => console.log("Open live chat"),
      available: true,
      responseTime: "< 2 minutes",
    },
    {
      title: "Phone Support", 
      description: "Speak directly with a specialist",
      icon: Phone,
      action: () => window.open("tel:+15551234567"),
      available: true,
      responseTime: "Available now",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      action: () => window.open("mailto:support@creditfixpro.com"),
      available: true,
      responseTime: "< 4 hours",
    },
    {
      title: "Video Call",
      description: "Schedule a screen share session",
      icon: Video,
      action: () => window.open("/booking"),
      available: false,
      responseTime: "Next available: Tomorrow",
    },
  ];

  const quickActions = [
    { label: "Reset Password", action: () => console.log("Reset password") },
    { label: "Update Payment Method", action: () => console.log("Update payment") },
    { label: "Download Tax Documents", action: () => console.log("Download docs") },
    { label: "Request Account Closure", action: () => console.log("Close account") },
  ];

  return (
    <ProtectedRoute allowedRoles={["user", "agent", "admin"]}>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Support Center</h1>
            <p className="text-muted-foreground">
              Get help, track your tickets, and explore resources
            </p>
          </div>

          {/* Quick Support Options */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${!option.available ? 'opacity-60' : ''}`}
                  onClick={option.available ? option.action : undefined}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                      option.available ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`w-6 h-6 ${option.available ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <h3 className="font-semibold mb-1">{option.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {option.description}
                    </p>
                    <Badge 
                      variant={option.available ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {option.responseTime}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="tickets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                My Tickets
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Support Tickets */}
            <TabsContent value="tickets" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Support Tickets</CardTitle>
                    <Button onClick={() => setIsTicketModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Ticket
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <TicketList refreshKey={ticketRefreshKey} />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start"
                        onClick={action.action}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Knowledge Base / FAQ */}
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedFAQSearch
                    faqs={mockFAQs}
                    onFAQSelect={(faq) => console.log("Selected FAQ:", faq)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements">
              <AchievementsList />
            </TabsContent>

            {/* Resources */}
            <TabsContent value="resources" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Video Tutorials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <h4 className="font-medium">Getting Started Guide</h4>
                      <p className="text-sm text-muted-foreground">5:30 minutes</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <h4 className="font-medium">Document Upload Tutorial</h4>
                      <p className="text-sm text-muted-foreground">3:15 minutes</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <h4 className="font-medium">Understanding Your Credit Report</h4>
                      <p className="text-sm text-muted-foreground">8:45 minutes</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Guides & Articles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <h4 className="font-medium">Credit Repair Best Practices</h4>
                      <p className="text-sm text-muted-foreground">Complete guide to improving your score</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <h4 className="font-medium">Tax Deduction Checklist</h4>
                      <p className="text-sm text-muted-foreground">Don't miss these common deductions</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <h4 className="font-medium">Dispute Letter Templates</h4>
                      <p className="text-sm text-muted-foreground">Professional templates you can use</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Need Personal Assistance?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Business Hours</h4>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Mon-Fri: 8AM - 8PM EST</p>
                        <p>Sat: 9AM - 5PM EST</p>
                        <p>Sun: Closed</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Phone: (555) 123-4567</p>
                        <p>Email: support@creditfixpro.com</p>
                        <p>Emergency: (555) 123-4568</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Response Times</h4>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Chat: &lt; 2 minutes</p>
                        <p>Email: &lt; 4 hours</p>
                        <p>Phone: Immediate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Support Ticket Modal */}
        <SupportTicket
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          onSubmit={() => {
            setTicketRefreshKey((prev) => prev + 1);
          }}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Support;
