import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Search,
  Clock,
  User,
  Tag,
  TrendingUp,
  BookOpen,
  FileText,
  Calculator,
  Shield,
  ArrowRight,
  Calendar,
  Eye,
} from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Posts", count: 24 },
    { id: "credit-repair", name: "Credit Repair", count: 8 },
    { id: "tax-tips", name: "Tax Tips", count: 6 },
    { id: "financial-planning", name: "Financial Planning", count: 5 },
    { id: "success-stories", name: "Success Stories", count: 3 },
    { id: "industry-news", name: "Industry News", count: 2 },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "10 Credit Repair Myths Debunked by Experts",
      excerpt:
        "Separate fact from fiction with these expert insights into common credit repair misconceptions that could be holding you back.",
      content:
        "Credit repair is surrounded by myths that can prevent people from improving their financial situation. Let's debunk the most common ones...",
      author: "Sarah Mitchell",
      authorRole: "Credit Repair Specialist",
      authorImage: "/api/placeholder/60/60",
      publishDate: "2024-01-15",
      readTime: "7 min read",
      category: "credit-repair",
      tags: ["Credit Score", "Myths", "Expert Tips"],
      image: "/api/placeholder/400/250",
      featured: true,
      views: 2847,
    },
    {
      id: 2,
      title: "Tax Season 2024: Maximum Deductions Guide",
      excerpt:
        "Discover overlooked deductions that could save you thousands on your 2024 tax return with our comprehensive guide.",
      content:
        "Tax season can be overwhelming, but knowing about these deductions can significantly reduce your tax burden...",
      author: "Michael Rodriguez",
      authorRole: "Senior Tax Strategist",
      authorImage: "/api/placeholder/60/60",
      publishDate: "2024-01-12",
      readTime: "10 min read",
      category: "tax-tips",
      tags: ["Tax Deductions", "Tax Season", "Money Saving"],
      image: "/api/placeholder/400/250",
      featured: true,
      views: 3256,
    },
    {
      id: 3,
      title: "From 520 to 750: John's Credit Transformation Story",
      excerpt:
        "Read how John rebuilt his credit score in just 8 months using strategic credit repair techniques and smart financial habits.",
      content:
        "When John came to us, his credit score was 520 and he couldn't qualify for any loans. Here's how we helped him transform his credit...",
      author: "Amanda Williams",
      authorRole: "Credit Counselor",
      authorImage: "/api/placeholder/60/60",
      publishDate: "2024-01-10",
      readTime: "5 min read",
      category: "success-stories",
      tags: ["Success Story", "Credit Score", "Transformation"],
      image: "/api/placeholder/400/250",
      featured: false,
      views: 1892,
    },
    {
      id: 4,
      title: "Emergency Fund vs. Credit Card Debt: Which First?",
      excerpt:
        "The age-old dilemma: Should you build an emergency fund or pay off credit card debt first? We break down the strategy.",
      content:
        "This is one of the most common questions we get from clients. The answer depends on several factors...",
      author: "Jennifer Chen",
      authorRole: "Financial Planner",
      authorImage: "/api/placeholder/60/60",
      publishDate: "2024-01-08",
      readTime: "6 min read",
      category: "financial-planning",
      tags: ["Emergency Fund", "Debt Management", "Strategy"],
      image: "/api/placeholder/400/250",
      featured: false,
      views: 2134,
    },
    {
      id: 5,
      title: "IRS Audit Red Flags: What Triggers an Audit in 2024",
      excerpt:
        "Learn about the common triggers that might flag your tax return for an IRS audit and how to avoid them.",
      content:
        "Understanding what triggers an IRS audit can help you file with confidence. Here are the main red flags to avoid...",
      author: "Michael Rodriguez",
      authorRole: "Senior Tax Strategist",
      authorImage: "/api/placeholder/60/60",
      publishDate: "2024-01-05",
      readTime: "8 min read",
      category: "tax-tips",
      tags: ["IRS Audit", "Tax Compliance", "Red Flags"],
      image: "/api/placeholder/400/250",
      featured: false,
      views: 2698,
    },
    {
      id: 6,
      title: "Building Credit from Scratch: A Step-by-Step Guide",
      excerpt:
        "Starting with no credit history? Our comprehensive guide will help you build a strong credit foundation from the ground up.",
      content:
        "Building credit from scratch can seem daunting, but with the right strategy, you can establish excellent credit...",
      author: "David Thompson",
      authorRole: "Credit Specialist",
      authorImage: "/api/placeholder/60/60",
      publishDate: "2024-01-03",
      readTime: "12 min read",
      category: "credit-repair",
      tags: ["Credit Building", "Beginners Guide", "Credit Score"],
      image: "/api/placeholder/400/250",
      featured: false,
      views: 3847,
    },
  ];

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Financial{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert insights, tips, and strategies to help you achieve your
            credit and financial goals
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => (window.location.href = "/contact")}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Get Expert Help
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "secondary"
                }
                className={`cursor-pointer ${
                  selectedCategory === category.id
                    ? "bg-primary hover:bg-primary/90"
                    : "hover:bg-primary hover:text-white"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {searchTerm === "" && selectedCategory === "all" && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => (window.location.href = `/blog/${post.id}`)}
                >
                  <div className="aspect-video bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={post.authorImage}
                            alt={post.author}
                          />
                          <AvatarFallback>
                            {post.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{post.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.publishDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "all"
                ? "All Articles"
                : categories.find((c) => c.id === selectedCategory)?.name ||
                  "Articles"}
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} articles found
            </p>
          </div>

          {filteredPosts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No articles found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browsing different
                  categories.
                </p>
                <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => (window.location.href = `/blog/${post.id}`)}
                >
                  <div className="aspect-video bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find((c) => c.id === post.category)?.name}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={post.authorImage}
                            alt={post.author}
                          />
                          <AvatarFallback className="text-xs">
                            {post.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">
                          {post.author}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Stay Updated with Financial Tips
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get our latest articles, expert insights, and exclusive tips
                delivered to your inbox weekly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
