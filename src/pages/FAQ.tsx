import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  CreditCard,
  Calculator,
  Shield,
  DollarSign,
  Clock,
  Phone,
  MessageCircle,
} from "lucide-react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      id: "credit-repair",
      title: "Credit Repair",
      icon: CreditCard,
      color: "bg-blue-500",
      faqs: [
        {
          question: "How long does the credit repair process take?",
          answer:
            "Most clients see initial improvements within 45-90 days. Significant results typically occur within 3-6 months, depending on the complexity of your credit issues. We work diligently to remove negative items as quickly as possible while ensuring all disputes are thorough and legally compliant.",
        },
        {
          question: "What types of negative items can you remove?",
          answer:
            "We can help remove various negative items including: late payments, collections, charge-offs, bankruptcies (in certain circumstances), foreclosures, repossessions, tax liens, judgments, and inaccurate information. Our success depends on the legitimacy of the dispute and the creditor's ability to verify the information.",
        },
        {
          question: "Will credit repair hurt my credit score?",
          answer:
            "No, legitimate credit repair will not hurt your credit score. Our process involves disputing inaccurate, outdated, or unverifiable information. When negative items are removed, your score typically improves. We never recommend closing old accounts or taking actions that would negatively impact your credit.",
        },
        {
          question: "Can I repair my credit myself?",
          answer:
            "Yes, you have the right to dispute items on your credit report yourself. However, our expertise, proven strategies, and relationships with credit bureaus often lead to better and faster results. We also save you significant time and ensure all disputes are properly documented and legally compliant.",
        },
        {
          question: "Do you guarantee results?",
          answer:
            "While we cannot guarantee specific results due to the nature of credit reporting, we do offer a 30-day money-back guarantee. If you're not satisfied with our service, you can cancel within 30 days for a full refund. Our 98% success rate speaks to our effectiveness.",
        },
        {
          question: "How much will my credit score improve?",
          answer:
            "Score improvements vary based on your starting score and the types of negative items removed. On average, our clients see improvements of 100-150 points. Some see smaller improvements if they start with fewer negative items, while others see larger gains if they have many removable items.",
        },
        {
          question: "🧠 Can I use your service if I have bad credit?",
          answer:
            "Absolutely. Your credit score doesn't affect your ability to file taxes with us. In fact, we can help you repair your credit while optimizing your tax refund — all in one secure platform.",
        },
        {
          question: "📈 What credit repair services do you offer?",
          answer:
            "We help challenge inaccurate items on your credit report, guide you in building positive credit history, and provide financial coaching. Whether you're recovering from debt or preparing for a loan, we can help.",
        },
        {
          question: "What is dispute management?",
          answer:
            "Dispute management is the process of reviewing your credit reports for errors and contacting the credit bureaus or creditors to fix or remove inaccurate, outdated, or unverifiable items. This helps improve your credit report and potentially your credit score. We handle the entire process — from identifying the issue, preparing disputes, tracking responses, and ensuring corrections are made — in compliance with federal credit laws.",
        },
      ],
    },
    {
      id: "tax-services",
      title: "Tax Services",
      icon: Calculator,
      color: "bg-green-500",
      faqs: [
        {
          question: "What tax services do you offer?",
          answer:
            "We offer comprehensive tax services including: personal tax preparation, business tax filing, tax planning and strategy, IRS representation, audit support, amended returns, back tax filing, and refund optimization. Our CPAs handle everything from simple returns to complex business situations.",
        },
        {
          question: "How much can you save me on taxes?",
          answer:
            "Tax savings vary based on your situation, but our refund optimization typically increases refunds by 20-40% compared to basic tax preparation. We identify all eligible deductions and credits, ensuring you pay the minimum amount legally required while maximizing your refund.",
        },
        {
          question: "What if I'm audited by the IRS?",
          answer:
            "Our audit protection service includes full representation throughout the audit process. We handle all communication with the IRS, prepare necessary documentation, and represent you at meetings. You'll never have to face the IRS alone. This service is included in our Premium plans.",
        },
        {
          question: "Can you help with back taxes?",
          answer:
            "Yes, we help clients with back taxes through various solutions including installment agreements, offers in compromise, penalty abatement, and currently not collectible status. Our tax professionals will review your situation and recommend the best approach to resolve your tax debt.",
        },
        {
          question: "How far back can you file taxes?",
          answer:
            "We can file tax returns for previous years, typically up to 6 years back. The IRS generally allows you to claim refunds for up to 3 years from the original due date. For older returns, we focus on compliance and preventing penalties rather than refund recovery.",
        },
        {
          question: "Do you handle business taxes?",
          answer:
            "Absolutely! We handle all types of business entities including sole proprietorships, partnerships, LLCs, S-Corps, and C-Corps. Our services include quarterly filings, annual returns, payroll taxes, sales tax, and business tax planning strategies.",
        },
        {
          question: "🔐 How do I verify my identity with the IRS?",
          answer:
            "To verify your identity for tax purposes, visit the official IRS website: 👉 https://www.irs.gov/identity-theft-fraud-scams. Important: Never use unofficial websites like irs.org. Only irs.gov is owned and operated by the U.S. government.",
        },
        {
          question: "💰 How do I check the status of my tax refund?",
          answer:
            "Use the IRS's refund tracker tool: 👉 https://www.irs.gov/refunds. Have these ready: Your Social Security Number, your filing status (e.g. single, married), and your exact refund amount. If you filed your return through CrediFix Pro, we'll send you email and SMS updates as your refund progresses.",
        },
        {
          question: "🧾 Can CrediFix Pro file my taxes for me?",
          answer:
            "Yes! We offer professional, accurate, and fast federal and state tax filing services. Our experts ensure you're maximizing deductions and credits — even if you're self-employed or have multiple income sources.",
        },
        {
          question: "🕒 How long does it take to get my tax refund?",
          answer:
            "The IRS typically issues refunds within 21 days of e-filing. Some delays may happen due to identity verification or credit-related reviews. If you qualify for the Earned Income Tax Credit (EITC) or Child Tax Credit, expect a slight delay.",
        },
        {
          question: "📞 Will the IRS contact me by phone or text?",
          answer:
            "No. The IRS never calls, emails, or texts asking for money or personal details. If you receive such messages, it's likely a scam. You can report IRS impersonation at https://www.irs.gov/privacy-disclosure/report-phishing.",
        },
      ],
    },
    {
      id: "pricing-billing",
      title: "Pricing & Billing",
      icon: DollarSign,
      color: "bg-purple-500",
      faqs: [
        {
          question: "How much do your services cost?",
          answer:
            "We offer flexible pricing based on the services you need: Credit Repair Only ($69-$149/month), Tax Services Only ($89-$199/month), or Combined Service Bundles ($139-$279/month with savings up to $69). All plans include our 30-day money-back guarantee and no setup fees.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "No, we believe in transparent pricing. The monthly fee covers all standard services in your plan. The only additional costs might be for specialty services like rush processing or expedited disputes, which we'll always discuss with you beforehand.",
        },
        {
          question: "Can I cancel anytime?",
          answer:
            "Yes, you can cancel your service at any time with 30 days notice. There are no long-term contracts or cancellation fees. If you cancel within the first 30 days, you're eligible for a full refund under our money-back guarantee.",
        },
        {
          question: "Do you offer payment plans?",
          answer:
            "Our services are billed monthly, which serves as a natural payment plan. For tax services, we may offer seasonal payment options. We also accept all major credit cards and can set up automatic payments for your convenience.",
        },
        {
          question: "What's included in each plan?",
          answer:
            "Credit Repair plans include dispute filing, credit monitoring, and coaching. Tax Services plans include filing, refund optimization, and audit protection. Combined Bundles offer both services at discounted rates. Choose individual services or bundle for maximum value and savings.",
        },
        {
          question: "Do you offer discounts?",
          answer:
            "We offer discounts for military personnel, seniors, and students. We also have seasonal promotions and referral bonuses. Bundle discounts are available when combining credit repair and tax services. Contact us to learn about current offers.",
        },
        {
          question: "Can I choose only credit repair or only tax services?",
          answer:
            "Absolutely! We offer individual service plans so you can choose exactly what you need. Credit Repair plans start at $99/month, Tax Services start at $149/month, or save money with our Complete Bundle at $199/month (regularly $248).",
        },
        {
          question: "How much do I save with the bundle plan?",
          answer:
            "Our Complete Bundle saves you $49/month compared to purchasing Credit Repair and Tax Services separately. Over a year, that's $588 in savings while getting priority processing and dedicated specialist support.",
        },
        {
          question: "Can I switch between plans?",
          answer:
            "Yes, you can upgrade or downgrade your plan at any time. If you start with individual services and want to add more, we'll apply bundle pricing and savings from your next billing cycle. No penalties for changing plans.",
        },
      ],
    },
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Shield,
      color: "bg-orange-500",
      faqs: [
        {
          question: "How do I get started?",
          answer:
            "Getting started is easy! You can sign up online, book a free consultation, or call us directly. We'll review your credit reports, discuss your goals, recommend the best plan for your situation, and begin working on your case immediately after enrollment.",
        },
        {
          question: "What information do I need to provide?",
          answer:
            "You'll need to provide basic personal information, recent credit reports (we can help you obtain these), and details about your financial goals. For tax services, you'll need tax documents like W-2s, 1099s, and receipts for deductions.",
        },
        {
          question: "How long is the consultation?",
          answer:
            "Our free consultations typically last 30-45 minutes. This gives us enough time to review your situation, explain our services, answer your questions, and develop a preliminary strategy. There's no obligation to sign up after the consultation.",
        },
        {
          question: "Can I see my credit reports first?",
          answer:
            "Absolutely! We recommend reviewing your credit reports before starting any credit repair service. We can help you obtain free reports from all three bureaus and explain what we see. This helps you make an informed decision about our services.",
        },
        {
          question: "What happens after I sign up?",
          answer:
            "After enrollment, we'll obtain your credit reports, conduct a thorough analysis, develop your personalized action plan, and begin filing disputes within 3-5 business days. You'll receive regular updates and can track progress through your online dashboard.",
        },
        {
          question: "Is my information secure?",
          answer:
            "Yes, we use bank-level security including 256-bit SSL encryption, secure data centers, and strict privacy policies. We're committed to protecting your sensitive financial information and never share it with unauthorized parties.",
        },
        {
          question: "🔒 Is my information secure with CrediFix Pro?",
          answer:
            "Yes. We use bank-level encryption, follow all IRS security protocols, and never share your personal data without your consent.",
        },
        {
          question:
            "📝 Can you help me with both credit repair and tax filing?",
          answer:
            "Yes! Many of our clients use both services. By combining credit repair and tax filing, we can help improve your financial profile and get you the maximum legal refund possible.",
        },
      ],
    },
    {
      id: "process-timeline",
      title: "Process & Timeline",
      icon: Clock,
      color: "bg-teal-500",
      faqs: [
        {
          question: "What is the credit repair process?",
          answer:
            "Our process includes: 1) Obtaining and analyzing your credit reports, 2) Identifying disputable items, 3) Filing disputes with credit bureaus, 4) Following up on disputes, 5) Providing ongoing monitoring and education, 6) Repeating the process until optimal results are achieved.",
        },
        {
          question: "How often do you file disputes?",
          answer:
            "We typically file disputes monthly, but the frequency depends on your plan and situation. Professional and Premium plans allow for more frequent disputes. We strategically time disputes to maximize effectiveness and avoid overwhelming the credit bureaus.",
        },
        {
          question: "When will I see results?",
          answer:
            "Initial results often appear within 30-45 days of filing the first round of disputes. Significant improvements typically occur within 3-6 months. Complex cases may take longer, but we work continuously until we achieve the best possible results for your situation.",
        },
        {
          question: "How do I track my progress?",
          answer:
            "You'll have access to an online dashboard where you can track dispute progress, view updated credit scores, see removed items, and communicate with your specialist. We also provide monthly progress reports and are always available to discuss your case.",
        },
        {
          question: "What if disputes are denied?",
          answer:
            "If initial disputes are denied, we review the responses and often re-dispute with additional documentation or different strategies. We may also escalate to creditor disputes or use advanced techniques. Persistence and strategy often lead to success on subsequent attempts.",
        },
        {
          question: "Do you provide credit education?",
          answer:
            "Yes! Credit education is a key part of our service. We provide resources, tips, and personal guidance on building and maintaining good credit. Our goal is not just to repair your credit, but to help you maintain excellent credit long-term.",
        },
      ],
    },
  ];

  // Filter FAQs based on search term
  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }));

  const totalFaqs = faqCategories.reduce(
    (total, category) => total + category.faqs.length,
    0,
  );

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
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our credit repair and tax
              services
            </p>
            <Badge variant="secondary" className="mt-4">
              {totalFaqs} Questions Answered
            </Badge>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category) => {
            if (searchTerm && category.faqs.length === 0) return null;

            const Icon = category.icon;
            return (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div
                      className={`${category.color} rounded-lg w-12 h-12 flex items-center justify-center mr-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.title}</h2>
                      <p className="text-muted-foreground">
                        {category.faqs.length} questions
                      </p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-2">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search No Results */}
        {searchTerm &&
          filteredCategories.every((cat) => cat.faqs.length === 0) && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any questions matching "{searchTerm}". Try
                  different keywords or browse our categories.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="mr-4"
                >
                  Clear Search
                </Button>
                <Button onClick={() => (window.location.href = "/contact")}>
                  Ask a Question
                </Button>
              </CardContent>
            </Card>
          )}

        {/* Contact Section */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our expert team is
                here to help you with personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/contact")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send us a Message
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => (window.location.href = "tel:+15551234567")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call (555) 123-4567
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => (window.location.href = "/booking")}
                >
                  Book Free Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
