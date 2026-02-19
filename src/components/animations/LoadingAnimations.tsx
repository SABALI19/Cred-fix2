import { motion } from "framer-motion";
import { Loader2, CreditCard, TrendingUp, Shield } from "lucide-react";

// Basic loading spinner
export const LoadingSpinner = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    }}
    className={`inline-block ${className}`}
    style={{ width: size, height: size }}
  >
    <Loader2 size={size} />
  </motion.div>
);

// Pulse loading animation
export const PulseLoader = ({ className = "" }: { className?: string }) => (
  <div className={`flex space-x-2 ${className}`}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          delay: i * 0.2,
        }}
        className="w-3 h-3 bg-primary rounded-full"
      />
    ))}
  </div>
);

// Skeleton loader for cards
export const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-muted rounded-lg p-6 space-y-4">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted-foreground/20 rounded"></div>
        <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
      </div>
      <div className="h-8 bg-muted-foreground/20 rounded"></div>
    </div>
  </div>
);

// Progress bar animation
interface ProgressBarProps {
  progress: number;
  className?: string;
  animated?: boolean;
}

export const ProgressBar = ({
  progress,
  className = "",
  animated = true,
}: ProgressBarProps) => (
  <div className={`w-full bg-muted rounded-full h-2 ${className}`}>
    <motion.div
      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{
        duration: animated ? 1.5 : 0,
        ease: "easeInOut",
      }}
    />
  </div>
);

// Floating icons animation
export const FloatingIcons = ({ className = "" }: { className?: string }) => {
  const icons = [
    { Icon: CreditCard, delay: 0 },
    { Icon: TrendingUp, delay: 0.5 },
    { Icon: Shield, delay: 1 },
  ];

  return (
    <div className={`relative ${className}`}>
      {icons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.sin(index) * 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
          className={`absolute text-primary/30 ${
            index === 0
              ? "top-4 left-4"
              : index === 1
                ? "top-8 right-8"
                : "bottom-4 left-1/2"
          }`}
        >
          <Icon size={24} />
        </motion.div>
      ))}
    </div>
  );
};

// Page loading overlay
export const PageLoader = ({
  message = "Loading...",
}: {
  message?: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div className="text-center space-y-4">
      <LoadingSpinner size={40} />
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-muted-foreground"
      >
        {message}
      </motion.p>
    </div>
  </motion.div>
);

// Success animation
export const SuccessAnimation = ({
  message = "Success!",
  onComplete,
}: {
  message?: string;
  onComplete?: () => void;
}) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    onAnimationComplete={onComplete}
    className="flex flex-col items-center space-y-4"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </svg>
      </motion.div>
    </motion.div>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="text-foreground font-medium"
    >
      {message}
    </motion.p>
  </motion.div>
);

// Ripple effect
export const RippleEffect = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileTap="tap"
      variants={{
        tap: {
          scale: 0.95,
        },
      }}
    >
      {children}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

// Typewriter effect
interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}

export const Typewriter = ({
  text,
  delay = 0,
  speed = 100,
  className = "",
}: TypewriterProps) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + (index * speed) / 1000,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};
