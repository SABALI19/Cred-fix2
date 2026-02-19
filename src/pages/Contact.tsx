import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { contactService } from "@/services/contactService";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await contactService.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (_error) {
      setIsSubmitting(false);
      setSubmitError("We could not send your message. Please try again.");
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      subtitle: "Speak with our experts",
      value: "(555) 123-4567",
      description: "Mon-Fri 8AM-8PM EST",
      action: "tel:+15551234567",
      color: "bg-blue-500",
    },
    {
      icon: Mail,
      title: "Email Us",
      subtitle: "Get detailed responses",
      value: "support@creditfixpro.com",
      description: "Response within 24 hours",
      action: "mailto:support@creditfixpro.com",
      color: "bg-green-500",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      subtitle: "Instant assistance",
      value: "Chat Now",
      description: "Available 24/7",
      action: "#",
      color: "bg-purple-500",
    },
    {
      icon: Calendar,
      title: "Book Meeting",
      subtitle: "Schedule consultation",
      value: "Schedule Call",
      description: "Free 30-min consultation",
      action: "/booking",
      color: "bg-orange-500",
    },
  ];

  const officeLocations = [
    {
      city: "New York",
      address: "123 Financial Street\nNew York, NY 10001",
      phone: "(555) 123-4567",
      hours: "Mon-Fri: 8AM-6PM",
    },
    {
      city: "Los Angeles",
      address: "456 Credit Avenue\nLos Angeles, CA 90210",
      phone: "(555) 234-5678",
      hours: "Mon-Fri: 9AM-7PM",
    },
    {
      city: "Chicago",
      address: "789 Finance Blvd\nChicago, IL 60601",
      phone: "(555) 345-6789",
      hours: "Mon-Fri: 8AM-6PM",
    },
  ];

  const faqs = [
    {
      question: "How long does the credit repair process take?",
      answer:
        "Most clients see improvements within 45-90 days, with significant results typically achieved within 3-6 months.",
    },
    {
      question: "Do you offer free consultations?",
      answer:
        "Yes! We offer free 30-minute consultations to review your credit report and discuss the best strategy for your situation.",
    },
    {
      question: "What if I'm not satisfied with the results?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied with our service, you'll receive a full refund.",
    },
    {
      question: "Do you handle business credit as well?",
      answer:
        "Absolutely! We provide both personal and business credit repair services, as well as business tax filing.",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="p-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for contacting us. Our team will get back to you
                within 24 hours.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Send Another Message
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

          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Get in{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about our services? Need help with your credit or
              taxes? We're here to help you every step of the way.
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    if (method.action.startsWith("#")) {
                      // Handle chat functionality
                      return;
                    }
                    if (method.action.startsWith("/")) {
                      window.location.href = method.action;
                    } else {
                      window.open(method.action);
                    }
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`${method.color} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {method.subtitle}
                    </p>
                    <p className="font-medium text-primary mb-1">
                      {method.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {method.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => updateField("subject", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-repair">
                        Credit Repair Services
                      </SelectItem>
                      <SelectItem value="tax-services">Tax Services</SelectItem>
                      <SelectItem value="billing">
                        Billing & Payments
                      </SelectItem>
                      <SelectItem value="technical">
                        Technical Support
                      </SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    rows={4}
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Office Locations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Our Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {officeLocations.map((office, index) => (
                    <div
                      key={index}
                      className="border-b last:border-b-0 pb-4 last:pb-0"
                    >
                      <h3 className="font-semibold text-primary mb-2">
                        {office.city}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="whitespace-pre-line">
                            {office.address}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{office.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{office.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick FAQs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Quick Answers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-2">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => (window.location.href = "/faq")}
                >
                  View All FAQs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Contact */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Need Urgent Help?</h2>
              <p className="text-muted-foreground mb-6">
                If you're facing an immediate financial emergency or need urgent
                assistance with your credit, don't wait.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={() => (window.location.href = "tel:+15551234567")}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Emergency Line: (555) 123-4567
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Contact;
