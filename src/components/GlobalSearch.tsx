import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  FileText,
  User,
  CreditCard,
  Calculator,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "page" | "article" | "help" | "contact";
  category: string;
  url: string;
  icon: any;
  relevance: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: React.ReactNode;
}

const GlobalSearch = ({ isOpen, onClose, trigger }: GlobalSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search data - in real app, this would come from API
  const searchData: SearchResult[] = [
    // Pages
    {
      id: "1",
      title: "Credit Repair Services",
      description: "Professional credit repair with guaranteed results",
      type: "page",
      category: "Services",
      url: "/",
      icon: CreditCard,
      relevance: 1,
    },
    {
      id: "2",
      title: "Tax Filing Services",
      description: "Expert tax preparation and optimization",
      type: "page",
      category: "Services",
      url: "/",
      icon: Calculator,
      relevance: 1,
    },
    {
      id: "3",
      title: "Book Consultation",
      description: "Schedule a free consultation with our experts",
      type: "page",
      category: "Booking",
      url: "/booking",
      icon: Phone,
      relevance: 1,
    },
    {
      id: "4",
      title: "ROI Calculator",
      description: "Calculate your potential savings from credit repair",
      type: "page",
      category: "Tools",
      url: "/roi-calculator",
      icon: Calculator,
      relevance: 1,
    },
    {
      id: "5",
      title: "Contact Support",
      description: "Get in touch with our support team",
      type: "contact",
      category: "Support",
      url: "/contact",
      icon: Mail,
      relevance: 1,
    },

    // Articles
    {
      id: "6",
      title: "How Credit Repair Works",
      description: "Understanding the credit repair process step by step",
      type: "article",
      category: "Credit Repair",
      url: "/blog",
      icon: FileText,
      relevance: 0.9,
    },
    {
      id: "7",
      title: "Tax Deduction Tips",
      description: "Maximize your tax refund with these expert tips",
      type: "article",
      category: "Tax Tips",
      url: "/blog",
      icon: FileText,
      relevance: 0.9,
    },
    {
      id: "8",
      title: "Credit Score Improvement",
      description: "Proven strategies to boost your credit score",
      type: "article",
      category: "Credit Tips",
      url: "/blog",
      icon: FileText,
      relevance: 0.8,
    },

    // Help
    {
      id: "9",
      title: "How long does credit repair take?",
      description: "Timeline expectations for credit repair services",
      type: "help",
      category: "FAQ",
      url: "/faq",
      icon: Clock,
      relevance: 0.9,
    },
    {
      id: "10",
      title: "What documents do I need?",
      description: "Required documents for credit repair and tax services",
      type: "help",
      category: "Getting Started",
      url: "/help-center",
      icon: FileText,
      relevance: 0.8,
    },
    {
      id: "11",
      title: "Billing and Payment Questions",
      description: "Answers about pricing, billing, and payment options",
      type: "help",
      category: "Billing",
      url: "/faq",
      icon: Calculator,
      relevance: 0.7,
    },
  ];

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    setTimeout(() => {
      const filtered = searchData
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => {
          // Sort by relevance and then by type priority
          const typePriority = { page: 3, contact: 2, help: 1, article: 0 };
          if (a.relevance !== b.relevance) {
            return b.relevance - a.relevance;
          }
          return typePriority[b.type] - typePriority[a.type];
        })
        .slice(0, 8); // Limit results

      setResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    window.location.href = result.url;
    onClose();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "bg-blue-100 text-blue-800";
      case "article":
        return "bg-green-100 text-green-800";
      case "help":
        return "bg-orange-100 text-orange-800";
      case "contact":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "page":
        return "Page";
      case "article":
        return "Article";
      case "help":
        return "Help";
      case "contact":
        return "Contact";
      default:
        return "Result";
    }
  };

  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );

  const quickActions = [
    {
      title: "Book Consultation",
      icon: Phone,
      url: "/booking",
      color: "bg-primary",
    },
    {
      title: "Contact Support",
      icon: Mail,
      url: "/contact",
      color: "bg-green-500",
    },
    {
      title: "Help Center",
      icon: FileText,
      url: "/help-center",
      color: "bg-orange-500",
    },
    {
      title: "ROI Calculator",
      icon: Calculator,
      url: "/roi-calculator",
      color: "bg-purple-500",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search CreditFix Pro
          </DialogTitle>
          <DialogDescription>
            Find pages, articles, help topics, and more
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchTerm === "" ? (
              // Quick Actions when no search
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => {
                          window.location.href = action.url;
                          onClose();
                        }}
                      >
                        <div
                          className={`${action.color} rounded-full w-8 h-8 flex items-center justify-center mr-3`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span>{action.title}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Searching...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try different keywords or browse our help center
                </p>
                <Button
                  onClick={() => {
                    window.location.href = "/help-center";
                    onClose();
                  }}
                >
                  Browse Help Center
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedResults).map(
                  ([type, typeResults], index) => (
                    <div key={type}>
                      {index > 0 && <Separator />}
                      <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                        {getTypeLabel(type)}s
                      </h3>
                      <div className="space-y-2">
                        {typeResults.map((result) => {
                          const Icon = result.icon;
                          return (
                            <div
                              key={result.id}
                              className="flex items-center p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                              onClick={() => handleResultClick(result)}
                            >
                              <Icon className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium truncate">
                                    {result.title}
                                  </h4>
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${getTypeColor(
                                      result.type,
                                    )}`}
                                  >
                                    {result.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {result.description}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="text-center text-xs text-muted-foreground pt-2 border-t">
              Press Enter to go to first result • Use ↑↓ to navigate
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
