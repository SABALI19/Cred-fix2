import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Calculator,
  TrendingUp,
  Check,
  Star,
  Clock,
} from "lucide-react";

interface ServiceSelectionProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
}

const services = [
  {
    id: "credit_repair",
    name: "Credit Repair",
    icon: CreditCard,
    description: "Comprehensive credit report analysis and dispute management",
    features: [
      "Credit report analysis from all 3 bureaus",
      "Dispute filing and tracking",
      "Credit score monitoring",
      "Personalized improvement plan",
      "Educational resources",
    ],
    duration: "3-6 months",
    rating: 4.9,
    popular: true,
  },
  {
    id: "tax_services",
    name: "Tax Filing Services",
    icon: Calculator,
    description: "Professional tax preparation and optimization strategies",
    features: [
      "Personal & business tax filing",
      "Deduction optimization",
      "IRS representation",
      "Tax planning consultation",
      "Refund maximization",
    ],
    duration: "2-4 weeks",
    rating: 4.8,
    popular: false,
  },
  {
    id: "comprehensive",
    name: "Credit + Tax Bundle",
    icon: TrendingUp,
    description: "Complete financial health package combining both services",
    features: [
      "Everything from Credit Repair",
      "Everything from Tax Services",
      "Integrated financial planning",
      "Priority specialist support",
      "Quarterly progress reviews",
    ],
    duration: "3-6 months",
    rating: 5.0,
    popular: false,
  },
];

const ServiceSelection = ({
  selectedService,
  onServiceSelect,
}: ServiceSelectionProps) => {
  const handleServiceClick = (serviceId: string) => {
    console.log("Service clicked:", serviceId);
    onServiceSelect(serviceId);
  };

  return (
    <div className="space-y-6">
      {selectedService && (
        <div className="mb-4 text-center">
          <p className="text-sm text-green-600 font-medium">
            ✓ {services.find((s) => s.id === selectedService)?.name} selected
          </p>
        </div>
      )}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;

          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-lg active:scale-95 ${
                isSelected
                  ? "ring-2 ring-primary border-primary shadow-lg bg-primary/5"
                  : "hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={() => handleServiceClick(service.id)}
              style={{ pointerEvents: "auto" }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold sm:text-lg">{service.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-muted-foreground ml-1">
                            {service.rating}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {service.popular && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800"
                      >
                        Popular
                      </Badge>
                    )}
                    {isSelected && (
                      <div className="bg-primary text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 text-sm">
                  {service.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">What's included:</h4>
                  <ul className="space-y-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-sm text-primary">
                        +{service.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Service Comparison */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-semibold mb-4">
            Not sure which service to choose?
          </h3>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div>
              <h4 className="font-medium mb-2">Choose Credit Repair if:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• You have credit issues to resolve</li>
                <li>• Your score is below 650</li>
                <li>• You're planning a major purchase</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Choose Tax Services if:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• You need tax filing assistance</li>
                <li>• You want to maximize refunds</li>
                <li>• You have complex tax situations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Choose the Bundle if:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• You want comprehensive support</li>
                <li>• You're focused on overall financial health</li>
                <li>• You prefer working with one provider</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceSelection;
