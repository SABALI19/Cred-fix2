import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Information {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  creditScore: string;
  goals: string[];
  notes: string;
}

interface InformationStepProps {
  information: Information | null;
  onInformationUpdate: (information: Information) => void;
}

const InformationStep = ({
  information,
  onInformationUpdate,
}: InformationStepProps) => {
  const [formData, setFormData] = useState<Information>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    creditScore: "",
    goals: [],
    notes: "",
  });

  useEffect(() => {
    if (information) {
      setFormData(information);
    }
  }, [information]);

  const updateField = (field: keyof Information, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onInformationUpdate(updatedData);
  };

  const toggleGoal = (goal: string) => {
    const currentGoals = formData.goals;
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];
    updateField("goals", updatedGoals);
  };

  const financialGoals = [
    "Improve credit score",
    "Remove negative items",
    "Qualify for mortgage",
    "Get better interest rates",
    "Increase credit limits",
    "Establish credit history",
    "Dispute errors",
    "Identity theft recovery",
    "Tax debt resolution",
    "Business credit building",
    "Student loan assistance",
    "Bankruptcy recovery",
  ];

  const creditScoreRanges = [
    { value: "poor", label: "Poor (300-579)" },
    { value: "fair", label: "Fair (580-669)" },
    { value: "good", label: "Good (670-739)" },
    { value: "very-good", label: "Very Good (740-799)" },
    { value: "excellent", label: "Excellent (800-850)" },
    { value: "unknown", label: "I don't know my score" },
  ];

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.creditScore &&
      formData.goals.length > 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Credit Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="creditScore">Current Credit Score Range *</Label>
              <Select
                value={formData.creditScore}
                onValueChange={(value) => updateField("creditScore", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your credit score range" />
                </SelectTrigger>
                <SelectContent>
                  {creditScoreRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Goals */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            What are your financial goals? *
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select all that apply to help us understand how we can best assist
            you.
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {financialGoals.map((goal) => (
              <div
                key={goal}
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => toggleGoal(goal)}
              >
                <Checkbox
                  id={goal}
                  checked={formData.goals.includes(goal)}
                  onCheckedChange={() => toggleGoal(goal)}
                />
                <Label
                  htmlFor={goal}
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  {goal}
                </Label>
              </div>
            ))}
          </div>
          {formData.goals.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Selected goals:</p>
              <div className="flex flex-wrap gap-2">
                {formData.goals.map((goal) => (
                  <Badge key={goal} variant="secondary">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Additional Information (Optional)
          </h3>
          <div className="space-y-2">
            <Label htmlFor="notes">
              Is there anything specific you'd like your specialist to know?
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Share any specific concerns, questions, or details about your financial situation..."
              rows={4}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This information helps your specialist prepare for your consultation
            and provide more targeted advice.
          </p>
        </CardContent>
      </Card>

      {/* Form Validation Status */}
      {!isFormValid() && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <p className="text-sm text-orange-700">
              Please complete all required fields (*) to continue.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InformationStep;
