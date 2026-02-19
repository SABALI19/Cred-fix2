import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
  options?: string[];
}

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => void;
  selectOption: (option: string) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const openChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      // Send initial welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "bot",
        message:
          "Hi! I'm your CreditFix Pro assistant. How can I help you today?",
        timestamp: new Date(),
        options: [
          "How does credit repair work?",
          "Tell me about tax filing services",
          "What are your pricing plans?",
          "How long does it take to see results?",
          "What's included in the service?",
          "Talk to a human agent",
        ],
      };
      setMessages([welcomeMessage]);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const getBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();

    let response = "";
    let options: string[] = [];

    if (
      lowerMessage.includes("credit repair") ||
      lowerMessage.includes("how does it work")
    ) {
      response =
        "Credit repair works by identifying and disputing inaccurate, outdated, or unverifiable items on your credit reports. Our certified specialists review your reports from all three bureaus (Experian, Equifax, and TransUnion) and challenge negative items that shouldn't be there.";
      options = [
        "What's your success rate?",
        "How much does it cost?",
        "How long does it take?",
      ];
    } else if (
      lowerMessage.includes("tax") ||
      lowerMessage.includes("filing") ||
      lowerMessage.includes("refund") ||
      lowerMessage.includes("irs")
    ) {
      response =
        "Our tax filing services include:\n\n✓ Professional tax preparation and filing\n✓ Maximum refund optimization\n✓ Year-round tax planning\n✓ Tax audit protection\n✓ IRS correspondence handling\n✓ Prior year amendments\n\nTax Filing Pricing:\n• Basic Plan: Tax consultation included\n• Professional Plan: Full tax filing service\n• Premium Plan: Complete tax services + audit protection\n\nWe help maximize your refunds while ensuring compliance with all tax laws.";
      options = [
        "What are the exact tax prices?",
        "How do you maximize refunds?",
        "Do you handle business taxes?",
      ];
    } else if (
      lowerMessage.includes("pricing") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("price")
    ) {
      response =
        "We offer three comprehensive plans:\n\n• Basic: $89/month - Credit repair + tax consultation\n• Professional: $149/month - Credit repair + professional tax filing\n• Premium: $299/month - Full credit & tax services + audit protection\n\nAll plans include 24/7 monitoring and monthly progress reports.";
      options = [
        "Start with Basic plan",
        "Tell me about Professional",
        "What's included in Premium?",
      ];
    } else if (
      lowerMessage.includes("how long") ||
      lowerMessage.includes("results") ||
      lowerMessage.includes("time")
    ) {
      response =
        "Most clients see improvements within 30-60 days, with significant results typically achieved in 3-6 months. Our average client sees a 130+ point increase in their credit score. Results vary based on your unique situation.";
      options = [
        "What's your success rate?",
        "View pricing plans",
        "See client testimonials",
      ];
    } else if (
      lowerMessage.includes("success rate") ||
      lowerMessage.includes("effective")
    ) {
      response =
        "We have a 98% success rate in removing inaccurate items from credit reports. Our clients see an average credit score increase of 130+ points, and 94% of our clients are satisfied with their results.";
      options = [
        "How does the process work?",
        "What are the pricing plans?",
        "Talk to an agent",
      ];
    } else if (
      lowerMessage.includes("included") ||
      lowerMessage.includes("service") ||
      lowerMessage.includes("features")
    ) {
      response =
        "Our comprehensive services include:\n\n✓ Credit report analysis from all 3 bureaus\n✓ Dispute letter preparation and submission\n✓ 24/7 credit monitoring\n✓ Professional tax preparation and filing\n✓ Tax refund optimization\n✓ Monthly progress reports\n✓ Personal credit & tax coaching\n✓ Score improvement strategies\n✓ Dedicated support team";
      options = [
        "How much does this cost?",
        "Tell me about tax services",
        "How do I get started?",
        "Speak with an expert",
      ];
    } else if (
      lowerMessage.includes("human") ||
      lowerMessage.includes("agent") ||
      lowerMessage.includes("speak") ||
      lowerMessage.includes("talk")
    ) {
      response =
        "I'd be happy to connect you with one of our credit repair specialists! They can provide personalized advice and answer any specific questions about your situation.";
      options = [
        "Schedule a free consultation",
        "Call us now",
        "Continue with chatbot",
      ];
    } else if (
      lowerMessage.includes("professional plan") ||
      lowerMessage.includes("tell me about professional")
    ) {
      response =
        "PROFESSIONAL PLAN ($149/month) - Our most popular choice!\n\n🔧 Credit Repair Services:\n• Advanced dispute strategies\n• Credit coaching calls\n• Goodwill letters\n• Score simulator\n• Priority support\n\n💼 Tax Services Included:\n• Complete tax preparation and filing\n• Federal and state returns\n• Refund optimization strategies\n• Tax planning advice\n\nPerfect for most people wanting comprehensive financial services!";
      options = [
        "Sign up for Professional",
        "Compare to other plans",
        "What's the success rate?",
      ];
    } else if (
      lowerMessage.includes("premium") ||
      lowerMessage.includes("what's included in premium")
    ) {
      response =
        "PREMIUM PLAN ($299/month) - Complete financial transformation!\n\n⚖️ Credit Repair (Everything in Professional PLUS):\n• Attorney review of disputes\n• Debt validation services\n• Credit building guidance\n• Identity monitoring\n\n🛡️ Advanced Tax Services:\n• Full-service tax preparation\n• Tax audit protection ($2,000 value!)\n• Year-round tax planning\n• IRS representation\n• Prior year amendment reviews\n\n📞 24/7 phone support for everything!";
      options = [
        "Start Premium Plan",
        "What's audit protection worth?",
        "Schedule expert consultation",
      ];
    } else if (
      lowerMessage.includes("start") ||
      lowerMessage.includes("sign up") ||
      lowerMessage.includes("begin")
    ) {
      response =
        "Great! Getting started is easy:\n\n1. Sign up for your free account\n2. We'll pull your credit reports\n3. Our specialists analyze your reports\n4. We create your personalized action plan\n5. Start disputing negative items\n6. Begin tax optimization planning\n\nChoose your plan level and we'll get started immediately!";
      options = [
        "Sign up for Basic ($89)",
        "Choose Professional ($149)",
        "Go Premium ($299)",
      ];
    } else if (
      lowerMessage.includes("free") ||
      lowerMessage.includes("consultation") ||
      lowerMessage.includes("analysis")
    ) {
      response =
        "Yes! We offer a completely free credit analysis where we review your credit reports and identify items that can be disputed. This includes a personalized action plan with no obligation.";
      options = [
        "Get free analysis",
        "View pricing after",
        "Talk to specialist",
      ];
    } else if (
      lowerMessage.includes("exact tax prices") ||
      lowerMessage.includes("tax cost") ||
      lowerMessage.includes("tax pricing")
    ) {
      response =
        "Here are our detailed tax filing prices:\n\n💰 BASIC PLAN ($89/month):\n• Tax consultation and advice\n• Basic filing assistance\n\n💰 PROFESSIONAL PLAN ($149/month):\n• Complete tax preparation and filing\n• Refund optimization strategies\n• Federal and state returns\n\n💰 PREMIUM PLAN ($299/month):\n• Everything in Professional\n• Tax audit protection ($2,000 value)\n• Year-round tax planning\n• Prior year amendments\n• IRS representation\n\nAll plans include our credit repair services too!";
      options = [
        "Start with Professional Plan",
        "What's audit protection?",
        "Compare all plan features",
      ];
    } else if (
      lowerMessage.includes("maximize refunds") ||
      lowerMessage.includes("bigger refund")
    ) {
      response =
        "We maximize your tax refunds through:\n\n🔍 Comprehensive Deduction Review:\n• Find overlooked deductions\n• Claim all eligible credits\n• Review previous years for amendments\n\n📊 Advanced Strategies:\n• Income optimization timing\n• Retirement contribution planning\n• Charitable giving strategies\n• Business expense optimization\n\nOur clients typically get $1,500-$3,500 more than self-filing!";
      options = [
        "How much more can I get?",
        "What deductions do people miss?",
        "Sign up for tax service",
      ];
    } else if (
      lowerMessage.includes("business taxes") ||
      lowerMessage.includes("self employed")
    ) {
      response =
        "Yes! We handle all types of tax situations:\n\n🏢 Business Taxes:\n• LLC, Corporation, Partnership returns\n• Quarterly estimated payments\n• Business expense optimization\n• Payroll tax compliance\n\n👨‍💼 Self-Employed:\n• Schedule C preparation\n• Home office deductions\n• Vehicle expense tracking\n• Self-employment tax minimization\n\n📈 Investment Taxes:\n• Capital gains/losses\n• Cryptocurrency transactions\n• Rental property income\n\nPricing starts at $149/month for comprehensive business support.";
      options = [
        "Get business tax quote",
        "What business deductions apply?",
        "Schedule consultation",
      ];
    } else if (
      lowerMessage.includes("guarantee") ||
      lowerMessage.includes("money back")
    ) {
      response =
        "We're confident in our service! If we can't remove any items from your credit report within 120 days, we'll refund your money. Plus, you can cancel anytime with 30 days notice.";
      options = [
        "What's your success rate?",
        "How do I get started?",
        "Read client reviews",
      ];
    } else if (
      lowerMessage.includes("compare") ||
      lowerMessage.includes("plan features") ||
      lowerMessage.includes("which plan")
    ) {
      response =
        "Here's a quick comparison:\n\n💡 BASIC ($89/month):\n• Credit repair basics + tax consultation\n\n⭐ PROFESSIONAL ($149/month):\n• Full credit repair + complete tax filing\n• Most popular choice!\n\n🏆 PREMIUM ($299/month):\n• Everything + audit protection + attorney review\n\nMost clients choose Professional for the best value. Which sounds right for your situation?";
      options = [
        "Professional sounds good",
        "I need Premium features",
        "Basic is enough for now",
      ];
    } else if (
      lowerMessage.includes("audit protection") ||
      lowerMessage.includes("what's audit protection")
    ) {
      response =
        "Audit Protection is HUGE value! 🛡️\n\n• Worth $2,000+ if you need it\n• Full IRS representation if audited\n• Professional handling of all paperwork\n• Peace of mind knowing experts have your back\n• Included FREE in Premium plan\n\nAudits are stressful and expensive to handle alone. Having professional representation can save you thousands in penalties and fees!";
      options = [
        "Sign up for Premium",
        "How often do audits happen?",
        "What triggers an audit?",
      ];
    } else {
      response =
        "I understand you're looking for information about our credit repair and tax services. Let me help you find what you need! What would you like to know more about?";
      options = [
        "How credit repair works",
        "Tax filing services",
        "Pricing and plans",
        "Success rates and results",
        "Talk to a specialist",
      ];
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      message: response,
      timestamp: new Date(),
      options: options,
    };
  };

  const sendMessage = (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const selectOption = (option: string) => {
    sendMessage(option);
  };

  const value: ChatbotContextType = {
    isOpen,
    messages,
    isTyping,
    openChat,
    closeChat,
    sendMessage,
    selectOption,
  };

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
};
