import { useState, useRef, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  File,
  CheckCircle2,
  X,
  AlertCircle,
  FolderOpen,
  Image,
  FileText,
  Download,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedFile {
  id: string;
  file: File;
  category: string;
  status: "uploading" | "completed" | "error";
  progress: number;
  preview?: string;
}

const DocumentUpload = ({ isOpen, onClose }: DocumentUploadProps) => {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentCategories = [
    { value: "income", label: "Income Documents" },
    { value: "deductions", label: "Deduction Records" },
    { value: "personal", label: "Personal Information" },
    { value: "investment", label: "Investment & Banking" },
    { value: "business", label: "Business Documents" },
    { value: "other", label: "Other Documents" },
  ];

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        category: "other",
        status: "uploading",
        progress: 0,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id
                ? { ...f, preview: e.target?.result as string }
                : f,
            ),
          );
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      simulateUpload(newFile.id);
    });
  }, []);

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "completed", progress: 100 } : f,
          ),
        );
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f)),
        );
      }
    }, 200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const updateFileCategory = (fileId: string, category: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, category } : f)),
    );
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const completedFiles = uploadedFiles.filter((f) => f.status === "completed");
  const uploadingFiles = uploadedFiles.filter((f) => f.status === "uploading");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" />
            Upload Tax Documents
          </DialogTitle>
          <DialogDescription>
            Securely upload your tax documents for{" "}
            {user?.name || "your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/30 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Support for PDF, JPG, PNG, and common document formats
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Select Files
                </Button>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Uploaded Documents ({uploadedFiles.length})
                  </h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {completedFiles.length} Completed
                    </Badge>
                    {uploadingFiles.length > 0 && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        {uploadingFiles.length} Uploading
                      </Badge>
                    )}
                  </div>
                </div>

                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {uploadedFiles.map((uploadedFile) => (
                      <Card key={uploadedFile.id} className="p-4">
                        <div className="flex items-start gap-4">
                          {/* File Icon/Preview */}
                          <div className="flex-shrink-0">
                            {uploadedFile.preview ? (
                              <img
                                src={uploadedFile.preview}
                                alt="Preview"
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                {getFileIcon(uploadedFile.file)}
                              </div>
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">
                                  {uploadedFile.file.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatFileSize(uploadedFile.file.size)}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                {uploadedFile.status === "completed" && (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                )}
                                {uploadedFile.status === "uploading" && (
                                  <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(uploadedFile.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Category Selection */}
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                Category:
                              </span>
                              <Select
                                value={uploadedFile.category}
                                onValueChange={(value) =>
                                  updateFileCategory(uploadedFile.id, value)
                                }
                              >
                                <SelectTrigger className="w-48 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {documentCategories.map((category) => (
                                    <SelectItem
                                      key={category.value}
                                      value={category.value}
                                    >
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Progress Bar */}
                            {uploadedFile.status === "uploading" && (
                              <div className="mt-2">
                                <Progress
                                  value={uploadedFile.progress}
                                  className="h-2"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {Math.round(uploadedFile.progress)}% uploaded
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Your Documents Are Secure
                </h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• All files are encrypted during upload and storage</li>
                  <li>
                    • Documents are only accessible by your assigned tax
                    professional
                  </li>
                  <li>• Files are automatically deleted after tax season</li>
                  <li>• We comply with IRS data protection standards</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Save & Continue Later
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              disabled={completedFiles.length === 0}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Documents ({completedFiles.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUpload;
