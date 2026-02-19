import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const Loading = ({ size = "md", text, className }: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <p className={cn("mt-2 text-muted-foreground", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
};

const LoadingPage = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
};

const LoadingOverlay = ({
  children,
  isLoading,
  text = "Loading...",
}: {
  children: React.ReactNode;
  isLoading: boolean;
  text?: string;
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Loading size="lg" text={text} />
        </div>
      )}
    </div>
  );
};

const LoadingButton = ({
  isLoading,
  children,
  className,
  ...props
}: {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button
      className={cn("relative", className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </button>
  );
};

const LoadingCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn("animate-pulse bg-muted rounded-lg h-32 w-full", className)}
    />
  );
};

const LoadingSkeleton = ({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-muted rounded h-4 w-full"
          style={{
            width: `${Math.random() * 30 + 70}%`,
          }}
        />
      ))}
    </div>
  );
};

export {
  Loading,
  LoadingPage,
  LoadingOverlay,
  LoadingButton,
  LoadingCard,
  LoadingSkeleton,
};
export default Loading;
