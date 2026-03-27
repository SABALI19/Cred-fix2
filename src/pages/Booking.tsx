import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingFlow from "@/components/booking/BookingFlow";

const Booking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold text-transparent sm:mb-4 sm:text-4xl">
              Book Your Consultation
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
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
