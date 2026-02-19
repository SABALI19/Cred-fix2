import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              Your privacy and data security are our top priorities
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-primary" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                CreditFix Pro ("we," "our," or "us") is committed to protecting
                your privacy and personal information. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our credit repair and tax filing
                services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using our services, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Full name, email address, phone number</li>
                    <li>• Mailing address and billing address</li>
                    <li>• Social Security Number (for credit reporting)</li>
                    <li>• Date of birth and employment information</li>
                    <li>• Financial information including income and debts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Credit Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      • Credit reports from Experian, Equifax, and TransUnion
                    </li>
                    <li>• Credit scores and credit history</li>
                    <li>• Account information and payment history</li>
                    <li>• Dispute records and correspondence</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tax Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• W-2s, 1099s, and other tax documents</li>
                    <li>• Income, deductions, and tax liability information</li>
                    <li>• Previous year tax returns</li>
                    <li>• Bank account information for refunds</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Technical Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• IP address, browser type, and device information</li>
                    <li>• Website usage data and analytics</li>
                    <li>• Cookies and similar tracking technologies</li>
                    <li>• Login credentials and account preferences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Service Delivery</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Provide credit repair and tax filing services</li>
                    <li>• Monitor your credit reports and scores</li>
                    <li>• File disputes with credit bureaus</li>
                    <li>• Prepare and file tax returns</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Communication</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Send service updates and progress reports</li>
                    <li>• Provide customer support</li>
                    <li>• Send important notices about your account</li>
                    <li>• Marketing communications (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Legal Compliance</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Comply with applicable laws and regulations</li>
                    <li>• Respond to legal requests and court orders</li>
                    <li>• Prevent fraud and protect our rights</li>
                    <li>• Maintain records as required by law</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share your information only in the
                  following circumstances:
                </p>

                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Service Providers
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Credit bureaus, tax authorities, and other service
                      providers necessary to deliver our services
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                      Legal Requirements
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      When required by law, court order, or government authority
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      Business Transfers
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      In connection with mergers, acquisitions, or asset sales
                      (with your consent)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-primary" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We implement robust security measures to protect your personal
                  information:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Technical Safeguards</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 256-bit SSL encryption</li>
                      <li>• Multi-factor authentication</li>
                      <li>• Regular security audits</li>
                      <li>• Intrusion detection systems</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Administrative Safeguards</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Employee background checks</li>
                      <li>• Privacy training programs</li>
                      <li>• Access controls and monitoring</li>
                      <li>• Incident response procedures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  You have the following rights regarding your personal
                  information:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Access and Review</h4>
                      <p className="text-sm text-muted-foreground">
                        Request access to your personal information we maintain
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Correction</h4>
                      <p className="text-sm text-muted-foreground">
                        Request correction of inaccurate or incomplete
                        information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Deletion</h4>
                      <p className="text-sm text-muted-foreground">
                        Request deletion of your personal information (subject
                        to legal requirements)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Opt-Out</h4>
                      <p className="text-sm text-muted-foreground">
                        Opt-out of marketing communications at any time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <strong>Email:</strong> privacy@creditfixpro.com
                </div>
                <div>
                  <strong>Phone:</strong> (555) 123-4567
                </div>
                <div>
                  <strong>Mail:</strong> CreditFix Pro Privacy Department
                  <br />
                  123 Financial Street
                  <br />
                  New York, NY 10001
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
