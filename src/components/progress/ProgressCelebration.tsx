import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  Star,
  Target,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  Gift,
  Share2,
  Download,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  bgColor: string;
  type: "milestone" | "streak" | "improvement" | "special";
  value?: number;
  maxValue?: number;
  unlockedAt: Date;
  isNew?: boolean;
}

interface ProgressCelebrationProps {
  achievement?: Achievement;
  onClose?: () => void;
  onShare?: () => void;
}

const ProgressCelebration = ({ achievement, onClose, onShare }: ProgressCelebrationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setShowConfetti(true);

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const Icon = achievement.icon;

  return (
    <Dialog open={isVisible} onOpenChange={(open) => {
      setIsVisible(open);
      if (!open) onClose?.();
    }}>
      <DialogContent className="max-w-md relative overflow-hidden">
        {/* CSS Celebration Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '1s' }} />
            <div className="absolute top-0 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1.2s' }} />
            <div className="absolute top-0 left-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-0 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.7s' }} />
            <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.9s' }} />
            <div className="absolute top-1/4 right-1/6 w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1.1s' }} />
          </div>
        )}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="text-center relative z-10"
        >
          <DialogHeader className="space-y-4">
            <div className="mx-auto">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className={`w-20 h-20 rounded-full ${achievement.bgColor} flex items-center justify-center mx-auto mb-4`}
              >
                <Icon className={`w-10 h-10 ${achievement.color}`} />
              </motion.div>
            </div>
            <DialogTitle className="text-2xl font-bold">
              🎉 Congratulations!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-primary">
                {achievement.title}
              </h3>
              <p className="text-muted-foreground mt-2">
                {achievement.description}
              </p>
            </motion.div>

            {achievement.value && achievement.maxValue && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="bg-muted rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {achievement.value}/{achievement.maxValue}
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.value / achievement.maxValue) * 100}%` }}
                    transition={{ delay: 0.6, duration: 1 }}
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-2 justify-center"
            >
              <Button onClick={onShare} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={() => {/* Download certificate */}} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Save
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xs text-muted-foreground"
            >
              Unlocked on {achievement.unlockedAt.toLocaleDateString()}
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// Achievements List Component
export const AchievementsList = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const achievements: Achievement[] = [
    {
      id: "first-upload",
      title: "Document Warrior",
      description: "Uploaded your first document",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-950/20",
      type: "milestone",
      unlockedAt: new Date(Date.now() - 86400000),
    },
    {
      id: "score-improvement",
      title: "Score Booster",
      description: "Improved credit score by 50+ points",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950/20",
      type: "improvement",
      value: 75,
      maxValue: 100,
      unlockedAt: new Date(Date.now() - 172800000),
    },
    {
      id: "weekly-streak",
      title: "Consistency Champion",
      description: "Logged in 7 days in a row",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950/20",
      type: "streak",
      value: 7,
      maxValue: 7,
      unlockedAt: new Date(Date.now() - 259200000),
      isNew: true,
    },
    {
      id: "disputes-filed",
      title: "Dispute Master",
      description: "Filed 10 successful disputes",
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950/20",
      type: "milestone",
      value: 10,
      maxValue: 10,
      unlockedAt: new Date(Date.now() - 345600000),
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "milestone": return Target;
      case "streak": return Zap;
      case "improvement": return TrendingUp;
      case "special": return Gift;
      default: return Star;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      milestone: "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300",
      streak: "bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-300",
      improvement: "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-300",
      special: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-300",
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || colors.milestone}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Achievements</h2>
        <Badge variant="secondary">
          {achievements.length} unlocked
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const TypeIcon = getTypeIcon(achievement.type);

          return (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <Card className="cursor-pointer hover:shadow-md transition-all relative">
                {achievement.isNew && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-red-500 text-white animate-pulse">
                      New!
                    </Badge>
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg ${achievement.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${achievement.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {achievement.title}
                        </h3>
                        {getTypeBadge(achievement.type)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TypeIcon className="w-3 h-3" />
                        {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <ProgressCelebration
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        onShare={() => {
          // Share achievement
          console.log("Sharing achievement:", selectedAchievement);
        }}
      />
    </div>
  );
};

export default ProgressCelebration;
