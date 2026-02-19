import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  Award,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Languages,
  Trophy,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AnimatedContainer,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  PageTransition,
} from "@/components/animations/AnimatedComponents";

const specialists = [
  {
    id: "1",
    name: "Sarah Mitchell",
    title: "Senior Credit Repair Specialist",
    specialization: "Credit Restoration",
    experience: "8+ Years",
    rating: 4.9,
    clientsHelped: 1250,
    successRate: 96,
    location: "New York, NY",
    avatar: "/placeholder.svg",
    bio: "Sarah is a certified credit counselor with over 8 years of experience helping clients rebuild their credit scores. She specializes in complex credit repair cases and has helped over 1,250 clients achieve their financial goals.",
    credentials: [
      "Certified Credit Counselor (NACC)",
      "FICO Score Professional Certification",
      "Credit Repair Organizations Act Specialist",
      "Fair Credit Reporting Act Expert",
    ],
    achievements: [
      "Achieved 720+ credit scores for 85% of clients",
      "Removed over 15,000 negative items from credit reports",
      "Featured in Credit Repair Weekly Magazine",
      "Maintained 98% client satisfaction rate",
    ],
    languages: ["English", "Spanish"],
    availability: "Available Today",
    email: "sarah.mitchell@creditfixpro.com",
    phone: "+1 (555) 123-0001",
    category: "credit",
    avgScoreImprovement: 145,
    avgCaseTime: "4-6 months",
    nextAvailable: "Today 2:00 PM",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    title: "Tax Preparation Expert",
    specialization: "Tax Optimization",
    experience: "12+ Years",
    rating: 4.8,
    clientsHelped: 2100,
    successRate: 94,
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg",
    bio: "Michael is a licensed tax professional and CPA with over 12 years of experience in tax preparation and planning. He specializes in maximizing refunds and has helped clients save over $2.5 million in taxes.",
    credentials: [
      "Certified Public Accountant (CPA)",
      "IRS Enrolled Agent",
      "Tax Resolution Specialist",
      "QuickBooks ProAdvisor Certified",
    ],
    achievements: [
      "Increased average client refunds by $2,400",
      "Successfully resolved 150+ IRS audit cases",
      "Saved clients over $2.5M in tax liabilities",
      "Maintains 99% audit success rate",
    ],
    languages: ["English", "Spanish", "Portuguese"],
    availability: "Available Tomorrow",
    email: "michael.rodriguez@creditfixpro.com",
    phone: "+1 (555) 123-0002",
    category: "tax",
    avgRefundIncrease: "$2,400",
    avgCaseTime: "2-4 weeks",
    nextAvailable: "Tomorrow 10:00 AM",
  },
  {
    id: "3",
    name: "Jennifer Chen",
    title: "Financial Planning Advisor",
    specialization: "Wealth Building",
    experience: "10+ Years",
    rating: 4.9,
    clientsHelped: 890,
    successRate: 92,
    location: "Chicago, IL",
    avatar: "/placeholder.svg",
    bio: "Jennifer is a Certified Financial Planner with a decade of experience helping clients build wealth and achieve financial independence. She combines credit repair strategies with comprehensive financial planning.",
    credentials: [
      "Certified Financial Planner (CFP)",
      "Chartered Financial Consultant (ChFC)",
      "Retirement Income Certified Professional",
      "Investment Advisor Representative",
    ],
    achievements: [
      "Helped clients build $89M in combined wealth",
      "Average client net worth increase of $125,000",
      "Published author on financial literacy",
      "Winner of 2023 Financial Advisor Excellence Award",
    ],
    languages: ["English", "Mandarin", "Cantonese"],
    availability: "Available Today",
    email: "jennifer.chen@creditfixpro.com",
    phone: "+1 (555) 123-0003",
    category: "financial",
    avgWealthIncrease: "$125,000",
    avgCaseTime: "6-12 months",
    nextAvailable: "Today 4:00 PM",
  },
  {
    id: "4",
    name: "David Thompson",
    title: "Business Credit Specialist",
    specialization: "Business Finance",
    experience: "15+ Years",
    rating: 4.7,
    clientsHelped: 650,
    successRate: 91,
    location: "Dallas, TX",
    avatar: "/placeholder.svg",
    bio: "David specializes in business credit and financing solutions for entrepreneurs and small business owners. With 15 years of experience in commercial finance, he has helped businesses secure over $45 million in funding.",
    credentials: [
      "Certified Business Credit Professional",
      "SBA Lending Specialist",
      "Commercial Finance Consultant",
      "Business Valuation Certification",
    ],
    achievements: [
      "Secured $45M+ in business funding for clients",
      "Established business credit for 500+ companies",
      "Average business credit score improvement of 180 points",
      "Keynote speaker at National Small Business Conference",
    ],
    languages: ["English", "French"],
    availability: "Available in 2 hours",
    email: "david.thompson@creditfixpro.com",
    phone: "+1 (555) 123-0004",
    category: "business",
    avgFundingSecured: "$69,000",
    avgCaseTime: "3-8 months",
    nextAvailable: "Today 6:00 PM",
  },
  {
    id: "5",
    name: "Amanda Williams",
    title: "Credit Dispute Specialist",
    specialization: "Dispute Resolution",
    experience: "6+ Years",
    rating: 4.8,
    clientsHelped: 975,
    successRate: 97,
    location: "Atlanta, GA",
    avatar: "/placeholder.svg",
    bio: "Amanda specializes in aggressive dispute resolution and has one of the highest success rates in removing negative items from credit reports. With 6 years of focused experience in credit disputes.",
    credentials: [
      "Advanced Credit Dispute Certification",
      "Consumer Protection Law Specialist",
      "Credit Repair Organizations Act Expert",
      "Fair Debt Collection Practices Specialist",
    ],
    achievements: [
      "97% success rate in dispute resolutions",
      "Removed 98% of inaccurate negative items",
      "Average credit score increase of 145 points",
      "Featured expert on Credit Repair Today podcast",
    ],
    languages: ["English", "French"],
    availability: "Available Today",
    email: "amanda.williams@creditfixpro.com",
    phone: "+1 (555) 123-0005",
    category: "credit",
    avgScoreImprovement: 145,
    avgCaseTime: "3-5 months",
    nextAvailable: "Today 1:00 PM",
  },
  {
    id: "6",
    name: "Maria Gonzalez",
    title: "Credit Counseling Expert",
    specialization: "Credit Education",
    experience: "9+ Years",
    rating: 4.9,
    clientsHelped: 1340,
    successRate: 95,
    location: "Phoenix, AZ",
    avatar: "/placeholder.svg",
    bio: "Maria combines credit repair with comprehensive financial education to help clients not only improve their scores but maintain them long-term. As a bilingual certified credit counselor with 9 years of experience.",
    credentials: [
      "Certified Credit Counselor (NFCC)",
      "HUD-Approved Housing Counselor",
      "Financial Literacy Instructor Certification",
      "Debt Management Specialist",
    ],
    achievements: [
      "Maintained 95% client score improvements after 2 years",
      "Conducted 200+ financial literacy workshops",
      "Author of 'Credit Repair Made Simple' guide",
      "2022 Outstanding Credit Counselor Award winner",
    ],
    languages: ["English", "Spanish", "Italian"],
    availability: "Available Tomorrow",
    email: "maria.gonzalez@creditfixpro.com",
    phone: "+1 (555) 123-0006",
    category: "credit",
    avgScoreImprovement: 132,
    avgCaseTime: "4-7 months",
    nextAvailable: "Tomorrow 9:00 AM",
  },
  {
    id: "7",
    name: "Robert Kim",
    title: "Identity Theft Recovery Specialist",
    specialization: "Identity Protection",
    experience: "11+ Years",
    rating: 4.7,
    clientsHelped: 820,
    successRate: 93,
    location: "Seattle, WA",
    avatar: "/placeholder.svg",
    bio: "Robert specializes in complex identity theft cases and credit restoration after fraud. With over 11 years of experience in fraud recovery and identity protection.",
    credentials: [
      "Certified Identity Theft Risk Management Specialist",
      "Fraud Investigation Certification",
      "Privacy Protection Professional",
      "Cybersecurity Fundamentals Certified",
    ],
    achievements: [
      "Successfully resolved 93% of identity theft cases",
      "Recovered average of $45,000 in fraudulent charges per client",
      "Restored credit scores to pre-theft levels in 85% of cases",
      "Guest lecturer at Identity Theft Prevention seminars",
    ],
    languages: ["English", "Korean", "Japanese"],
    availability: "Available in 3 hours",
    email: "robert.kim@creditfixpro.com",
    phone: "+1 (555) 123-0007",
    category: "security",
    avgRecovery: "$45,000",
    avgCaseTime: "2-6 months",
    nextAvailable: "Today 8:00 PM",
  },
];

const Specialists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");

  const filteredSpecialists = specialists
    .filter((specialist) => {
      const matchesSearch =
        specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialist.specialization
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || specialist.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return parseInt(b.experience) - parseInt(a.experience);
        case "clients":
          return b.clientsHelped - a.clientsHelped;
        case "success":
          return b.successRate - a.successRate;
        default:
          return 0;
      }
    });

  const categories = [
    { value: "all", label: "All Specialists", count: specialists.length },
    {
      value: "credit",
      label: "Credit Repair",
      count: specialists.filter((s) => s.category === "credit").length,
    },
    {
      value: "tax",
      label: "Tax Services",
      count: specialists.filter((s) => s.category === "tax").length,
    },
    {
      value: "financial",
      label: "Financial Planning",
      count: specialists.filter((s) => s.category === "financial").length,
    },
    {
      value: "business",
      label: "Business Credit",
      count: specialists.filter((s) => s.category === "business").length,
    },
    {
      value: "security",
      label: "Identity Protection",
      count: specialists.filter((s) => s.category === "security").length,
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="text-center mb-6 sm:mb-8 px-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Our{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Expert Specialists
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Compare and choose from our team of certified financial
                specialists. Each expert brings unique skills and proven results
                to help you achieve your financial goals.
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search specialists by name, title, or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="experience">
                        Most Experienced
                      </SelectItem>
                      <SelectItem value="clients">
                        Most Clients Helped
                      </SelectItem>
                      <SelectItem value="success">Success Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredSpecialists.length} of {specialists.length}{" "}
              specialists
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>

          {/* Specialists Grid/List */}
          {viewMode === "grid" ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredSpecialists.map((specialist) => (
                <StaggerItem key={specialist.id}>
                  <HoverCard>
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4 mb-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={specialist.avatar}
                              alt={specialist.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {specialist.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {specialist.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {specialist.title}
                            </p>
                            <div className="flex items-center space-x-2 mb-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-medium">
                                {specialist.rating}
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">
                                {specialist.experience}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">
                              {specialist.specialization}
                            </Badge>
                            <Badge variant="outline" className="text-green-600">
                              {specialist.successRate}% Success Rate
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">
                                Clients Helped
                              </div>
                              <div className="font-semibold">
                                {specialist.clientsHelped.toLocaleString()}+
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">
                                Location
                              </div>
                              <div className="font-semibold">
                                {specialist.location}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t space-y-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Next Available:
                              </span>
                              <span className="font-medium text-green-600">
                                {specialist.nextAvailable}
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button size="sm" className="flex-1" asChild>
                                <Link to="/booking">Book Consultation</Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="space-y-4 mb-12">
              {filteredSpecialists.map((specialist) => (
                <Card
                  key={specialist.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="w-20 h-20">
                          <AvatarImage
                            src={specialist.avatar}
                            alt={specialist.name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {specialist.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-xl">
                                {specialist.name}
                              </h3>
                              <p className="text-muted-foreground mb-2">
                                {specialist.title}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-medium">
                                {specialist.rating}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {specialist.bio}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="secondary">
                              {specialist.specialization}
                            </Badge>
                            <Badge variant="outline">
                              {specialist.experience}
                            </Badge>
                            <Badge variant="outline" className="text-green-600">
                              {specialist.successRate}% Success
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-80 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {specialist.clientsHelped.toLocaleString()}+
                            </div>
                            <div className="text-muted-foreground">
                              Clients Helped
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-accent">
                              {specialist.successRate}%
                            </div>
                            <div className="text-muted-foreground">
                              Success Rate
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Available:
                          </span>
                          <span className="font-medium text-green-600">
                            {specialist.nextAvailable}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button className="w-full" asChild>
                            <Link to="/booking">Book Consultation</Link>
                          </Button>
                          <Button variant="outline" className="w-full">
                            View Full Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Still Not Sure Which Specialist to Choose?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let us match you with the perfect specialist based on your
                specific needs and goals. Our matching algorithm considers your
                situation, preferences, and specialist availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  asChild
                >
                  <Link to="/booking">Get Matched with a Specialist</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/booking">Schedule Group Consultation</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Specialists;
