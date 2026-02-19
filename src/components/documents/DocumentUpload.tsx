import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  File,
  X,
  Check,
  Eye,
  Download,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Archive,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: "tax" | "credit" | "identity";
  status: "uploading" | "completed" | "error";
  uploadProgress: number;
  preview?: string;
  uploadedAt: Date;
}

interface DocumentUploadProps {
  category?: "tax" | "credit" | "identity";
  onFilesUploaded?: (files: UploadedFile[]) => void;
}

const DocumentUpload = ({ category, onFilesUploaded }: DocumentUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const allowedTypes = {
    tax: [".pdf", ".png", ".jpg", ".jpeg", ".w2", ".1099"],
    credit: [".pdf", ".png", ".jpg", ".jpeg"],
    identity: [".pdf", ".png", ".jpg", ".jpeg"],
  };

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return ImageIcon;
    if (type.includes("pdf")) return FileText;
    if (type.includes("zip") || type.includes("rar")) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    const allowedExtensions = category ? allowedTypes[category] : [".pdf", ".png", ".jpg", ".jpeg"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!allowedExtensions.some(ext => fileExtension === ext)) {
      return `File type not allowed. Allowed types: ${allowedExtensions.join(", ")}`;
    }

    return null;
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.uploadProgress + Math.random() * 30, 100);
          return {
            ...file,
            uploadProgress: newProgress,
            status: newProgress === 100 ? "completed" : "uploading"
          };
        }
        return file;
      }));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, status: "completed", uploadProgress: 100 } : file
      ));
    }, 3000);
  };

  const handleFileSelection = useCallback((selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(selectedFiles).forEach(file => {
      const error = validateFile(file);
      if (error) {
        // Show error for invalid files
        return;
      }

      const fileId = Date.now().toString() + Math.random().toString(36);
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        category: category || "credit",
        status: "uploading",
        uploadProgress: 0,
        uploadedAt: new Date(),
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, preview: e.target?.result as string } : f
          ));
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
      simulateUpload(fileId);
    });

    setFiles(prev => [...prev, ...newFiles]);
    onFilesUploaded?.(newFiles);
  }, [category, onFilesUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelection(droppedFiles);
    }
  }, [handleFileSelection]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const previewDocument = (file: UploadedFile) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const categoryLabels = {
    tax: "Tax Documents",
    credit: "Credit Documents", 
    identity: "Identity Documents"
  };

  const categoryDescriptions = {
    tax: "Upload W-2s, 1099s, receipts, and other tax-related documents",
    credit: "Upload credit reports, bank statements, and financial documents",
    identity: "Upload government-issued ID, passport, or driver's license"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {category ? categoryLabels[category] : "Document Upload"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {category ? categoryDescriptions[category] : "Upload your documents securely"}
          </p>
        </CardHeader>
        <CardContent>
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Drop files here or click to upload
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Support for PDF, JPG, PNG files up to 10MB
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept={category ? allowedTypes[category].join(",") : ".pdf,.png,.jpg,.jpeg"}
                  onChange={handleFileInput}
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>Choose Files</span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your documents are encrypted and stored securely. We never share your personal information.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Uploaded Files ({files.length})</span>
                  <Badge variant="secondary">
                    {files.filter(f => f.status === "completed").length} completed
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <FileIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium truncate">{file.name}</h4>
                            <div className="flex items-center gap-2">
                              {file.status === "completed" && (
                                <Check className="w-4 h-4 text-green-500" />
                              )}
                              {file.status === "uploading" && (
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              )}
                              <Badge
                                variant={file.status === "completed" ? "secondary" : "outline"}
                                className="text-xs"
                              >
                                {file.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {file.uploadedAt.toLocaleDateString()}
                            </span>
                          </div>
                          {file.status === "uploading" && (
                            <Progress value={file.uploadProgress} className="mt-2" />
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {file.status === "completed" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => previewDocument(file)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
            <DialogDescription>
              {previewFile?.name} • {previewFile && formatFileSize(previewFile.size)}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {previewFile?.preview ? (
              <img
                src={previewFile.preview}
                alt={previewFile.name}
                className="max-w-full h-auto rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Preview not available</p>
                  <p className="text-sm text-muted-foreground">
                    File type: {previewFile?.type}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentUpload;
