import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Lock,
  Check,
  Calendar,
  User,
  MapPin,
  Shield,
} from "lucide-react";
import type { BookingData } from "./BookingFlow";

interface Payment {
  method: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface PaymentStepProps {
  bookingData: BookingData;
  payment: Payment | null;
  onPaymentUpdate: (payment: Payment) => void;
}

const PaymentStep = ({
  bookingData,
  payment,
  onPaymentUpdate,
}: PaymentStepProps) => {
  const [formData, setFormData] = useState<Payment>({
    method: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (payment) {
      setFormData(payment);
    }
  }, [payment]);

  const updateField = (field: string, value: any) => {
    if (field.startsWith("billingAddress.")) {
      const addressField = field.split(".")[1];
      const updatedData = {
        ...formData,
        billingAddress: {
          ...formData.billingAddress,
          [addressField]: value,
        },
      };
      setFormData(updatedData);
      onPaymentUpdate(updatedData);
    } else {
      const updatedData = { ...formData, [field]: value };
      setFormData(updatedData);
      onPaymentUpdate(updatedData);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const isFormValid = () => {
    return (
      formData.cardNumber.replace(/\s/g, "").length >= 13 &&
      formData.expiryDate.length === 5 &&
      formData.cvv.length >= 3 &&
      formData.billingAddress.firstName.trim() &&
      formData.billingAddress.lastName.trim() &&
      formData.billingAddress.address.trim() &&
      formData.billingAddress.city.trim() &&
      formData.billingAddress.state &&
      formData.billingAddress.zipCode.trim()
    );
  };

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">
                  {bookingData.service
                    ?.replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {bookingData.plan?.name} Plan
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${bookingData.plan?.price}/month
                </p>
              </div>
            </div>

            {bookingData.agent && (
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {bookingData.agent.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {bookingData.agent.title}
                  </p>
                </div>
              </div>
            )}

            {bookingData.schedule && (
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">
                    {new Date(bookingData.schedule.date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {bookingData.schedule.time}
                  </p>
                </div>
              </div>
            )}

            <Separator />
            <div className="flex justify-between items-center font-semibold">
              <span>Total (Monthly)</span>
              <span className="text-lg">${bookingData.plan?.price}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Payment Information</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) =>
                  updateField("cardNumber", formatCardNumber(e.target.value))
                }
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    updateField("expiryDate", formatExpiryDate(e.target.value))
                  }
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={(e) =>
                    updateField("cvv", e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Billing Address</h3>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingFirstName">First Name *</Label>
                <Input
                  id="billingFirstName"
                  value={formData.billingAddress.firstName}
                  onChange={(e) =>
                    updateField("billingAddress.firstName", e.target.value)
                  }
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingLastName">Last Name *</Label>
                <Input
                  id="billingLastName"
                  value={formData.billingAddress.lastName}
                  onChange={(e) =>
                    updateField("billingAddress.lastName", e.target.value)
                  }
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingAddress">Address *</Label>
              <Input
                id="billingAddress"
                value={formData.billingAddress.address}
                onChange={(e) =>
                  updateField("billingAddress.address", e.target.value)
                }
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCity">City *</Label>
                <Input
                  id="billingCity"
                  value={formData.billingAddress.city}
                  onChange={(e) =>
                    updateField("billingAddress.city", e.target.value)
                  }
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingState">State *</Label>
                <Select
                  value={formData.billingAddress.state}
                  onValueChange={(value) =>
                    updateField("billingAddress.state", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingZipCode">ZIP Code *</Label>
                <Input
                  id="billingZipCode"
                  value={formData.billingAddress.zipCode}
                  onChange={(e) =>
                    updateField("billingAddress.zipCode", e.target.value)
                  }
                  placeholder="12345"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Guarantees */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">
              Security & Guarantees
            </h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>PCI DSS compliant</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Validation */}
      {!isFormValid() && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <p className="text-sm text-orange-700">
              Please complete all required payment and billing information to
              proceed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentStep;
