import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, UserX } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "agent" | "admin";
  allowedRoles?: ("user" | "agent" | "admin")[];
}

const ProtectedRoute = ({
  children,
  requiredRole,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, openLogin } = useAuth();

  // If no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please sign in to access your dashboard
            </p>
            <Button
              onClick={openLogin}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Shield className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role permissions
  const hasPermission = () => {
    if (requiredRole) {
      return user.role === requiredRole;
    }
    if (allowedRoles) {
      return allowedRoles.includes(user.role);
    }
    return true; // No specific role required
  };

  // If user doesn't have required permissions
  if (!hasPermission()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required role: {requiredRole || allowedRoles?.join(", ")}
            </p>
            <p className="text-sm text-muted-foreground">
              Your role: {user.role}
            </p>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
