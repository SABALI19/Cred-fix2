import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CreditScoreGaugeProps {
  score: number;
  previousScore?: number;
  maxScore?: number;
  title: string;
  subtitle?: string;
  showImprovement?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const CreditScoreGauge = ({
  score,
  previousScore,
  maxScore = 850,
  title,
  subtitle,
  showImprovement = true,
  size = "md",
  animated = true,
}: CreditScoreGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animated) {
      setIsAnimating(true);
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = score / steps;
      let currentScore = 0;

      const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
          currentScore = score;
          clearInterval(timer);
          setIsAnimating(false);
        }
        setAnimatedScore(Math.round(currentScore));
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, animated]);

  const getScoreColor = (score: number) => {
    if (score >= 750) return "#22c55e"; // Green - Excellent
    if (score >= 700) return "#84cc16"; // Light Green - Good
    if (score >= 650) return "#eab308"; // Yellow - Fair
    if (score >= 600) return "#f97316"; // Orange - Poor
    return "#ef4444"; // Red - Very Poor
  };

  const getScoreRating = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    if (score >= 600) return "Poor";
    return "Very Poor";
  };

  const percentage = (animatedScore / maxScore) * 100;
  const angle = (percentage / 100) * 180; // 180 degrees for half circle
  const color = getScoreColor(animatedScore);
  const rating = getScoreRating(animatedScore);

  const improvement = previousScore ? score - previousScore : 0;

  // Size configurations
  const sizeConfig = {
    sm: { radius: 60, strokeWidth: 8, fontSize: "text-lg" },
    md: { radius: 80, strokeWidth: 10, fontSize: "text-2xl" },
    lg: { radius: 100, strokeWidth: 12, fontSize: "text-3xl" },
  };

  const config = sizeConfig[size];
  const circumference = Math.PI * config.radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <Card className="h-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        {/* Speedometer Gauge */}
        <div
          className="relative w-full max-w-[240px]"
          style={{ width: `${config.radius * 2 + 40}px` }}
        >
          <svg
            width="100%"
            height="auto"
            viewBox={`0 0 ${config.radius * 2 + 40} ${config.radius + 50}`}
            className="transform rotate-180"
          >
            {/* Background Arc */}
            <path
              d={`M 20 ${config.radius + 20} A ${config.radius} ${config.radius} 0 0 1 ${config.radius * 2 + 20} ${config.radius + 20}`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
            />

            {/* Score Arc */}
            <path
              d={`M 20 ${config.radius + 20} A ${config.radius} ${config.radius} 0 0 1 ${config.radius * 2 + 20} ${config.radius + 20}`}
              fill="none"
              stroke={color}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              className={`transition-all duration-1000 ease-out ${isAnimating ? "animate-pulse" : ""}`}
              style={{
                filter: `drop-shadow(0 0 6px ${color}40)`,
              }}
            />

            {/* Gradient Overlay for Better Visual */}
            <defs>
              <linearGradient
                id={`scoreGradient-${title}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center transform translate-y-2">
            <div
              className={`font-bold ${config.fontSize} text-center`}
              style={{ color }}
            >
              {animatedScore}
            </div>
            <div className="text-xs text-muted-foreground">
              out of {maxScore}
            </div>
            <Badge
              variant="outline"
              className="mt-1 text-xs"
              style={{ borderColor: color, color }}
            >
              {rating}
            </Badge>
          </div>
        </div>

        {/* Score Range Indicators */}
        <div className="w-full max-w-[240px]">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>300</span>
            <span>850</span>
          </div>
          <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-orange-500 to-green-500 rounded-full relative">
            <div
              className="absolute w-3 h-3 bg-white border-2 rounded-full transform -translate-y-0.5 transition-all duration-1000"
              style={{
                left: `${((animatedScore - 300) / (850 - 300)) * 100}%`,
                borderColor: color,
                transform: "translateY(-2px) translateX(-50%)",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Improvement Indicator */}
        {showImprovement && improvement !== 0 && (
          <div className="flex items-center gap-2">
            {improvement > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                improvement > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {improvement > 0 ? "+" : ""}
              {improvement} points
            </span>
            <span className="text-xs text-muted-foreground">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditScoreGauge;
