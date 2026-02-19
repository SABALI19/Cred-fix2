import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ExternalLink,
  CheckCircle2,
  FileText,
  Camera,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IRSVerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const IRSVerificationPopup = ({
  isOpen,
  onClose,
}: IRSVerificationPopupProps) => {
  const handleVisitIRS = () => {
    window.open("https://www.irs.gov/identity-theft-fraud-scams", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <DialogHeader>
                <motion.div
                  className="flex items-center space-x-2 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Shield className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <DialogTitle className="text-xl text-blue-800">
                    🔐 IRS Security Notice: ID.me Verification May Be Required
                  </DialogTitle>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <DialogDescription className="text-base leading-relaxed">
                    To protect your identity and ensure fast refund processing,
                    the IRS may require you to verify through ID.me — their
                    official identity verification partner.
                  </DialogDescription>
                </motion.div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Important Notice */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                            Why This Matters
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                            The IRS uses ID.me to prevent identity theft and tax
                            fraud. This verification ensures that only you can
                            access your tax account and receive your refunds
                            safely.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* What You'll Need */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <motion.h4
                    className="font-semibold mb-4 flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <motion.div
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      <FileText className="w-5 h-5 text-primary" />
                    </motion.div>
                    What You'll Need Ready
                  </motion.h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: CreditCard,
                        color: "text-green-600",
                        title: "Government-Issued ID",
                        desc: "Driver's license, passport, or state ID",
                      },
                      {
                        icon: Shield,
                        color: "text-blue-600",
                        title: "Social Security Number",
                        desc: "Your complete SSN for verification",
                      },
                      {
                        icon: Camera,
                        color: "text-purple-600",
                        title: "Camera-Ready Device",
                        desc: "Phone, tablet, or computer with camera",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <Card className="border-border/50">
                          <CardContent className="p-4 text-center">
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: 1.0 + index * 0.1,
                              }}
                            >
                              <item.icon
                                className={`w-8 h-8 ${item.color} mx-auto mb-2`}
                              />
                            </motion.div>
                            <h5 className="font-medium mb-1">{item.title}</h5>
                            <p className="text-xs text-muted-foreground">
                              {item.desc}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Process Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                >
                  <h4 className="font-semibold mb-4">
                    The Verification Process
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        title: "One-Time Setup",
                        desc: "You only need to verify once for all IRS online services",
                      },
                      {
                        title: "Secure & Private",
                        desc: "Your information is encrypted and protected by law",
                      },
                      {
                        title: "Fast Processing",
                        desc: "Verified accounts get faster refund processing",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
                      >
                        <motion.div
                          className="bg-primary/10 rounded-full p-1 mt-0.5"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 1.4 + index * 0.1,
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </motion.div>
                        <div>
                          <h5 className="font-medium text-sm">{item.title}</h5>
                          <p className="text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Warning */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.6 }}
                >
                  <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <motion.div
                          initial={{ rotate: -10, scale: 0.8 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ duration: 0.3, delay: 1.7 }}
                        >
                          <Shield className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                            ⚠️ Important Security Reminder
                          </h4>
                          <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                            <strong>Always use official IRS websites</strong>{" "}
                            (irs.gov). Never verify your identity through
                            unofficial websites or respond to unsolicited
                            emails, texts, or calls claiming to be from the IRS.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.8 }}
                >
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleVisitIRS}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      👉 Learn More on IRS.gov
                    </Button>
                  </motion.div>
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="w-full"
                    >
                      I'll Verify Later
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 2.0 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-300"
                  >
                    ✅ This is a one-time secure process
                  </Badge>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default IRSVerificationPopup;
