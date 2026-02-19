import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  HelpCircle,
  Send,
  Paperclip,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  Tag,
  X,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  supportTicketService,
  type SupportTicketRecord,
} from "@/services/supportTicketService";
import { useAuth } from "@/contexts/AuthContext";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  createdAt: Date;
  updatedAt: Date;
  responses: TicketResponse[];
  attachments?: File[];
}

interface TicketResponse {
  id: string;
  message: string;
  isFromSupport: boolean;
  timestamp: Date;
  author: string;
}

interface SupportTicketProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (ticket: Partial<SupportTicket>) => void;
}

const SupportTicket = ({ isOpen, onClose, onSubmit }: SupportTicketProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium" as const,
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const categories = [
    { value: "account", label: "Account & Billing" },
    { value: "credit", label: "Credit Repair" },
    { value: "tax", label: "Tax Services" },
    { value: "technical", label: "Technical Support" },
    { value: "documents", label: "Document Upload" },
    { value: "other", label: "Other" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "text-green-600", bgColor: "bg-green-100" },
    { value: "medium", label: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { value: "high", label: "High", color: "text-orange-600", bgColor: "bg-orange-100" },
    { value: "urgent", label: "Urgent", color: "text-red-600", bgColor: "bg-red-100" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        name: user?.name || "Authenticated User",
        email: user?.email || "user@example.com",
        subject: formData.subject,
        description: formData.description,
        category: formData.category || "other",
        priority: formData.priority,
        attachments: attachments.map((file) => ({
          name: file.name,
          size: file.size,
        })),
      };

      await supportTicketService.create(payload);
      onSubmit?.({
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: "open",
        createdAt: new Date(),
        attachments,
      });
      setIsSubmitted(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          subject: "",
          description: "",
          category: "",
          priority: "medium",
        });
        setAttachments([]);
        onClose();
      }, 3000);
    } catch (_error) {
      setIsSubmitting(false);
      setSubmitError("Unable to submit ticket right now. Please try again.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Ticket Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              We've received your support request. Our team will respond within 24 hours.
            </p>
            <Badge variant="secondary">
              Ticket #TK-{Date.now().toString().slice(-6)}
            </Badge>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Submit Support Ticket
          </DialogTitle>
          <DialogDescription>
            Describe your issue and we'll help you resolve it quickly
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="Brief description of your issue"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${priority.bgColor}`} />
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Please provide a detailed description of your issue, including any error messages or steps you've already tried..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={6}
              required
            />
          </div>

          {/* File Attachments */}
          <div className="space-y-3">
            <Label>Attachments (optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <div className="text-center">
                <Paperclip className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Attach screenshots or documents (max 5MB each)
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Plus className="w-4 h-4 mr-2" />
                      Choose Files
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Attachment List */}
            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {attachments.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {formatFileSize(file.size)}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Help Text */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Response Time:</strong> We typically respond within 24 hours during business days.
              For urgent issues, consider calling our support line.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Ticket List Component for viewing existing tickets
export const TicketList = ({ refreshKey = 0 }: { refreshKey?: number }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await supportTicketService.list(user?.email);
        setTickets(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.email, refreshKey]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "in-progress": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "waiting": return <MessageSquare className="w-4 h-4 text-orange-500" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed": return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "bg-blue-100 text-blue-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      waiting: "bg-orange-100 text-orange-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700"
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.replace("-", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {loading && (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            Loading tickets...
          </CardContent>
        </Card>
      )}

      {!loading && tickets.length === 0 && (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            No support tickets yet.
          </CardContent>
        </Card>
      )}

      {tickets.map((ticket) => (
        <Card key={ticket._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  {getStatusBadge(ticket.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {ticket.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {ticket._id.slice(-6).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {ticket.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SupportTicket;
