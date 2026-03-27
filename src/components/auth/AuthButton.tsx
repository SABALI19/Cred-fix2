import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthButtonProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  action?: "signup" | "login";
  redirectTo?: string;
}

const AuthButton = ({
  children,
  className,
  variant = "default",
  size = "default",
  action = "signup",
  redirectTo,
}: AuthButtonProps) => {
  const { user, openSignUp, openLogin } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user && redirectTo) {
      // If user is logged in and we have a redirect, navigate there
      navigate(redirectTo);
    } else if (!user) {
      // If user is not logged in, show auth modal
      if (action === "login") {
        openLogin();
      } else {
        openSignUp();
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
    >
      {children}
    </Button>
  );
};

export default AuthButton;
