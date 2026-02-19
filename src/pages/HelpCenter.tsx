import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  HelpCircle,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Video,
  Book,
  Users,
  Zap,
  Shield,
  Calculator,
  CreditCard,
  Send,
  Ticket,
} from "lucide-react";
import { supportTicketService } from "@/services/supportTicketService";

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
    email: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketError, setTicketError] = useState("");

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      available: true,
    },
    {
      icon: Phone,
      title: "Call Support",
      description: "Speak with an expert",
      action: "(555) 123-4567",
      available: true,
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed help via email",
      action: "Send Email",
      available: true,
    },
    {
      icon: Video,
      title: "Video Call",
      description: "Screen sharing consultation",
      action: "Schedule Call",
      available: false,
    },
  ];

  const helpCategories = [
    {
      icon: CreditCard,
      title: "Credit Repair",
      description: "Credit scores, disputes, and monitoring",
      articles: 15,
      color: "bg-blue-500",
    },
    {
      icon: Calculator,
      title: "Tax Services",
      description: "Filing, deductions, and IRS issues",
      articles: 12,
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "Account Management",
      description: "Billing, plans, and account settings",
      articles: 8,
      color: "bg-purple-500",
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Data protection and account security",
      articles: 6,
      color: "bg-orange-500",
    },
  ];

  const popularArticles = [
    {
      title: "How long does credit repair take?",
      category: "Credit Repair",
      views: 2847,
      helpful: 94,
    },
    {
      title: "What documents do I need for tax filing?",
      category: "Tax Services",
      views: 2156,
      helpful: 89,
    },
    {
      title: "How to change my billing information",
      category: "Account Management",
      views: 1923,
      helpful: 96,
    },
    {
      title: "Understanding your credit report",
      category: "Credit Repair",
      views: 1784,
      helpful: 91,
    },
    {
      title: "Canceling or changing your plan",
      category: "Account Management",
      views: 1567,
      helpful: 88,
    },
  ];

  const videoTutorials = [
    {
      title: "Getting Started with CreditFix Pro",
      duration: "3:45",
      thumbnail: "/api/placeholder/200/120",
      category: "Getting Started",
    },
    {
      title: "Reading Your Credit Report",
      duration: "5:20",
      thumbnail: "/api/placeholder/200/120",
      category: "Credit Repair",
    },
    {
      title: "Tax Document Organization Tips",
      duration: "4:15",
      thumbnail: "/api/placeholder/200/120",
      category: "Tax Services",
    },
    {
      title: "Monitoring Your Progress",
      duration: "2:30",
      thumbnail: "/api/placeholder/200/120",
      category: "Account Management",
    },
  ];

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTicketError("");

    try {
      await supportTicketService.create({
        name: ticketForm.name,
        email: ticketForm.email,
        subject: ticketForm.subject,
        description: ticketForm.description,
        category: ticketForm.category || "other",
        priority: (ticketForm.priority as "low" | "medium" | "high" | "urgent") || "medium",
      });

      setIsSubmitting(false);
      setTicketSubmitted(true);
      setTicketForm({
        subject: "",
        category: "",
        priority: "",
        description: "",
        email: "",
        name: "",
      });
    } catch (_error) {
      setIsSubmitting(false);
      setTicketError("Failed to submit ticket. Please try again.");
    }
  };

  const updateTicketForm = (field: string, value: string) => {
    setTicketForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Help{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Center
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers, get support, and learn how to make the most of our
              services
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for help articles, guides, or FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Get Immediate Help</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    !action.available ? "opacity-50" : ""
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {action.description}
                    </p>
                    <Button
                      size="sm"
                      variant={action.available ? "default" : "secondary"}
                      disabled={!action.available}
                      className="w-full"
                    >
                      {action.action}
                    </Button>
                    {!action.available && (
                      <Badge variant="secondary" className="mt-2">
                        Coming Soon
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <Tabs defaultValue="browse" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Help</TabsTrigger>
            <TabsTrigger value="popular">Popular Articles</TabsTrigger>
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
          </TabsList>

          {/* Browse Help */}
          <TabsContent value="browse">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {helpCategories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-lg transition-all"
                      >
                        <CardContent className="p-6 text-center">
                          <div
                            className={`${category.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-semibold mb-2">
                            {category.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {category.description}
                          </p>
                          <Badge variant="secondary">
                            {category.articles} articles
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              {/* FAQ Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="faq-1">
                        <AccordionTrigger>
                          How do I track my credit repair progress?
                        </AccordionTrigger>
                        <AccordionContent>
                          You can track your progress through your dashboard,
                          which shows real-time updates on disputes, score
                          changes, and removed items. You'll also receive
                          monthly progress reports via email.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faq-2">
                        <AccordionTrigger>
                          What happens if I'm not satisfied with the service?
                        </AccordionTrigger>
                        <AccordionContent>
                          We offer a 30-day money-back guarantee. If you're not
                          satisfied with our service within the first 30 days,
                          you can cancel for a full refund.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faq-3">
                        <AccordionTrigger>
                          Can I upgrade or downgrade my plan?
                        </AccordionTrigger>
                        <AccordionContent>
                          Yes, you can change your plan at any time through your
                          account settings or by contacting our support team.
                          Changes take effect on your next billing cycle.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faq-4">
                        <AccordionTrigger>
                          How secure is my personal information?
                        </AccordionTrigger>
                        <AccordionContent>
                          We use bank-level 256-bit SSL encryption and follow
                          strict privacy policies. Your information is never
                          shared with unauthorized parties and is stored in
                          secure, SOC 2 compliant data centers.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </section>
            </div>
          </TabsContent>

          {/* Popular Articles */}
          <TabsContent value="popular">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Most Popular Articles</h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <Badge variant="secondary">
                              {article.category}
                            </Badge>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {article.views} views
                            </span>
                            <span className="flex items-center">
                              <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                              {article.helpful}% helpful
                            </span>
                          </div>
                        </div>
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Video Tutorials */}
          <TabsContent value="videos">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Video Tutorials</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoTutorials.map((video, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                      <Badge className="absolute bottom-2 right-2 bg-black/80">
                        {video.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {video.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Submit Ticket */}
          <TabsContent value="ticket">
            <div className="max-w-2xl mx-auto">
              {ticketSubmitted ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">
                      Ticket Submitted!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Your support ticket has been submitted successfully. Our
                      team will get back to you within 24 hours.
                    </p>
                    <div className="bg-muted rounded-lg p-4 mb-6">
                      <p className="text-sm font-medium">
                        Ticket ID: #CF{Date.now().toString().slice(-6)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Save this ID for future reference
                      </p>
                    </div>
                    <Button onClick={() => setTicketSubmitted(false)}>
                      Submit Another Ticket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Ticket className="w-5 h-5 mr-2" />
                      Submit a Support Ticket
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTicketSubmit} className="space-y-6">
                      {ticketError && (
                        <p className="text-sm text-destructive">{ticketError}</p>
                      )}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={ticketForm.name}
                            onChange={(e) =>
                              updateTicketForm("name", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={ticketForm.email}
                            onChange={(e) =>
                              updateTicketForm("email", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={ticketForm.subject}
                          onChange={(e) =>
                            updateTicketForm("subject", e.target.value)
                          }
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={ticketForm.category}
                            onValueChange={(value) =>
                              updateTicketForm("category", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="credit-repair">
                                Credit Repair
                              </SelectItem>
                              <SelectItem value="tax-services">
                                Tax Services
                              </SelectItem>
                              <SelectItem value="billing">
                                Billing & Payments
                              </SelectItem>
                              <SelectItem value="technical">
                                Technical Support
                              </SelectItem>
                              <SelectItem value="account">
                                Account Management
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={ticketForm.priority}
                            onValueChange={(value) =>
                              updateTicketForm("priority", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">
                                Low - General question
                              </SelectItem>
                              <SelectItem value="medium">
                                Medium - Issue affecting service
                              </SelectItem>
                              <SelectItem value="high">
                                High - Service unavailable
                              </SelectItem>
                              <SelectItem value="urgent">
                                Urgent - Critical issue
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={ticketForm.description}
                          onChange={(e) =>
                            updateTicketForm("description", e.target.value)
                          }
                          placeholder="Please provide detailed information about your issue..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Ticket
                          </>
                        )}
                      </Button>

                      <div className="text-center text-sm text-muted-foreground">
                        <p>
                          Expected response time: 24 hours for standard issues,
                          4 hours for urgent issues
                        </p>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
