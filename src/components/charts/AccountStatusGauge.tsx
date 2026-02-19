import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, CreditCard } from "lucide-react";

interface AccountStatusGaugeProps {
  goodStanding: number;
  needsAttention: number;
  title: string;
  subtitle?: string;
  animated?: boolean;
}

const AccountStatusGauge = ({
  goodStanding,
  needsAttention,
  title,
  subtitle,
  animated = true,
}: AccountStatusGaugeProps) => {
  const [animatedGood, setAnimatedGood] = useState(0);
  const [animatedAttention, setAnimatedAttention] = useState(0);

  const total = goodStanding + needsAttention;

  useEffect(() => {
    if (animated && total > 0) {
      const duration = 2000;
      const steps = 60;
      const goodIncrement = goodStanding / steps;
      const attentionIncrement = needsAttention / steps;

      let currentGood = 0;
      let currentAttention = 0;

      const timer = setInterval(() => {
        currentGood += goodIncrement;
        currentAttention += attentionIncrement;

        if (currentGood >= goodStanding) {
          currentGood = goodStanding;
          currentAttention = needsAttention;
          clearInterval(timer);
        }

        setAnimatedGood(Math.round(currentGood));
        setAnimatedAttention(Math.round(currentAttention));
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setAnimatedGood(goodStanding);
      setAnimatedAttention(needsAttention);
    }
  }, [goodStanding, needsAttention, animated, total]);

  const goodPercentage = total > 0 ? (animatedGood / total) * 100 : 0;
  const attentionPercentage = total > 0 ? (animatedAttention / total) * 100 : 0;

  const getHealthColor = (percentage: number) => {
    if (percentage >= 90) return "#22c55e"; // Excellent
    if (percentage >= 80) return "#84cc16"; // Good
    if (percentage >= 70) return "#eab308"; // Fair
    if (percentage >= 60) return "#f97316"; // Poor
    return "#ef4444"; // Very Poor
  };

  const getHealthRating = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 70) return "Fair";
    if (percentage >= 60) return "Poor";
    return "Needs Work";
  };

  const healthColor = getHealthColor(goodPercentage);
  const healthRating = getHealthRating(goodPercentage);

  // Semi-circular gauge parameters
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const halfCircumference = circumference / 2;
  const strokeDasharray = `${halfCircumference} ${halfCircumference}`;
  const goodStrokeDasharray = `${(goodPercentage / 100) * halfCircumference} ${halfCircumference}`;

  return (
    <Card className="h-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <CreditCard className="w-5 h-5 text-blue-500" />
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        {/* Semi-circular Speedometer */}
        <div className="relative w-full max-w-[220px]">
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 180 110"
            className="overflow-visible"
          >
            {/* Background Arc */}
            <path
              d={`M 20 90 A 70 70 0 0 1 160 90`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Good Standing Arc */}
            <path
              d={`M 20 90 A 70 70 0 0 1 160 90`}
              fill="none"
              stroke={healthColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={goodStrokeDasharray}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 6px ${healthColor}40)`,
              }}
            />

            {/* Needle */}
            <g
              className="transition-transform duration-1000 ease-out"
              style={{
                transformOrigin: "90px 90px",
                transform: `rotate(${-90 + (goodPercentage / 100) * 180}deg)`,
              }}
            >
              <line
                x1="90"
                y1="90"
                x2="90"
                y2="30"
                stroke={healthColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="90"
                cy="90"
                r="6"
                fill={healthColor}
                stroke="#fff"
                strokeWidth="2"
              />
            </g>
          </svg>

          {/* Center Content */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-2xl font-bold" style={{ color: healthColor }}>
              {Math.round(goodPercentage)}%
            </div>
            <Badge
              variant="outline"
              className="text-xs mt-1"
              style={{ borderColor: healthColor, color: healthColor }}
            >
              {healthRating}
            </Badge>
          </div>
        </div>

        {/* Account Status Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Good Standing</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              {animatedGood}
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
              {Math.round(goodPercentage)}%
            </Badge>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Needs Attention</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              {animatedAttention}
            </div>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
              {Math.round(attentionPercentage)}%
            </Badge>
          </div>
        </div>

        {/* Health Indicator Scale */}
        <div className="w-full max-w-[220px]">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
          <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full relative">
            <div
              className="absolute w-3 h-3 bg-white border-2 rounded-full transform -translate-y-0.5 transition-all duration-1000"
              style={{
                left: `${goodPercentage}%`,
                borderColor: healthColor,
                transform: "translateY(-2px) translateX(-50%)",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountStatusGauge;
