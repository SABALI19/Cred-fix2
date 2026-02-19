import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Mail, ArrowLeft, Lock } from "lucide-react";

interface PasswordResetProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordReset = ({ isOpen, onClose }: PasswordResetProps) => {
  const [step, setStep] = useState<"email" | "sent" | "reset">("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep("sent");
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      handleClose();
      // Show success message
      alert(
        "Password reset successfully! You can now log in with your new password.",
      );
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  const renderEmailStep = () => (
    <>
      <DialogHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
            <Mail className="w-6 h-6 text-primary" />
          </div>
        </div>
        <DialogTitle className="text-2xl font-bold">Reset Password</DialogTitle>
        <DialogDescription>
          Enter your email address and we'll send you a link to reset your
          password
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleClose}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </form>
    </>
  );

  const renderSentStep = () => (
    <>
      <DialogHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <DialogTitle className="text-2xl font-bold">
          Check Your Email
        </DialogTitle>
        <DialogDescription>
          We've sent a password reset link to {email}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            Click the link in your email to reset your password. The link will
            expire in 1 hour.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="resetCode">
            Or enter the 6-digit code from your email:
          </Label>
          <Input
            id="resetCode"
            placeholder="Enter 6-digit code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            maxLength={6}
          />
        </div>

        <Button
          className="w-full"
          onClick={() => setStep("reset")}
          disabled={resetCode.length !== 6}
        >
          Continue with Code
        </Button>

        <div className="text-center space-y-2">
          <Button
            variant="ghost"
            onClick={() => setStep("email")}
            className="text-sm"
          >
            Didn't receive an email? Try again
          </Button>
          <Button variant="ghost" onClick={handleClose} className="text-sm">
            Back to Login
          </Button>
        </div>
      </div>
    </>
  );

  const renderResetStep = () => (
    <>
      <DialogHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
            <Lock className="w-6 h-6 text-primary" />
          </div>
        </div>
        <DialogTitle className="text-2xl font-bold">
          Create New Password
        </DialogTitle>
        <DialogDescription>Enter your new password below</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleResetSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <h4 className="font-medium mb-2">Password requirements:</h4>
          <ul className="space-y-1">
            <li className={newPassword.length >= 6 ? "text-green-600" : ""}>
              • At least 6 characters
            </li>
            <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
              • One uppercase letter
            </li>
            <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
              • One number
            </li>
          </ul>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setStep("sent")}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </form>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "email" && renderEmailStep()}
        {step === "sent" && renderSentStep()}
        {step === "reset" && renderResetStep()}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordReset;
