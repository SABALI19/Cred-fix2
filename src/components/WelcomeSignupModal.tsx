import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WelcomeSignupModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:w-full sm:max-w-[32rem] min-h-[200px] sm:min-h-[240px] rounded-xl sm:rounded-2xl border-primary/20 bg-gradient-to-br from-background via-background to-primary/10 p-5 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome
          </DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-foreground/90 leading-relaxed">
            Sign up today to book a consultation with our qualified agents in a click.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeSignupModal;
