import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = "",
  once = true,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-50px",
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [once]);

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      default:
        return { y: distance, x: 0 };
    }
  };

  const initial = {
    opacity: 0,
    ...getInitialPosition(),
  };

  const animate = {
    opacity: isVisible ? 1 : 0,
    x: isVisible ? 0 : getInitialPosition().x,
    y: isVisible ? 0 : getInitialPosition().y,
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: [0.04, 0.62, 0.23, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Batch reveal for multiple items
interface BatchRevealProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export const BatchReveal = ({
  children,
  staggerDelay = 0.1,
  className = "",
}: BatchRevealProps) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal key={index} delay={index * staggerDelay}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

// Typing reveal effect
interface TypingRevealProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}

export const TypingReveal = ({
  text,
  delay = 0,
  speed = 50,
  className = "",
}: TypingRevealProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isStarted) {
            setIsStarted(true);

            const startDelay = setTimeout(() => {
              let index = 0;
              const timer = setInterval(() => {
                if (index < text.length) {
                  setDisplayedText(text.slice(0, index + 1));
                  index++;
                } else {
                  clearInterval(timer);
                }
              }, speed);

              return () => clearInterval(timer);
            }, delay);

            return () => clearTimeout(startDelay);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [text, speed, delay, isStarted]);

  return (
    <div ref={ref} className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-5 bg-current ml-1"
      />
    </div>
  );
};

// Number counter with scroll trigger
interface CounterRevealProps {
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const CounterReveal = ({
  from,
  to,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
}: CounterRevealProps) => {
  const [count, setCount] = useState(from);
  const [isStarted, setIsStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isStarted) {
            setIsStarted(true);

            const startDelay = setTimeout(() => {
              const increment = (to - from) / (duration * 60); // 60fps
              let current = from;

              const timer = setInterval(() => {
                current += increment;
                if (current >= to) {
                  setCount(to);
                  clearInterval(timer);
                } else {
                  setCount(Math.floor(current));
                }
              }, 1000 / 60);

              return () => clearInterval(timer);
            }, delay);

            return () => clearTimeout(startDelay);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [from, to, duration, delay, isStarted]);

  return (
    <div ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};
