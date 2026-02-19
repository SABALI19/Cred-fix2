import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, CreditCard, Calculator, Crown } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import { motion, AnimatePresence } from "framer-motion";

interface DetailedPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: "credit" | "tax" | null;
}

const DetailedPricingModal = ({
  isOpen,
  onClose,
  serviceType,
}: DetailedPricingModalProps) => {
  const creditRepairPlans = [
    {
      name: "Basic Credit Repair",
      price: "$69",
      period: "/month",
      description: "Essential credit repair for simple cases",
      icon: CreditCard,
      color: "border-blue-200",
      popular: false,
      features: [
        "Credit report analysis",
        "Basic dispute letters (up to 5/month)",
        "Monthly progress reports",
        "Email support",
        "Educational resources",
        "Credit score tracking",
      ],
      notIncluded: [
        "Phone support",
        "Advanced dispute strategies",
        "Goodwill letters",
        "Attorney review",
      ],
    },
    {
      name: "Professional Credit Repair",
      price: "$99",
      period: "/month",
      description: "Comprehensive credit repair with coaching",
      icon: CreditCard,
      color: "border-primary",
      popular: true,
      features: [
        "Everything in Basic",
        "Unlimited dispute letters",
        "Advanced dispute strategies",
        "Credit coaching calls",
        "Goodwill letter assistance",
        "Score simulator access",
        "Phone & email support",
        "Creditor direct negotiations",
      ],
      notIncluded: [
        "Attorney review",
        "Debt validation",
        "Identity monitoring",
      ],
    },
    {
      name: "Premium Credit Repair",
      price: "$149",
      period: "/month",
      description: "Complete credit restoration with legal support",
      icon: Crown,
      color: "border-purple-200",
      popular: false,
      features: [
        "Everything in Professional",
        "Attorney review & consultation",
        "Debt validation services",
        "Credit building guidance",
        "Identity monitoring",
        "Priority processing",
        "24/7 phone support",
        "Complex case handling",
        "Bankruptcy consultation",
      ],
      notIncluded: [],
    },
  ];

  const taxServicePlans = [
    {
      name: "Basic Tax Filing",
      price: "$89",
      period: "/month",
      description: "Simple personal tax preparation",
      icon: Calculator,
      color: "border-green-200",
      popular: false,
      features: [
        "Personal tax preparation",
        "Federal & state filing",
        "Basic deduction finding",
        "E-filing included",
        "Refund tracking",
        "Email support",
        "Standard processing",
      ],
      notIncluded: [
        "Business tax filing",
        "Audit protection",
        "Tax planning",
        "Priority support",
      ],
    },
    {
      name: "Professional Tax Services",
      price: "$149",
      period: "/month",
      description: "Comprehensive tax services with optimization",
      icon: Calculator,
      color: "border-primary",
      popular: true,
      features: [
        "Everything in Basic",
        "Business tax filing",
        "Advanced refund optimization",
        "Tax planning strategy",
        "Quarterly filing support",
        "Phone & email support",
        "Multi-year filing",
        "Maximum deduction finding",
      ],
      notIncluded: [
        "Full audit protection",
        "Attorney representation",
        "24/7 support",
      ],
    },
    {
      name: "Premium Tax + Protection",
      price: "$199",
      period: "/month",
      description: "Complete tax services with full audit protection",
      icon: Crown,
      color: "border-purple-200",
      popular: false,
      features: [
        "Everything in Professional",
        "Full audit protection",
        "Attorney representation",
        "Year-round tax planning",
        "Complex business entities",
        "Tax debt resolution",
        "24/7 priority support",
        "IRS representation",
        "Penalty abatement assistance",
      ],
      notIncluded: [],
    },
  ];

  const currentPlans =
    serviceType === "credit" ? creditRepairPlans : taxServicePlans;
  const serviceTitle =
    serviceType === "credit" ? "Credit Repair Plans" : "Tax Service Plans";
  const ServiceIcon = serviceType === "credit" ? CreditCard : Calculator;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <ServiceIcon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <DialogTitle className="text-3xl font-bold">
                  {serviceTitle}
                </DialogTitle>
                <DialogDescription className="text-lg">
                  Choose the perfect plan for your{" "}
                  {serviceType === "credit" ? "credit repair" : "tax service"}{" "}
                  needs
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-3 gap-6">
                {currentPlans.map((plan, index) => {
                  const Icon = plan.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card
                        className={`relative h-full ${plan.color} ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                              Most Popular
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="text-center pb-4">
                          <div className="flex justify-center mb-3">
                            <div
                              className={`rounded-full p-2 ${plan.popular ? "bg-primary/10" : "bg-muted"}`}
                            >
                              <Icon
                                className={`w-6 h-6 ${plan.popular ? "text-primary" : "text-muted-foreground"}`}
                              />
                            </div>
                          </div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {plan.description}
                          </CardDescription>
                          <div className="mt-4">
                            <span className="text-3xl font-bold">
                              {plan.price}
                            </span>
                            <span className="text-muted-foreground">
                              {plan.period}
                            </span>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Included Features */}
                          <div>
                            <h4 className="font-medium text-sm text-green-700 mb-3">
                              ✅ What's Included:
                            </h4>
                            <ul className="space-y-2">
                              {plan.features.map((feature, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Not Included Features */}
                          {plan.notIncluded.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-3">
                                ❌ Not Included:
                              </h4>
                              <ul className="space-y-2">
                                {plan.notIncluded.map((feature, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="pt-4 space-y-2">
                            <AuthButton
                              className={`w-full ${plan.popular ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" : ""}`}
                              variant={plan.popular ? "default" : "outline"}
                              redirectTo="/dashboard"
                            >
                              Choose {plan.name}
                            </AuthButton>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() =>
                                (window.location.href = "/booking")
                              }
                            >
                              Free Consultation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bundle Offer */}
              <motion.div
                className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">
                    💡 Want Both Services?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Combine{" "}
                    {serviceType === "credit"
                      ? "Credit Repair"
                      : "Tax Services"}{" "}
                    with our other services for maximum value!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <AuthButton
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      redirectTo="/dashboard"
                    >
                      View Complete Bundle ($199/month)
                    </AuthButton>
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      className="text-muted-foreground"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default DetailedPricingModal;
