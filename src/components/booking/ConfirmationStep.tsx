import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  Heart,
  Star,
  Download,
  ArrowRight,
} from "lucide-react";
import type { BookingData } from "./BookingFlow";
import { useEffect, useRef, useState } from "react";
import { consultationService } from "@/services/consultationService";

interface ConfirmationStepProps {
  bookingData: BookingData;
}

const ConfirmationStep = ({ bookingData }: ConfirmationStepProps) => {
  const confirmationNumber = `CF${Date.now().toString().slice(-6)}`;
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const hasSubmittedRef = useRef(false);

  console.log("ConfirmationStep rendered with booking data:", bookingData);

  useEffect(() => {
    if (hasSubmittedRef.current) {
      return;
    }

    const fullName = `${bookingData.information?.firstName || ""} ${
      bookingData.information?.lastName || ""
    }`.trim();
    const email = bookingData.information?.email || "";

    if (!fullName || !email) {
      return;
    }

    hasSubmittedRef.current = true;
    setSaveStatus("saving");

    const message = [
      `Service: ${bookingData.service || "n/a"}`,
      `Plan: ${bookingData.plan?.name || "n/a"}`,
      `Agent: ${bookingData.agent?.name || "n/a"}`,
      `Schedule: ${bookingData.schedule?.date || "n/a"} ${bookingData.schedule?.time || ""}`.trim(),
      `Credit Score: ${bookingData.information?.creditScore || "n/a"}`,
      `Goals: ${(bookingData.information?.goals || []).join(", ") || "n/a"}`,
      `Notes: ${bookingData.information?.notes || "n/a"}`,
    ].join("\n");

    consultationService
      .create({
        name: fullName,
        email,
        phone: bookingData.information?.phone || "",
        message,
      })
      .then(() => setSaveStatus("saved"))
      .catch(() => setSaveStatus("error"));
  }, [bookingData]);

  const handleDownloadConfirmation = () => {
    console.log("Download confirmation clicked");
    try {
      // Create a simple text content for download
      const content = `
CreditFix Pro - Booking Confirmation
Confirmation Number: ${confirmationNumber}
Service: ${bookingData.service?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
Plan: ${bookingData.plan?.name} - $${bookingData.plan?.price}/month
Agent: ${bookingData.agent?.name}
Date: ${bookingData.schedule ? new Date(bookingData.schedule.date).toLocaleDateString() : "TBD"}
Time: ${bookingData.schedule?.time || "TBD"}

Thank you for choosing CreditFix Pro!
      `;

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CreditFixPro-Confirmation-${confirmationNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Confirmation details saved! Check your downloads folder.");
    }
  };

  const handleGoToDashboard = () => {
    console.log("Go to dashboard clicked");
    try {
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Navigation failed:", error);
      // Fallback navigation
      window.location.assign("/dashboard");
    }
  };

  return (
    <div className="space-y-6 text-center" style={{ pointerEvents: "auto" }}>
      {/* Success Header */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Booking Confirmed!
          </h2>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold text-primary">
                We're excited to help you with your credit and tax goals!
              </span>
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Your journey to better financial health starts now.
            </p>
          </div>
          <p className="text-lg text-muted-foreground">
            Confirmation Number: <strong>{confirmationNumber}</strong>
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Consultation Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Consultation Details
            </h3>
            <div className="space-y-3 text-left">
              {bookingData.schedule && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {new Date(bookingData.schedule.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}{" "}
                      at {bookingData.schedule.time}
                    </p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">
                  {bookingData.service
                    ?.replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{bookingData.plan?.name}</p>
                  <Badge variant="secondary">
                    ${bookingData.plan?.price}/month
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialist Info */}
        {bookingData.agent && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Your Specialist
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {bookingData.agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{bookingData.agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingData.agent.title}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact Information */}
      {bookingData.information && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-center">
              We'll be in touch at:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>{bookingData.information.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>{bookingData.information.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* What Happens Next */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">What Happens Next?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">1</span>
              </div>
              <h4 className="font-medium mb-1">Confirmation Email</h4>
              <p className="text-muted-foreground">
                You'll receive a detailed confirmation email within the next few
                minutes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">2</span>
              </div>
              <h4 className="font-medium mb-1">Specialist Preparation</h4>
              <p className="text-muted-foreground">
                Your specialist will review your information and prepare for
                your consultation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">3</span>
              </div>
              <h4 className="font-medium mb-1">Meeting Reminder</h4>
              <p className="text-muted-foreground">
                We'll send you a reminder 24 hours before your scheduled
                consultation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={handleDownloadConfirmation}
          className="flex items-center hover:bg-muted active:scale-95 transition-all cursor-pointer"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Confirmation
        </Button>
        <Button
          onClick={handleGoToDashboard}
          className="flex items-center bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 active:scale-95 transition-all cursor-pointer"
          size="lg"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {saveStatus === "saving" && "Saving consultation request..."}
        {saveStatus === "saved" && "Consultation request saved to backend."}
        {saveStatus === "error" &&
          "Could not save consultation request. Please contact support."}
      </div>

      {/* Customer Support */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Our customer support team is here to assist you with any questions.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <button
              onClick={() => (window.location.href = "tel:+15551234567")}
              className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </button>
            <button
              onClick={() => window.open("mailto:support@creditfixpro.com")}
              className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>support@creditfixpro.com</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationStep;
