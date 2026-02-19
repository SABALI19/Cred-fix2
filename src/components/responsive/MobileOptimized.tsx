import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Mobile-optimized container component
interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const MobileContainer = ({
  children,
  className = "",
  maxWidth = "lg",
}: MobileContainerProps) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        maxWidthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
};

// Mobile-optimized grid component
interface MobileGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "none" | "sm" | "md" | "lg" | "xl";
}

export const MobileGrid = ({
  children,
  className = "",
  cols = { base: 1, sm: 2, md: 3, lg: 4 },
  gap = "md",
}: MobileGridProps) => {
  const gapClasses = {
    none: "gap-0",
    sm: "gap-2 sm:gap-3",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
    xl: "gap-8 sm:gap-12",
  };

  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  const gridCols = [
    cols.base && `grid-cols-${cols.base}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("grid", gridCols, gapClasses[gap], className)}>
      {children}
    </div>
  );
};

// Mobile-optimized stack component
interface MobileStackProps {
  children: ReactNode;
  className?: string;
  direction?: "vertical" | "horizontal-mobile" | "responsive";
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
}

export const MobileStack = ({
  children,
  className = "",
  direction = "vertical",
  gap = "md",
  align = "stretch",
}: MobileStackProps) => {
  const gapClasses = {
    none: "gap-0",
    sm: "gap-2 sm:gap-3",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
    xl: "gap-8 sm:gap-12",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const directionClasses = {
    vertical: "flex flex-col",
    "horizontal-mobile": "flex flex-col sm:flex-row",
    responsive: "flex flex-col md:flex-row",
  };

  return (
    <div
      className={cn(
        directionClasses[direction],
        gapClasses[gap],
        alignClasses[align],
        className,
      )}
    >
      {children}
    </div>
  );
};

// Mobile-optimized text component
interface MobileTextProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "subtitle";
  className?: string;
}

export const MobileText = ({
  children,
  variant = "body",
  className = "",
}: MobileTextProps) => {
  const variantClasses = {
    h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold",
    h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold",
    h3: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold",
    h4: "text-base sm:text-lg md:text-xl font-semibold",
    body: "text-sm sm:text-base md:text-lg",
    subtitle: "text-base sm:text-lg md:text-xl text-muted-foreground",
    caption: "text-xs sm:text-sm text-muted-foreground",
  };

  const Component = variant.startsWith("h")
    ? (variant as keyof JSX.IntrinsicElements)
    : "p";

  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
};

// Mobile-optimized card component
interface MobileCardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
}

export const MobileCard = ({
  children,
  className = "",
  padding = "md",
  interactive = false,
}: MobileCardProps) => {
  const paddingClasses = {
    none: "p-0",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
    xl: "p-8 sm:p-12",
  };

  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-lg border border-border",
        paddingClasses[padding],
        interactive &&
          "transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
};

// Mobile-optimized button group
interface MobileButtonGroupProps {
  children: ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical" | "responsive";
  fullWidth?: boolean;
}

export const MobileButtonGroup = ({
  children,
  className = "",
  orientation = "responsive",
  fullWidth = false,
}: MobileButtonGroupProps) => {
  const orientationClasses = {
    horizontal: "flex flex-row",
    vertical: "flex flex-col",
    responsive: "flex flex-col sm:flex-row",
  };

  return (
    <div
      className={cn(
        orientationClasses[orientation],
        "gap-2 sm:gap-3",
        fullWidth && "w-full",
        className,
      )}
    >
      {children}
    </div>
  );
};

// Mobile-optimized section component
interface MobileSectionProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "accent" | "primary";
}

export const MobileSection = ({
  children,
  className = "",
  padding = "lg",
  background = "default",
}: MobileSectionProps) => {
  const paddingClasses = {
    none: "py-0",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16",
    lg: "py-16 sm:py-20",
    xl: "py-20 sm:py-24",
  };

  const backgroundClasses = {
    default: "bg-background",
    muted: "bg-muted/30",
    accent: "bg-accent/5",
    primary: "bg-primary/5",
  };

  return (
    <section
      className={cn(
        paddingClasses[padding],
        backgroundClasses[background],
        className,
      )}
    >
      <MobileContainer>{children}</MobileContainer>
    </section>
  );
};

// Mobile breakpoint hook
export const useMobileBreakpoint = () => {
  if (typeof window === "undefined") return "lg";

  const width = window.innerWidth;

  if (width < 640) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  if (width < 1280) return "lg";
  return "xl";
};

// Mobile-specific utility classes
export const mobileUtils = {
  // Touch targets - minimum 44px for accessibility
  touchTarget: "min-h-[44px] min-w-[44px]",

  // Text sizing
  headingLarge: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
  headingMedium: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
  headingSmall: "text-lg sm:text-xl md:text-2xl",
  bodyLarge: "text-base sm:text-lg md:text-xl",
  bodyMedium: "text-sm sm:text-base md:text-lg",
  bodySmall: "text-xs sm:text-sm md:text-base",

  // Spacing
  spacingSmall: "gap-2 sm:gap-3 md:gap-4",
  spacingMedium: "gap-4 sm:gap-6 md:gap-8",
  spacingLarge: "gap-6 sm:gap-8 md:gap-12",

  // Padding
  paddingSmall: "p-3 sm:p-4 md:p-6",
  paddingMedium: "p-4 sm:p-6 md:p-8",
  paddingLarge: "p-6 sm:p-8 md:p-12",

  // Mobile-first responsive design
  showOnMobile: "block sm:hidden",
  hideOnMobile: "hidden sm:block",
  stackOnMobile: "flex flex-col sm:flex-row",
  centerOnMobile: "text-center sm:text-left",
};
