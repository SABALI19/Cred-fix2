import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Phone, MapPin, Check } from "lucide-react";

interface Schedule {
  date: string;
  time: string;
}

interface SchedulingStepProps {
  selectedAgent: any;
  selectedSchedule: Schedule | null;
  onScheduleSelect: (schedule: Schedule) => void;
}

const SchedulingStep = ({
  selectedAgent,
  selectedSchedule,
  onScheduleSelect,
}: SchedulingStepProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [consultationType, setConsultationType] = useState("video");

  // Generate available dates (next 14 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split("T")[0],
          dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
          dayNumber: date.getDate(),
          month: date.toLocaleDateString("en-US", { month: "short" }),
          isToday: i === 1,
          isTomorrow: i === 2,
        });
      }
    }

    return dates;
  };

  // Generate available time slots
  const getAvailableTimeSlots = () => {
    return [
      { time: "9:00 AM", available: true },
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "1:00 PM", available: true },
      { time: "2:00 PM", available: true },
      { time: "3:00 PM", available: true },
      { time: "4:00 PM", available: false },
      { time: "5:00 PM", available: true },
    ];
  };

  const availableDates = getAvailableDates();
  const timeSlots = getAvailableTimeSlots();

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onScheduleSelect({ date: selectedDate, time });
    }
  };

  const consultationTypes = [
    {
      id: "video",
      name: "Video Call",
      icon: Video,
      description: "Meet face-to-face from anywhere",
      duration: "45 minutes",
      recommended: true,
    },
    {
      id: "phone",
      name: "Phone Call",
      icon: Phone,
      description: "Traditional phone consultation",
      duration: "45 minutes",
    },
    {
      id: "office",
      name: "In Office",
      icon: MapPin,
      description: "Visit our office location",
      duration: "60 minutes",
      note: "Available in select cities",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Specialist Info */}
      {selectedAgent && (
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary">
                  {selectedAgent.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{selectedAgent.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAgent.title}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consultation Type */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          How would you like to meet?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {consultationTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = consultationType === type.id;

            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-primary border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setConsultationType(type.id)}
              >
                <CardContent className="p-4 text-center">
                  {type.recommended && (
                    <Badge className="mb-2 bg-orange-500">Recommended</Badge>
                  )}
                  <Icon
                    className={`w-8 h-8 mx-auto mb-2 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <h4 className="font-medium mb-1">{type.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {type.description}
                  </p>
                  <p className="text-xs font-medium">{type.duration}</p>
                  {type.note && (
                    <p className="text-xs text-orange-600 mt-1">{type.note}</p>
                  )}
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary mx-auto mt-2" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select a date</h3>
        <div className="grid grid-cols-7 gap-2">
          {availableDates.map((date) => {
            const isSelected = selectedDate === date.date;

            return (
              <Card
                key={date.date}
                className={`cursor-pointer transition-all text-center ${
                  isSelected
                    ? "ring-2 ring-primary border-primary bg-primary text-white"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedDate(date.date)}
              >
                <CardContent className="p-3">
                  <div className="text-xs font-medium">{date.dayName}</div>
                  <div className="text-lg font-bold">{date.dayNumber}</div>
                  <div className="text-xs">{date.month}</div>
                  {date.isToday && (
                    <Badge
                      variant="secondary"
                      className="mt-1 text-xs bg-green-100 text-green-800"
                    >
                      Today
                    </Badge>
                  )}
                  {date.isTomorrow && (
                    <Badge
                      variant="secondary"
                      className="mt-1 text-xs bg-blue-100 text-blue-800"
                    >
                      Tomorrow
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Choose your preferred time
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {timeSlots.map((slot) => {
              const isSelected =
                selectedSchedule?.time === slot.time &&
                selectedSchedule?.date === selectedDate;

              return (
                <Button
                  key={slot.time}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-12 ${
                    !slot.available
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary hover:text-white"
                  }`}
                  disabled={!slot.available}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {slot.time}
                  {isSelected && <Check className="w-4 h-4 ml-2" />}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Schedule Summary */}
      {selectedSchedule && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">
                Consultation Scheduled
              </h4>
            </div>
            <div className="text-sm text-green-700">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(selectedSchedule.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedSchedule.time}
                </span>
                <span className="flex items-center">
                  {consultationType === "video" && (
                    <>
                      <Video className="w-4 h-4 mr-1" />
                      Video Call
                    </>
                  )}
                  {consultationType === "phone" && (
                    <>
                      <Phone className="w-4 h-4 mr-1" />
                      Phone Call
                    </>
                  )}
                  {consultationType === "office" && (
                    <>
                      <MapPin className="w-4 h-4 mr-1" />
                      In Office
                    </>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SchedulingStep;
