import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";

interface Plan {
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  recommended?: boolean;
  popular?: boolean;
}

interface PlanSelectionProps {
  selectedService: string;
  selectedPlan: Plan | null;
  onPlanSelect: (plan: Plan) => void;
}

const getPlansForService = (service: string): Plan[] => {
  const basePlans = [
    {
      name: "Essential",
      price: 89,
      features: [
        "Basic credit analysis",
        "5 dispute letters per month",
        "Monthly credit monitoring",
        "Educational resources",
        "Email support",
      ],
    },
    {
      name: "Professional",
      price: 149,
      originalPrice: 199,
      recommended: true,
      features: [
        "Comprehensive credit analysis",
        "Unlimited dispute letters",
        "Real-time credit monitoring",
        "Personalized action plan",
        "Phone & email support",
        "Identity theft protection",
        "Credit coaching sessions",
      ],
    },
    {
      name: "Premium",
      price: 299,
      popular: true,
      features: [
        "Everything in Professional",
        "Dedicated specialist",
        "Weekly progress calls",
        "Advanced dispute strategies",
        "Priority processing",
        "Credit builder loans assistance",
        "Financial planning consultation",
        "Money-back guarantee",
      ],
    },
  ];

  if (service === "tax_services") {
    return basePlans.map((plan) => ({
      ...plan,
      features: plan.features.map((feature) =>
        feature
          .replace("credit", "tax")
          .replace("dispute", "filing")
          .replace("Credit", "Tax")
          .replace("Dispute", "Filing"),
      ),
    }));
  }

  if (service === "comprehensive") {
    return basePlans.map((plan) => ({
      ...plan,
      price: Math.round(plan.price * 1.6), // Bundle discount
      originalPrice: plan.originalPrice
        ? Math.round(plan.originalPrice * 2)
        : Math.round(plan.price * 2),
      features: [
        ...plan.features,
        "Tax filing included",
        "Integrated financial planning",
        "Quarterly reviews",
      ],
    }));
  }

  return basePlans;
};

const PlanSelection = ({
  selectedService,
  selectedPlan,
  onPlanSelect,
}: PlanSelectionProps) => {
  const plans = getPlansForService(selectedService);

  const getServiceTitle = () => {
    switch (selectedService) {
      case "credit_repair":
        return "Credit Repair Plans";
      case "tax_services":
        return "Tax Service Plans";
      case "comprehensive":
        return "Comprehensive Service Bundles";
      default:
        return "Service Plans";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">{getServiceTitle()}</h3>
        <p className="text-muted-foreground">
          Choose the plan that best fits your needs and budget
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan?.name === plan.name;
          const savings = plan.originalPrice
            ? plan.originalPrice - plan.price
            : 0;

          return (
            <Card
              key={plan.name}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? "ring-2 ring-primary border-primary shadow-lg"
                  : "hover:border-primary/50"
              } ${plan.recommended ? "border-orange-200" : ""}`}
              onClick={() => onPlanSelect(plan)}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}

              {plan.popular && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-primary text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <span className="line-through text-muted-foreground">
                          ${plan.originalPrice}/month
                        </span>
                        <Badge variant="secondary" className="text-green-700">
                          Save ${savings}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                  onClick={() => onPlanSelect(plan)}
                >
                  {isSelected ? "Selected" : "Select Plan"}
                  {isSelected && <Check className="w-4 h-4 ml-2" />}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Guarantee */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Check className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">
              30-Day Money-Back Guarantee
            </h4>
          </div>
          <p className="text-green-700 text-sm">
            Not satisfied with our service? Get a full refund within 30 days, no
            questions asked.
          </p>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Need help choosing?</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-2">Essential Plan</h5>
              <p className="text-muted-foreground">
                Perfect for simple cases with basic credit issues that need
                attention.
              </p>
            </div>
            <div>
              <h5 className="font-medium mb-2">Professional Plan</h5>
              <p className="text-muted-foreground">
                Best value for most customers with moderate to complex credit
                situations.
              </p>
            </div>
            <div>
              <h5 className="font-medium mb-2">Premium Plan</h5>
              <p className="text-muted-foreground">
                Maximum support for urgent situations or complex financial
                goals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanSelection;
