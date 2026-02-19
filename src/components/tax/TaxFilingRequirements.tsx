import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DocumentUpload from "./DocumentUpload";
import {
  FileText,
  DollarSign,
  Building,
  Home,
  CreditCard,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Upload,
} from "lucide-react";

interface TaxFilingRequirementsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaxFilingRequirements = ({
  isOpen,
  onClose,
}: TaxFilingRequirementsProps) => {
  const [selectedTab, setSelectedTab] = useState("personal");
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);

  const personalDocuments = [
    {
      category: "Income Documents",
      icon: DollarSign,
      required: true,
      documents: [
        "W-2 forms from all employers",
        "1099 forms (if applicable)",
        "Self-employment income records",
        "Unemployment compensation (1099-G)",
        "Social Security benefits (SSA-1099)",
        "Retirement account distributions (1099-R)",
      ],
    },
    {
      category: "Deduction Records",
      icon: FileText,
      required: false,
      documents: [
        "Mortgage interest statements (1098)",
        "Property tax receipts",
        "Charitable donation receipts",
        "Medical expense receipts",
        "Student loan interest (1098-E)",
        "Business expense receipts",
      ],
    },
    {
      category: "Personal Information",
      icon: Users,
      required: true,
      documents: [
        "Social Security cards for all family members",
        "Driver's license or state ID",
        "Bank account information for direct deposit",
        "Last year's tax return",
        "Health insurance forms (1095-A, B, or C)",
      ],
    },
    {
      category: "Investment & Banking",
      icon: CreditCard,
      required: false,
      documents: [
        "Investment income statements (1099-DIV, 1099-INT)",
        "Capital gains/losses records",
        "Cryptocurrency transaction records",
        "Foreign account information (FBAR)",
        "Rental property income/expenses",
      ],
    },
  ];

  const businessDocuments = [
    {
      category: "Business Income",
      icon: Building,
      required: true,
      documents: [
        "Profit & Loss statements",
        "Balance sheet",
        "1099-NEC forms received",
        "Cash receipts and sales records",
        "Business bank statements",
      ],
    },
    {
      category: "Business Expenses",
      icon: FileText,
      required: true,
      documents: [
        "Office supply receipts",
        "Travel and meal expenses",
        "Equipment purchase receipts",
        "Professional service fees",
        "Insurance premiums",
        "Rent/mortgage for business property",
      ],
    },
    {
      category: "Vehicle & Equipment",
      icon: CreditCard,
      required: false,
      documents: [
        "Vehicle mileage logs",
        "Gas and maintenance receipts",
        "Equipment depreciation schedules",
        "Lease agreements",
      ],
    },
  ];

  const timeline = [
    {
      phase: "Document Collection",
      duration: "1-2 weeks",
      description:
        "Gather all required documents and organize them by category",
      icon: FileText,
    },
    {
      phase: "Initial Review",
      duration: "2-3 days",
      description:
        "Our tax professionals review your documents for completeness",
      icon: CheckCircle2,
    },
    {
      phase: "Tax Preparation",
      duration: "5-7 days",
      description: "Expert preparation and optimization of your tax return",
      icon: DollarSign,
    },
    {
      phase: "Review & Filing",
      duration: "1-2 days",
      description: "Final review with you and electronic filing with IRS",
      icon: Upload,
    },
  ];

  const currentDocuments =
    selectedTab === "personal" ? personalDocuments : businessDocuments;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Tax Filing Requirements
          </DialogTitle>
          <DialogDescription>
            Everything you need to prepare for your tax filing service
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedTab === "personal" ? "default" : "outline"}
            onClick={() => setSelectedTab("personal")}
            className="flex-1"
          >
            <Users className="w-4 h-4 mr-2" />
            Personal Taxes
          </Button>
          <Button
            variant={selectedTab === "business" ? "default" : "outline"}
            onClick={() => setSelectedTab("business")}
            className="flex-1"
          >
            <Building className="w-4 h-4 mr-2" />
            Business Taxes
          </Button>
        </div>

        {/* Document Categories */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentDocuments.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card key={index} className="h-fit">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Icon className="w-5 h-5 text-primary" />
                        {category.category}
                        {category.required ? (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.documents.map((doc, docIndex) => (
                          <li
                            key={docIndex}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Process Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Filing Process Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {timeline.map((phase, index) => {
                const Icon = phase.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-sm">{phase.phase}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {phase.duration}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {phase.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Important Notes */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Important Notes
                </h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>
                    • All documents can be uploaded securely through our portal
                  </li>
                  <li>• We accept photos, scans, or PDF files</li>
                  <li>• Missing documents may delay your filing</li>
                  <li>
                    • Our team will contact you if additional information is
                    needed
                  </li>
                  <li>• All documents are encrypted and stored securely</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              onClick={() => setIsDocumentUploadOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Start Document Upload
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Consultation
            </Button>
          </div>
        </div>

        {/* Document Upload Modal */}
        <DocumentUpload
          isOpen={isDocumentUploadOpen}
          onClose={() => setIsDocumentUploadOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaxFilingRequirements;
