import AgentCard from "./AgentCard";
import { Users, Award, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AgentsSection = () => {
  const agents = [
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
      bio: "Sarah is a certified credit counselor with over 8 years of experience helping clients rebuild their credit scores. She specializes in complex credit repair cases and has helped over 1,250 clients achieve their financial goals. Sarah holds certifications from the National Association of Certified Credit Counselors and has a proven track record of removing 95% of inaccurate items from credit reports.",
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
      linkedin: "sarah-mitchell-credit",
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
      bio: "Michael is a licensed tax professional and CPA with over 12 years of experience in tax preparation and planning. He specializes in maximizing refunds and has helped clients save over $2.5 million in taxes. Michael stays current with all tax law changes and provides year-round tax planning services to ensure clients keep more of their hard-earned money.",
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
      linkedin: "michael-rodriguez-cpa",
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
      bio: "Jennifer is a Certified Financial Planner with a decade of experience helping clients build wealth and achieve financial independence. She combines credit repair strategies with comprehensive financial planning to help clients not just improve their credit, but create lasting financial success. Jennifer has helped clients increase their net worth by an average of $125,000.",
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
      linkedin: "jennifer-chen-cfp",
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
      bio: "David specializes in business credit and financing solutions for entrepreneurs and small business owners. With 15 years of experience in commercial finance, he has helped businesses secure over $45 million in funding. David understands the unique challenges businesses face and provides tailored strategies to build strong business credit profiles and access capital for growth.",
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
      linkedin: "david-thompson-business",
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
      bio: "Amanda specializes in aggressive dispute resolution and has one of the highest success rates in removing negative items from credit reports. With 6 years of focused experience in credit disputes, she has developed proven strategies for challenging even the most difficult negative marks. Amanda is certified in advanced dispute techniques and has helped nearly 1,000 clients achieve significant credit score improvements.",
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
      linkedin: "amanda-williams-disputes",
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
      bio: "Maria combines credit repair with comprehensive financial education to help clients not only improve their scores but maintain them long-term. As a bilingual certified credit counselor with 9 years of experience, she has helped over 1,300 clients understand credit fundamentals while achieving lasting improvements. Maria's holistic approach ensures clients develop healthy financial habits that prevent future credit issues.",
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
      linkedin: "maria-gonzalez-counselor",
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
      bio: "Robert specializes in complex identity theft cases and credit restoration after fraud. With over 11 years of experience in fraud recovery and identity protection, he has helped hundreds of clients rebuild their credit after identity theft incidents. Robert works closely with law enforcement and financial institutions to resolve fraud cases and restore clients' credit profiles to pre-theft conditions.",
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
      linkedin: "robert-kim-identity",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our certified specialists combine decades of experience to provide
            personalized credit repair, tax optimization, and financial planning
            services
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">40+</div>
            <div className="text-sm text-muted-foreground">
              Professional Certifications
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <div className="text-2xl font-bold text-accent">8,025+</div>
            <div className="text-sm text-muted-foreground">Clients Served</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">71+</div>
            <div className="text-sm text-muted-foreground">
              Years Combined Experience
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">95%</div>
            <div className="text-sm text-muted-foreground">
              Average Success Rate
            </div>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Work with Our Experts?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Schedule a free consultation with one of our specialists to discuss
            your financial goals and create a personalized action plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-block text-center"
            >
              Schedule Free Consultation
            </Link>
            <Link
              to="/specialists"
              className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-block text-center"
            >
              Compare All Specialists
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
