import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error?: Error;
    errorInfo?: React.ErrorInfo;
    resetError: () => void;
  }>;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service in production
    console.error("Error caught by boundary:", error, errorInfo);

    // In production, you would send this to your error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            resetError={this.resetError}
          />
        );
      }

      return <DefaultErrorFallback resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ resetError: () => void }> = ({
  resetError,
}) => {
  const handleReportError = () => {
    window.open(
      "mailto:support@creditfixpro.com?subject=Error Report&body=I encountered an error on the CreditFix Pro website.",
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              We're sorry, but something unexpected happened. This error has
              been reported to our team.
            </p>
            <p className="text-sm">
              Error ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={resetError} className="w-full" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>

            <Button
              variant="ghost"
              onClick={handleReportError}
              className="w-full"
              size="sm"
            >
              <Mail className="w-4 h-4 mr-2" />
              Report this error
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Need immediate help?{" "}
              <a
                href="tel:+15551234567"
                className="text-primary font-medium hover:underline"
              >
                Call (555) 123-4567
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorBoundary;
export { DefaultErrorFallback };
