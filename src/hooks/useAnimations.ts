import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Hook for scroll-triggered animations
export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
    amount: threshold,
  });

  return { ref, isInView };
};

// Hook for stagger animations
export const useStaggerAnimation = (itemCount: number, baseDelay = 0.1) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      // Gradually show items with stagger effect
      const timeouts: NodeJS.Timeout[] = [];

      for (let i = 0; i < itemCount; i++) {
        const timeout = setTimeout(
          () => {
            setVisibleItems((prev) => [...prev, i]);
          },
          i * baseDelay * 1000,
        );

        timeouts.push(timeout);
      }

      return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      };
    }
  }, [isInView, itemCount, baseDelay]);

  return { ref, visibleItems, isInView };
};

// Hook for typing animation
export const useTypingAnimation = (text: string, speed = 100) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const start = () => {
    if (isStarted) return;
    setIsStarted(true);

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  };

  const reset = () => {
    setDisplayedText("");
    setIsComplete(false);
    setIsStarted(false);
  };

  return { displayedText, isComplete, start, reset };
};

// Hook for parallax effect
export const useParallax = (strength = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset * strength);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [strength]);

  return offsetY;
};

// Hook for mouse tracking
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
};

// Hook for intersection observer
export const useIntersectionObserver = (
  options = { threshold: 0.1, rootMargin: "0px" },
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return { ref, isVisible };
};

// Hook for loading animation
export const useLoadingAnimation = (duration = 2000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsLoading(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 100 / (duration / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  return { isLoading, progress };
};

// Hook for element bouncing on mount
export const useBounceOnMount = (delay = 0) => {
  const [shouldBounce, setShouldBounce] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldBounce(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldBounce;
};

// Hook for counter animation
export const useCountAnimation = (
  endValue: number,
  duration = 2000,
  startValue = 0,
) => {
  const [count, setCount] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const startCounting = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const increment = endValue / (duration / 16); // 60fps
    let currentValue = startValue;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= endValue) {
        setCount(endValue);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setCount(Math.floor(currentValue));
      }
    }, 16);

    return () => clearInterval(timer);
  };

  return { count, startCounting, isAnimating };
};
