import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingFlow from "@/components/booking/BookingFlow";

const Booking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Book Your Consultation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your journey to better credit and financial health with our
              expert team
            </p>
          </div>
        </div>

        <BookingFlow />
      </div>
    </div>
  );
};

export default Booking;
