import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  X,
  TrendingUp,
  Clock,
  HelpCircle,
  Filter,
  SortAsc,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  popularity: number;
  lastUpdated: Date;
}

interface EnhancedFAQSearchProps {
  faqs: FAQ[];
  onFAQSelect?: (faq: FAQ) => void;
}

const EnhancedFAQSearch = ({ faqs, onFAQSelect }: EnhancedFAQSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"relevance" | "popularity" | "recent">("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Popular search terms
  const popularSearches = [
    "credit score",
    "tax refund",
    "dispute process", 
    "payment plans",
    "IRS verification",
    "document upload"
  ];

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(faqs.map(faq => faq.category))];
    return ["all", ...cats];
  }, [faqs]);

  // Filter and search FAQs
  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Search in question, answer, and tags
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity;
        case "recent":
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        case "relevance":
        default:
          // Simple relevance: prioritize title matches, then popularity
          const aInTitle = a.question.toLowerCase().includes(searchQuery.toLowerCase());
          const bInTitle = b.question.toLowerCase().includes(searchQuery.toLowerCase());
          if (aInTitle && !bInTitle) return -1;
          if (!aInTitle && bInTitle) return 1;
          return b.popularity - a.popularity;
      }
    });

    return filtered;
  }, [faqs, searchQuery, selectedCategory, sortBy]);

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "popularity": return "Most Popular";
      case "recent": return "Recently Updated";
      default: return "Most Relevant";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SortAsc className="w-4 h-4 mr-2" />
              {getSortLabel(sortBy)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("relevance")}>
              Most Relevant
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("popularity")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Most Popular
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("recent")}>
              <Clock className="w-4 h-4 mr-2" />
              Recently Updated
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedCategory !== "all" && (
          <Badge variant="secondary" className="gap-1">
            {selectedCategory}
            <button onClick={() => setSelectedCategory("all")}>
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}

        {searchQuery && (
          <Badge variant="outline" className="gap-1">
            "{searchQuery}"
            <button onClick={() => setSearchQuery("")}>
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
      </div>

      {/* Category Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category === "all" ? "All Categories" : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Searches */}
      {!searchQuery && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Popular Searches
          </h4>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {searchQuery && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} 
              {searchQuery && ` for "${searchQuery}"`}
            </span>
          </div>
        )}

        <AnimatePresence>
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onFAQSelect?.(faq)}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm leading-tight flex-1">
                        {faq.question}
                      </h3>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {faq.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {faq.answer}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="w-3 h-3" />
                        {faq.popularity} views
                      </div>
                      {faq.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredFAQs.length === 0 && searchQuery && (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any FAQs matching your search. Try different keywords or browse our categories.
              </p>
              <div className="space-y-2">
                <Button onClick={clearSearch}>
                  Clear Search
                </Button>
                <p className="text-sm text-muted-foreground">
                  or <button className="text-primary hover:underline">contact our support team</button> for help
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedFAQSearch;
