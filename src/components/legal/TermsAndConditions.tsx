import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Shield, FileText, DollarSign, Users, X } from "lucide-react";

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

const TermsAndConditions = ({
  isOpen,
  onClose,
  onAccept,
  showAcceptButton = false,
}: TermsAndConditionsProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Terms and Conditions
          </DialogTitle>
          <DialogDescription>
            CreditFix Pro - Effective Date: January 1, 2024
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            {/* Section 1 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Acceptance of Terms
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using any services offered by CreditFix Pro,
                including credit repair, tax preparation, financial planning,
                and related services, you agree to be bound by these Terms and
                Conditions. If you do not accept these terms, do not use our
                platform or services. Your continued use of our services
                constitutes ongoing acceptance of these terms.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Services Offered
              </h3>
              <p className="text-muted-foreground mb-4">
                CreditFix Pro offers a comprehensive range of financial services
                to residents of the United States, including:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="border border-border/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Credit Repair Services
                  </h4>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>• Credit report retrieval and monitoring</li>
                    <li>• Credit score tracking and analysis</li>
                    <li>• Dispute management and resolution</li>
                    <li>• Credit repair education and counseling</li>
                    <li>• Identity theft recovery assistance</li>
                    <li>• Credit building guidance and strategies</li>
                  </ul>
                </div>

                <div className="border border-border/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Tax Preparation Services
                  </h4>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>• Federal and state tax filing assistance</li>
                    <li>• Professional tax return preparation</li>
                    <li>• Tax refund optimization and tracking</li>
                    <li>• IRS compliance support and representation</li>
                    <li>• Tax consultation and document review</li>
                    <li>• Business tax preparation and planning</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Professional Services
                </h4>
                <p className="text-muted-foreground text-xs">
                  Services are delivered through our secure digital platform and
                  by our team of certified specialists, including licensed tax
                  professionals, certified credit counselors, and financial
                  advisors. CreditFix Pro partners with licensed professionals
                  as needed to ensure compliance with all applicable
                  regulations.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                User Eligibility and Verification
              </h3>
              <p className="text-muted-foreground mb-3">
                To use our services, you must:
              </p>
              <ul className="text-muted-foreground space-y-2 ml-4">
                <li>• Be at least 18 years old</li>
                <li>• Be a legal U.S. resident with a valid SSN or ITIN</li>
                <li>
                  • Provide truthful, accurate personal and financial
                  information
                </li>
                <li>
                  • Submit a complete residential address for verification
                  purposes
                </li>
                <li>
                  • Upload a valid driver's license or state-issued photo ID for
                  identity verification
                </li>
                <li>
                  • Consent to the retrieval of your credit reports and tax
                  records when required
                </li>
              </ul>
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                  <strong>Identity Verification:</strong> All uploaded
                  identification documents are encrypted and stored securely in
                  compliance with federal privacy regulations. We may verify
                  your identity through third-party verification services.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  4
                </span>
                Consent and Authorization
              </h3>
              <p className="text-muted-foreground mb-3">
                By using our platform, you authorize CreditFix Pro to:
              </p>
              <ul className="text-muted-foreground space-y-2 ml-4">
                <li>
                  • Access your credit reports and scores through authorized
                  consumer reporting agencies (Experian, Equifax, TransUnion)
                </li>
                <li>
                  • Submit disputes and correspondence to credit bureaus on your
                  behalf
                </li>
                <li>
                  • Collect and process tax-related information needed to
                  prepare your federal and/or state returns
                </li>
                <li>
                  • Transmit completed tax returns to the IRS or state agencies
                  on your behalf (with your express consent)
                </li>
                <li>
                  • Communicate with creditors, collection agencies, and
                  financial institutions regarding your accounts
                </li>
                <li>
                  • Store and process your documents in our secure document
                  management system
                </li>
              </ul>
              <p className="text-muted-foreground mt-3 text-xs">
                You agree to electronically sign any necessary IRS forms (e.g.,
                Form 8879 for e-file authorization) and provide written consent
                for specific actions as required by law.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  5
                </span>
                User Responsibilities
              </h3>
              <p className="text-muted-foreground mb-3">You agree to:</p>
              <ul className="text-muted-foreground space-y-2 ml-4">
                <li>
                  • Provide accurate, complete, and up-to-date personal,
                  financial, and tax information
                </li>
                <li>• Keep your login credentials confidential and secure</li>
                <li>
                  • Review all documents, reports, and disclosures before
                  approval or submission
                </li>
                <li>
                  • Respond promptly to requests for additional information or
                  documentation
                </li>
                <li>
                  • Use the platform in accordance with U.S. laws, IRS
                  regulations, and credit industry standards
                </li>
                <li>
                  • Notify us immediately of any unauthorized access to your
                  account
                </li>
                <li>
                  • Upload only legitimate, unaltered identification and
                  financial documents
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  6
                </span>
                Payment, Fees, and Refund Policy
              </h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  CreditFix Pro offers three service tiers with transparent
                  pricing:
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="border border-border/50 rounded-lg p-3">
                    <h4 className="font-semibold text-sm">Basic Plan</h4>
                    <p className="text-muted-foreground text-xs">
                      $89/month - Credit analysis and tax consultation
                    </p>
                  </div>
                  <div className="border border-border/50 rounded-lg p-3">
                    <h4 className="font-semibold text-sm">Professional Plan</h4>
                    <p className="text-muted-foreground text-xs">
                      $149/month - Full credit repair and tax filing
                    </p>
                  </div>
                  <div className="border border-border/50 rounded-lg p-3">
                    <h4 className="font-semibold text-sm">Premium Plan</h4>
                    <p className="text-muted-foreground text-xs">
                      $299/month - Complete services with audit protection
                    </p>
                  </div>
                </div>
                <ul className="text-muted-foreground space-y-1 ml-4 text-xs">
                  <li>
                    • All fees are clearly disclosed before payment and charged
                    monthly
                  </li>
                  <li>
                    • Tax filing fees are due prior to submission unless
                    otherwise stated
                  </li>
                  <li>
                    • Refunds are available within 30 days if services have not
                    been initiated
                  </li>
                  <li>
                    • You may cancel your subscription at any time with 30 days
                    notice
                  </li>
                  <li>
                    • No refunds for completed tax filings or submitted credit
                    disputes
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  7
                </span>
                Data Privacy and Security
              </h3>
              <p className="text-muted-foreground mb-3">
                CreditFix Pro is committed to protecting your privacy and
                securing your personal information:
              </p>
              <ul className="text-muted-foreground space-y-2 ml-4 text-xs">
                <li>
                  • All credit, tax, and personal data is collected with your
                  explicit consent
                </li>
                <li>
                  • Data is stored in encrypted, SOC 2 compliant secure
                  environments
                </li>
                <li>
                  • Information is shared only with verified agents, partners,
                  or service providers for service delivery
                </li>
                <li>
                  • Driver's license and identification documents are encrypted
                  and automatically deleted after verification
                </li>
                <li>
                  • We comply with GLBA, FCRA, and other applicable privacy
                  regulations
                </li>
                <li>
                  • You may request data deletion at any time (subject to legal
                  retention requirements)
                </li>
              </ul>
              <p className="text-muted-foreground mt-3 text-xs">
                See our complete{" "}
                <span className="text-primary font-semibold cursor-pointer">
                  Privacy Policy
                </span>{" "}
                for detailed information about data collection, use, and
                protection.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  8
                </span>
                Third-Party Providers and Disclaimers
              </h3>
              <p className="text-muted-foreground mb-3">
                CreditFix Pro works with licensed third-party professionals,
                credit bureaus, tax software providers, and financial
                institutions. While we carefully vet our partners:
              </p>
              <ul className="text-muted-foreground space-y-1 ml-4 text-xs">
                <li>
                  • We are not responsible for errors or omissions made by
                  external providers
                </li>
                <li>
                  • You are responsible for reviewing all documents before final
                  approval
                </li>
                <li>
                  • Credit bureau decisions and IRS processing are beyond our
                  control
                </li>
                <li>
                  • Results may vary based on your unique financial situation
                </li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  9
                </span>
                Limitation of Liability
              </h3>
              <p className="text-muted-foreground mb-3">
                CreditFix Pro is not liable for:
              </p>
              <ul className="text-muted-foreground space-y-1 ml-4 text-xs">
                <li>
                  • Errors caused by inaccurate information provided by the user
                </li>
                <li>
                  • Rejections or delays by the IRS, state agencies, or credit
                  bureaus
                </li>
                <li>
                  • Missed tax deadlines resulting from late or incomplete
                  submissions
                </li>
                <li>
                  • Credit score fluctuations due to factors outside our control
                </li>
                <li>• Third-party data breaches or system failures</li>
              </ul>
              <p className="text-muted-foreground mt-3 text-xs">
                To the fullest extent allowed by law, our total liability is
                limited to the amount paid for the affected service in the
                preceding 12 months.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  10
                </span>
                Account Termination
              </h3>
              <p className="text-muted-foreground">
                We may suspend or terminate your account at our discretion for:
                fraudulent behavior, misuse of the platform, violation of these
                terms, or violation of applicable laws. You may terminate your
                account at any time through your account settings or by
                contacting customer support.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  11
                </span>
                Governing Law and Dispute Resolution
              </h3>
              <p className="text-muted-foreground">
                These Terms are governed by the laws of the State of Delaware
                and applicable federal U.S. law. Any disputes will be resolved
                through binding arbitration in accordance with the rules of the
                American Arbitration Association.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  12
                </span>
                Modifications to Terms
              </h3>
              <p className="text-muted-foreground">
                We may update these Terms periodically to reflect changes in our
                services or legal requirements. Continued use of CreditFix Pro
                after updates constitutes acceptance of the new version. You
                will be notified of material changes via email or platform
                notification.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  13
                </span>
                Contact Information
              </h3>
              <p className="text-muted-foreground mb-3">
                If you have questions about these Terms or any service:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <strong>📧 Email:</strong> support@creditfixpro.com
                </p>
                <p className="text-sm">
                  <strong>📞 Phone:</strong> 1-800-CREDITFIX (1-800-273-3483)
                </p>
                <p className="text-sm">
                  <strong>📍 Mailing Address:</strong>
                  <br />
                  CreditFix Pro, LLC
                  <br />
                  123 Financial Center Drive
                  <br />
                  Suite 500
                  <br />
                  New York, NY 10004
                </p>
                <p className="text-sm">
                  <strong>🕒 Business Hours:</strong> Monday-Friday, 8 AM - 8 PM
                  EST
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t pt-4 mt-6">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Last Updated:</strong> January 1, 2024 | CreditFix Pro,
                LLC - All Rights Reserved
                <br />
                Licensed in all 50 states | NMLS ID: 123456 | Equal Housing
                Opportunity
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          {showAcceptButton && onAccept && (
            <Button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Shield className="w-4 h-4 mr-2" />I Accept These Terms
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditions;
