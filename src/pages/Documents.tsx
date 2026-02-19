import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Calculator,
  CreditCard,
  Upload,
  Check,
  Clock,
  AlertTriangle,
  Download,
  Archive,
} from "lucide-react";
import { motion } from "framer-motion";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("tax");

  const documentCategories = [
    {
      id: "tax",
      label: "Tax Documents",
      icon: Calculator,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      required: [
        "W-2 Forms",
        "1099 Forms", 
        "Previous Tax Returns",
        "Bank Statements",
        "Receipts & Deductions"
      ],
      uploaded: 3,
      total: 5
    },
    {
      id: "credit",
      label: "Credit Documents", 
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      required: [
        "Credit Reports (All 3 bureaus)",
        "Bank Statements",
        "Debt Documentation",
        "Financial Statements",
        "Income Verification"
      ],
      uploaded: 2,
      total: 5
    },
    {
      id: "identity",
      label: "Identity Verification",
      icon: FileText,
      color: "text-purple-600", 
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      required: [
        "Government-issued ID",
        "Social Security Card",
        "Proof of Address",
        "Passport (if applicable)"
      ],
      uploaded: 1,
      total: 4
    }
  ];

  const recentUploads = [
    {
      name: "W2_2023_Final.pdf",
      category: "Tax",
      uploadedAt: "2 hours ago",
      status: "verified",
      size: "2.4 MB"
    },
    {
      name: "Credit_Report_Experian.pdf", 
      category: "Credit",
      uploadedAt: "1 day ago",
      status: "processing",
      size: "1.8 MB"
    },
    {
      name: "Drivers_License.jpg",
      category: "Identity",
      uploadedAt: "3 days ago", 
      status: "verified",
      size: "856 KB"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <Check className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Upload className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-300",
      processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-300", 
      error: "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-300"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-700"}>
        {status}
      </Badge>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["user", "agent", "admin"]}>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Document Center</h1>
            <p className="text-muted-foreground">
              Upload and manage your tax and credit repair documents securely
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {documentCategories.map((category) => {
              const Icon = category.icon;
              const completionRate = (category.uploaded / category.total) * 100;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className={`${category.bgColor} border-0`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Icon className={`w-6 h-6 ${category.color}`} />
                        <Badge variant="secondary">
                          {category.uploaded}/{category.total}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{category.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Progress value={completionRate} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {completionRate.toFixed(0)}% Complete
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab(category.id)}
                          className={`${category.color} hover:bg-white dark:hover:bg-gray-800`}
                        >
                          Upload
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Upload Area */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tax" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Tax Docs
                  </TabsTrigger>
                  <TabsTrigger value="credit" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Credit Docs
                  </TabsTrigger>
                  <TabsTrigger value="identity" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Identity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tax" className="mt-6">
                  <DocumentUpload
                    category="tax"
                    onFilesUploaded={(files) => console.log("Tax files uploaded:", files)}
                  />
                </TabsContent>

                <TabsContent value="credit" className="mt-6">
                  <DocumentUpload
                    category="credit"
                    onFilesUploaded={(files) => console.log("Credit files uploaded:", files)}
                  />
                </TabsContent>

                <TabsContent value="identity" className="mt-6">
                  <DocumentUpload
                    category="identity"
                    onFilesUploaded={(files) => console.log("Identity files uploaded:", files)}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Uploads */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUploads.map((upload, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {getStatusIcon(upload.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {upload.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {upload.size}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {upload.uploadedAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(upload.status)}
                          <Badge variant="outline" className="text-xs">
                            {upload.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Archive className="w-4 h-4 mr-2" />
                    View All Documents
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Upload
                  </Button>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Not sure what documents to upload? Our team can help guide you through the process.
                  </p>
                  <Button className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Documents;
