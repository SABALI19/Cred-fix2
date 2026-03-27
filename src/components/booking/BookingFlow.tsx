import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronRight } from "lucide-react";
import ServiceSelection from "./ServiceSelection";
import PlanSelection from "./PlanSelection";
import AgentSelection from "./AgentSelection";
import SchedulingStep from "./SchedulingStep";
import InformationStep from "./InformationStep";
import PaymentStep from "./PaymentStep";
import ConfirmationStep from "./ConfirmationStep";

export interface BookingData {
  service: string;
  plan: {
    name: string;
    price: number;
    features: string[];
  } | null;
  agent: {
    id: string;
    name: string;
    title: string;
    avatar: string;
  } | null;
  schedule: {
    date: string;
    time: string;
    consultationType: string;
  } | null;
  information: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    creditScore: string;
    goals: string[];
    notes: string;
  } | null;
  payment: {
    method: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: any;
  } | null;
}

const steps = [
  { id: 1, name: "Service", description: "Choose your service" },
  { id: 2, name: "Plan", description: "Select pricing plan" },
  { id: 3, name: "Specialist", description: "Pick your expert" },
  { id: 4, name: "Schedule", description: "Book your time" },
  { id: 5, name: "Information", description: "Share your details" },
  { id: 6, name: "Payment", description: "Secure payment" },
  { id: 7, name: "Confirmation", description: "You're all set!" },
];

const isInformationComplete = (information: BookingData["information"]) => {
  if (!information) {
    return false;
  }

  return Boolean(
    information.firstName.trim() &&
      information.lastName.trim() &&
      information.email.trim() &&
      information.phone.trim() &&
      information.creditScore &&
      information.goals.length > 0,
  );
};

const isPaymentComplete = (payment: BookingData["payment"]) => {
  if (!payment) {
    return false;
  }

  return Boolean(
    payment.cardNumber.replace(/\s/g, "").length >= 13 &&
      payment.expiryDate.length === 5 &&
      payment.cvv.length >= 3 &&
      payment.billingAddress?.firstName?.trim() &&
      payment.billingAddress?.lastName?.trim() &&
      payment.billingAddress?.address?.trim() &&
      payment.billingAddress?.city?.trim() &&
      payment.billingAddress?.state &&
      payment.billingAddress?.zipCode?.trim(),
  );
};

const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: "",
    plan: null,
    agent: null,
    schedule: null,
    information: null,
    payment: null,
  });

  const updateBookingData = (stepData: Partial<BookingData>) => {
    console.log("Updating booking data:", stepData);
    setBookingData((prev) => {
      const newData = { ...prev, ...stepData };
      console.log("New booking data:", newData);
      return newData;
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length && canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return bookingData.service !== "" && bookingData.service !== null;
      case 2:
        return bookingData.plan !== null;
      case 3:
        return bookingData.agent !== null;
      case 4:
        return bookingData.schedule !== null;
      case 5:
        return isInformationComplete(bookingData.information);
      case 6:
        return isPaymentComplete(bookingData.payment);
      default:
        return false;
    }
  };

  const canProceed = isStepComplete(currentStep);

  const goToStep = (stepNumber: number) => {
    console.log(`Clicking step ${stepNumber}, current step: ${currentStep}`);
    if (!canNavigateToStep(stepNumber)) {
      return;
    }
    setCurrentStep(stepNumber);
    console.log(`Successfully navigated to step ${stepNumber}`);
  };

  const canNavigateToStep = (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      return true;
    }

    if (stepNumber === currentStep + 1) {
      return canProceed;
    }

    return false;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedService={bookingData.service}
            onServiceSelect={(service) => updateBookingData({ service })}
          />
        );
      case 2:
        return (
          <PlanSelection
            selectedService={bookingData.service}
            selectedPlan={bookingData.plan}
            onPlanSelect={(plan) => updateBookingData({ plan })}
          />
        );
      case 3:
        return (
          <AgentSelection
            selectedService={bookingData.service}
            selectedAgent={bookingData.agent}
            onAgentSelect={(agent) => updateBookingData({ agent })}
          />
        );
      case 4:
        return (
          <SchedulingStep
            selectedAgent={bookingData.agent}
            selectedSchedule={bookingData.schedule}
            onScheduleSelect={(schedule) => updateBookingData({ schedule })}
          />
        );
      case 5:
        return (
          <InformationStep
            information={bookingData.information}
            onInformationUpdate={(information) =>
              updateBookingData({ information })
            }
          />
        );
      case 6:
        return (
          <PaymentStep
            bookingData={bookingData}
            payment={bookingData.payment}
            onPaymentUpdate={(payment) => updateBookingData({ payment })}
          />
        );
      case 7:
        return <ConfirmationStep bookingData={bookingData} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Header */}
      <Card className="mb-6 sm:mb-8">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6">
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="-mx-1 overflow-x-auto pb-2">
            <div className="flex min-w-max items-start gap-2 px-1 sm:min-w-0 sm:justify-between sm:gap-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 sm:h-9 sm:w-9 ${
                      currentStep > step.id
                        ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                        : currentStep === step.id
                          ? "bg-primary text-white"
                          : canNavigateToStep(step.id)
                            ? "bg-muted text-muted-foreground cursor-pointer hover:bg-primary/20 hover:text-primary"
                            : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(
                        `Step ${step.id} clicked, canNavigate: ${canNavigateToStep(step.id)}`,
                      );
                      if (canNavigateToStep(step.id)) {
                        goToStep(step.id);
                      }
                    }}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 w-16 text-center sm:w-20">
                    <div className="text-xs font-medium sm:text-sm">{step.name}</div>
                    <div className="hidden text-xs text-muted-foreground sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="mx-1 mt-[-20px] h-4 w-4 text-muted-foreground sm:mx-2" />
                )}
              </div>
            ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="mb-2 text-xl font-bold sm:text-2xl">
              {steps[currentStep - 1].name}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {renderStep()}

          {/* Navigation */}
          {currentStep < steps.length && (
            <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              <Button onClick={nextStep} disabled={!canProceed} className="w-full sm:w-auto">
                {currentStep === steps.length - 1 ? "Complete Booking" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingFlow;
