import type { AgentOption } from "@/services/authService";

export interface AgentProfile {
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
  canSelectForChat?: boolean;
}

export const MOCK_AGENT_PROFILES: Omit<AgentProfile, "id">[] = [
  {
    name: "Sarah Mitchell",
    title: "Senior Credit Repair Specialist",
    specialization: "Credit Restoration",
    experience: "8+ Years",
    rating: 4.9,
    clientsHelped: 1250,
    successRate: 96,
    location: "New York, NY",
    avatar: "/placeholder.svg",
    bio: "Sarah is a certified credit counselor focused on complex credit restoration and dispute strategy.",
    credentials: [
      "Certified Credit Counselor (NACC)",
      "FICO Score Professional Certification",
      "Credit Repair Organizations Act Specialist",
      "Fair Credit Reporting Act Expert",
    ],
    achievements: [
      "720+ scores achieved for 85% of clients",
      "Removed 15,000+ negative items",
      "98% client satisfaction",
    ],
    languages: ["English", "Spanish"],
    availability: "Available Today",
    email: "sarah.mitchell@creditfixpro.com",
    phone: "+1 (555) 123-0001",
    linkedin: "sarah-mitchell-credit",
  },
  {
    name: "Michael Rodriguez",
    title: "Tax Preparation Expert",
    specialization: "Tax Optimization",
    experience: "12+ Years",
    rating: 4.8,
    clientsHelped: 2100,
    successRate: 94,
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg",
    bio: "Michael is a CPA focused on refund optimization, tax planning, and IRS compliance support.",
    credentials: [
      "Certified Public Accountant (CPA)",
      "IRS Enrolled Agent",
      "Tax Resolution Specialist",
    ],
    achievements: [
      "Average refund increase: $2,400",
      "150+ IRS audit cases resolved",
      "$2.5M+ tax savings for clients",
    ],
    languages: ["English", "Spanish", "Portuguese"],
    availability: "Available Tomorrow",
    email: "michael.rodriguez@creditfixpro.com",
    phone: "+1 (555) 123-0002",
    linkedin: "michael-rodriguez-cpa",
  },
  {
    name: "Jennifer Chen",
    title: "Financial Planning Advisor",
    specialization: "Wealth Building",
    experience: "10+ Years",
    rating: 4.9,
    clientsHelped: 890,
    successRate: 92,
    location: "Chicago, IL",
    avatar: "/placeholder.svg",
    bio: "Jennifer combines credit improvement with long-term planning and wealth-building strategy.",
    credentials: [
      "Certified Financial Planner (CFP)",
      "Chartered Financial Consultant (ChFC)",
      "Investment Advisor Representative",
    ],
    achievements: [
      "$89M combined client wealth growth",
      "Average net-worth increase: $125,000",
      "2023 Financial Advisor Excellence Award",
    ],
    languages: ["English", "Mandarin", "Cantonese"],
    availability: "Available Today",
    email: "jennifer.chen@creditfixpro.com",
    phone: "+1 (555) 123-0003",
    linkedin: "jennifer-chen-cfp",
  },
  {
    name: "David Thompson",
    title: "Business Credit Specialist",
    specialization: "Business Finance",
    experience: "15+ Years",
    rating: 4.7,
    clientsHelped: 650,
    successRate: 91,
    location: "Dallas, TX",
    avatar: "/placeholder.svg",
    bio: "David helps founders build business credit and secure financing for growth initiatives.",
    credentials: [
      "Certified Business Credit Professional",
      "SBA Lending Specialist",
      "Commercial Finance Consultant",
    ],
    achievements: [
      "$45M+ funding secured for clients",
      "500+ companies onboarded to business credit",
      "Average business credit gain: 180 points",
    ],
    languages: ["English", "French"],
    availability: "Available in 2 hours",
    email: "david.thompson@creditfixpro.com",
    phone: "+1 (555) 123-0004",
    linkedin: "david-thompson-business",
  },
  {
    name: "Amanda Williams",
    title: "Credit Dispute Specialist",
    specialization: "Dispute Resolution",
    experience: "6+ Years",
    rating: 4.8,
    clientsHelped: 975,
    successRate: 97,
    location: "Atlanta, GA",
    avatar: "/placeholder.svg",
    bio: "Amanda specializes in difficult disputes and high-impact removal strategies.",
    credentials: [
      "Advanced Credit Dispute Certification",
      "Consumer Protection Law Specialist",
      "Fair Debt Collection Practices Specialist",
    ],
    achievements: [
      "97% dispute success rate",
      "Average score lift: 145 points",
      "Featured on Credit Repair Today",
    ],
    languages: ["English", "French"],
    availability: "Available Today",
    email: "amanda.williams@creditfixpro.com",
    phone: "+1 (555) 123-0005",
    linkedin: "amanda-williams-disputes",
  },
  {
    name: "Maria Gonzalez",
    title: "Credit Counseling Expert",
    specialization: "Credit Education",
    experience: "9+ Years",
    rating: 4.9,
    clientsHelped: 1340,
    successRate: 95,
    location: "Phoenix, AZ",
    avatar: "/placeholder.svg",
    bio: "Maria delivers bilingual credit education and sustainable score-improvement programs.",
    credentials: [
      "Certified Credit Counselor (NFCC)",
      "HUD-Approved Housing Counselor",
      "Financial Literacy Instructor Certification",
    ],
    achievements: [
      "95% long-term score retention",
      "200+ financial literacy workshops",
      "Outstanding Credit Counselor Award",
    ],
    languages: ["English", "Spanish", "Italian"],
    availability: "Available Tomorrow",
    email: "maria.gonzalez@creditfixpro.com",
    phone: "+1 (555) 123-0006",
    linkedin: "maria-gonzalez-counselor",
  },
  {
    name: "Robert Kim",
    title: "Identity Theft Recovery Specialist",
    specialization: "Identity Protection",
    experience: "11+ Years",
    rating: 4.7,
    clientsHelped: 820,
    successRate: 93,
    location: "Seattle, WA",
    avatar: "/placeholder.svg",
    bio: "Robert handles fraud recovery and identity theft remediation with end-to-end dispute support.",
    credentials: [
      "Certified Identity Theft Risk Management Specialist",
      "Fraud Investigation Certification",
      "Privacy Protection Professional",
    ],
    achievements: [
      "93% identity theft case resolution",
      "Average recovered fraud amount: $45,000",
      "85% restoration to pre-theft profile",
    ],
    languages: ["English", "Korean", "Japanese"],
    availability: "Available in 3 hours",
    email: "robert.kim@creditfixpro.com",
    phone: "+1 (555) 123-0007",
    linkedin: "robert-kim-identity",
  },
  {
    name: "Robert Kim",
    title: "Identity Theft Recovery Specialist",
    specialization: "Identity Protection",
    experience: "11+ Years",
    rating: 4.7,
    clientsHelped: 820,
    successRate: 93,
    location: "Seattle, WA",
    avatar: "/placeholder.svg",
    bio: "Robert handles fraud recovery and identity theft remediation with end-to-end dispute support.",
    credentials: [
      "Certified Identity Theft Risk Management Specialist",
      "Fraud Investigation Certification",
      "Privacy Protection Professional",
    ],
    achievements: [
      "93% identity theft case resolution",
      "Average recovered fraud amount: $45,000",
      "85% restoration to pre-theft profile",
    ],
    languages: ["English", "Korean", "Japanese"],
    availability: "Available in 3 hours",
    email: "robert.kim@creditfixpro.com",
    phone: "+1 (555) 123-0007",
    linkedin: "robert-kim-identity",
  },
];

export const fallbackProfileFromBackend = (agent: AgentOption): AgentProfile => ({
  id: agent._id,
  name: agent.name,
  title: "Credit Specialist",
  specialization: "Credit Support",
  experience: "5+ Years",
  rating: 4.8,
  clientsHelped: Math.max(agent.clientCount, 1),
  successRate: 92,
  location: "United States",
  avatar: agent.profilePhoto || "/placeholder.svg",
  bio: agent.bio || "Experienced specialist ready to help with your case.",
  credentials: ["Certified Financial Support Specialist"],
  achievements: ["Trusted by active clients"],
  languages: ["English"],
  availability: "Available Today",
  email: agent.email,
  phone: agent.phone || "",
  canSelectForChat: true,
});

export const buildPublicAgentProfiles = () =>
  MOCK_AGENT_PROFILES.map((profile, index) => ({
    ...profile,
    id: `mock-${index + 1}`,
    canSelectForChat: false,
  }));

export const buildMergedAgentProfiles = (agents: AgentOption[]) => {
  const mockByEmail = new Map(
    MOCK_AGENT_PROFILES.map((profile) => [profile.email.toLowerCase(), profile]),
  );

  const matchedProfiles = agents.map((agent) => {
    const matched = mockByEmail.get(agent.email.toLowerCase());
    if (!matched) {
      return fallbackProfileFromBackend(agent);
    }

    return {
      ...matched,
      id: agent._id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone || matched.phone,
      avatar: agent.profilePhoto || matched.avatar,
      bio: agent.bio || matched.bio,
      clientsHelped: Math.max(matched.clientsHelped, agent.clientCount),
      canSelectForChat: true,
    };
  });

  const matchedEmails = new Set(agents.map((agent) => agent.email.toLowerCase()));
  const hardcodedOnlyProfiles = MOCK_AGENT_PROFILES.filter(
    (profile) => !matchedEmails.has(profile.email.toLowerCase()),
  ).map((profile, index) => ({
    ...profile,
    id: `mock-user-${index + 1}`,
    canSelectForChat: false,
  }));

  return [...matchedProfiles, ...hardcodedOnlyProfiles];
};

const TAX_KEYWORDS = ["tax", "irs", "refund", "cpa", "enrolled agent"];

const isTaxFocused = (profile: AgentProfile) => {
  const searchable = [
    profile.title,
    profile.specialization,
    profile.bio,
    ...profile.credentials,
    ...profile.achievements,
  ]
    .join(" ")
    .toLowerCase();

  return TAX_KEYWORDS.some((keyword) => searchable.includes(keyword));
};

export const filterAgentProfilesByService = (
  profiles: AgentProfile[],
  service: string,
) => {
  if (service === "tax_services") {
    return profiles.filter((profile) => isTaxFocused(profile) || profile.canSelectForChat);
  }

  if (service === "credit_repair") {
    return profiles.filter((profile) => !isTaxFocused(profile) || profile.canSelectForChat);
  }

  return profiles;
};
