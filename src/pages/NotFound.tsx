import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  ArrowLeft,
  Search,
  Phone,
  Mail,
  HelpCircle,
  MapPin,
  Clock,
} from "lucide-react";
import { useState } from "react";

const NotFound = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/help-center?search=${encodeURIComponent(
        searchTerm,
      )}`;
    }
  };

  const quickLinks = [
    { label: "Credit Repair Services", href: "/" },
    { label: "Tax Filing Services", href: "/" },
    { label: "Pricing Plans", href: "/" },
    { label: "Book Consultation", href: "/booking" },
    { label: "Help Center", href: "/help-center" },
    { label: "Contact Us", href: "/contact" },
    { label: "About Us", href: "/about" },
    { label: "FAQ", href: "/faq" },
  ];

  const supportOptions = [
    {
      icon: Phone,
      title: "Call Support",
      description: "(555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@creditfixpro.com",
      action: "mailto:support@creditfixpro.com",
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Browse articles and guides",
      action: "/help-center",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main 404 Content */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-8xl lg:text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                404
              </h1>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Page Not Found
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The page you're looking for doesn't exist or has been moved.
                Don't worry, we're here to help you find what you need.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button onClick={() => window.history.back()} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => (window.location.href = "/")}>
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Search */}
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Search for what you need</h3>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search help articles, services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Popular Pages
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => (window.location.href = link.href)}
                >
                  <CardContent className="p-4 text-center">
                    <p className="font-medium">{link.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Support Options */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Need Help? Contact Support
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => {
                      if (option.action.startsWith("/")) {
                        window.location.href = option.action;
                      } else {
                        window.open(option.action);
                      }
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">{option.title}</h3>
                      <p className="text-muted-foreground">
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Did You Know */}
          <section>
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Did You Know?</h2>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Average 45-day credit improvement</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>50,000+ clients nationwide</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
                <Button
                  className="mt-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  onClick={() => (window.location.href = "/about")}
                >
                  Learn More About Us
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
