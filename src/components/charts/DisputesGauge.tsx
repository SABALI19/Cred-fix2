import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";

interface DisputesGaugeProps {
  resolved: number;
  inProgress: number;
  pending: number;
  title: string;
  subtitle?: string;
  animated?: boolean;
}

const DisputesGauge = ({
  resolved,
  inProgress,
  pending,
  title,
  subtitle,
  animated = true,
}: DisputesGaugeProps) => {
  const [animatedResolved, setAnimatedResolved] = useState(0);
  const [animatedInProgress, setAnimatedInProgress] = useState(0);
  const [animatedPending, setAnimatedPending] = useState(0);

  const total = resolved + inProgress + pending;

  useEffect(() => {
    if (animated && total > 0) {
      const duration = 2000;
      const steps = 60;
      const resolvedIncrement = resolved / steps;
      const inProgressIncrement = inProgress / steps;
      const pendingIncrement = pending / steps;

      let currentResolved = 0;
      let currentInProgress = 0;
      let currentPending = 0;

      const timer = setInterval(() => {
        currentResolved += resolvedIncrement;
        currentInProgress += inProgressIncrement;
        currentPending += pendingIncrement;

        if (currentResolved >= resolved) {
          currentResolved = resolved;
          currentInProgress = inProgress;
          currentPending = pending;
          clearInterval(timer);
        }

        setAnimatedResolved(Math.round(currentResolved));
        setAnimatedInProgress(Math.round(currentInProgress));
        setAnimatedPending(Math.round(currentPending));
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setAnimatedResolved(resolved);
      setAnimatedInProgress(inProgress);
      setAnimatedPending(pending);
    }
  }, [resolved, inProgress, pending, animated, total]);

  const resolvedPercentage = total > 0 ? (animatedResolved / total) * 100 : 0;
  const inProgressPercentage =
    total > 0 ? (animatedInProgress / total) * 100 : 0;
  const pendingPercentage = total > 0 ? (animatedPending / total) * 100 : 0;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke offsets for segments
  const resolvedStroke = (resolvedPercentage / 100) * circumference;
  const inProgressStroke = (inProgressPercentage / 100) * circumference;
  const pendingStroke = (pendingPercentage / 100) * circumference;

  const resolvedOffset = 0;
  const inProgressOffset = resolvedStroke;
  const pendingOffset = resolvedStroke + inProgressStroke;

  return (
    <Card className="h-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        {/* Circular Progress Gauge */}
        <div className="relative w-full max-w-[220px]">
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 180 180"
            className="transform -rotate-90"
          >
            {/* Background Circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />

            {/* Resolved Segment */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#22c55e"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${resolvedStroke} ${circumference}`}
              strokeDashoffset={-resolvedOffset}
              className="transition-all duration-1000 ease-out"
              style={{ filter: "drop-shadow(0 0 4px #22c55e40)" }}
            />

            {/* In Progress Segment */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${inProgressStroke} ${circumference}`}
              strokeDashoffset={-inProgressOffset}
              className="transition-all duration-1000 ease-out delay-300"
              style={{ filter: "drop-shadow(0 0 4px #f59e0b40)" }}
            />

            {/* Pending Segment */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#ef4444"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${pendingStroke} ${circumference}`}
              strokeDashoffset={-pendingOffset}
              className="transition-all duration-1000 ease-out delay-600"
              style={{ filter: "drop-shadow(0 0 4px #ef444440)" }}
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-primary">{total}</div>
            <div className="text-sm text-muted-foreground">Total Disputes</div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Resolved</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {animatedResolved}
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
              {total > 0 ? Math.round(resolvedPercentage) : 0}%
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <div className="text-lg font-bold text-yellow-600">
              {animatedInProgress}
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">
              {total > 0 ? Math.round(inProgressPercentage) : 0}%
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-lg font-bold text-red-600">
              {animatedPending}
            </div>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
              {total > 0 ? Math.round(pendingPercentage) : 0}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisputesGauge;
