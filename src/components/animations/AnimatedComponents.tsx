import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import {
  fadeUpVariants,
  staggerContainer,
  staggerItem,
  scaleVariants,
  slideInLeft,
  slideInRight,
  bounceVariants,
  cardHoverVariants,
  buttonVariants,
  floatVariants,
  pulseVariants,
} from "@/lib/animations";

interface AnimatedContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

// Animated Container with fade up
export const AnimatedContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps
>(({ children, delay = 0, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeUpVariants}
    transition={{ delay }}
    {...props}
  >
    {children}
  </motion.div>
));

// Stagger animation container
export const StaggerContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={staggerContainer}
    {...props}
  >
    {children}
  </motion.div>
));

// Stagger animation item
export const StaggerItem = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, ...props }, ref) => (
    <motion.div ref={ref} variants={staggerItem} {...props}>
      {children}
    </motion.div>
  ),
);

// Scale animation
export const ScaleContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps
>(({ children, delay = 0, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={scaleVariants}
    transition={{ delay }}
    {...props}
  >
    {children}
  </motion.div>
));

// Slide in from left
export const SlideInLeft = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, delay = 0, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={slideInLeft}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  ),
);

// Slide in from right
export const SlideInRight = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, delay = 0, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={slideInRight}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  ),
);

// Bounce animation
export const BounceContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps
>(({ children, delay = 0, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={bounceVariants}
    transition={{ delay }}
    {...props}
  >
    {children}
  </motion.div>
));

// Hover card animation
export const HoverCard = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHoverVariants}
      {...props}
    >
      {children}
    </motion.div>
  ),
);

// Animated button
export const AnimatedButton = forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(({ children, ...props }, ref) => (
  <motion.button
    ref={ref}
    initial="rest"
    whileHover="hover"
    whileTap="tap"
    variants={buttonVariants}
    {...props}
  >
    {children}
  </motion.button>
));

// Float animation
export const FloatContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps
>(({ children, ...props }, ref) => (
  <motion.div ref={ref} variants={floatVariants} animate="animate" {...props}>
    {children}
  </motion.div>
));

// Pulse animation
export const PulseContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps
>(({ children, ...props }, ref) => (
  <motion.div ref={ref} variants={pulseVariants} animate="animate" {...props}>
    {children}
  </motion.div>
));

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({
  children,
  className = "",
}: PageTransitionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{
      duration: 0.5,
      ease: [0.04, 0.62, 0.23, 0.98],
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Loading spinner
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
    <div
      className="border-2 border-primary border-t-transparent rounded-full"
      style={{ width: size, height: size }}
    />
  </motion.div>
);

// Count up animation
interface CountUpProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
}

export const CountUp = ({
  from,
  to,
  duration = 2,
  className = "",
}: CountUpProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration,
          ease: "easeOut",
          onUpdate: (latest) => {
            const element = document.getElementById(`count-${from}-${to}`);
            if (element) {
              const current = Math.round(from + (to - from) * latest);
              element.textContent = current.toLocaleString();
            }
          },
        }}
      >
        <span id={`count-${from}-${to}`}>{from}</span>
      </motion.span>
    </motion.div>
  );
};

AnimatedContainer.displayName = "AnimatedContainer";
StaggerContainer.displayName = "StaggerContainer";
StaggerItem.displayName = "StaggerItem";
ScaleContainer.displayName = "ScaleContainer";
SlideInLeft.displayName = "SlideInLeft";
SlideInRight.displayName = "SlideInRight";
BounceContainer.displayName = "BounceContainer";
HoverCard.displayName = "HoverCard";
AnimatedButton.displayName = "AnimatedButton";
FloatContainer.displayName = "FloatContainer";
PulseContainer.displayName = "PulseContainer";
