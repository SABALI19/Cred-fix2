import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  Home,
  Shield,
  TrendingUp,
  Menu,
  X,
  Users,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, openLogin, openSignUp, logout } = useAuth();
  const dashboardPath = user
    ? user.role === "admin"
      ? "/admin-dashboard"
      : user.role === "agent"
        ? "/agent-dashboard"
        : "/dashboard"
    : "/dashboard";

  const getNavItems = () => {
    const baseItems = [{ href: "/", label: "Home", icon: Home }];

    if (user) {
      switch (user.role) {
        case "admin":
          return [
            ...baseItems,
            { href: "/dashboard", label: "User Dashboard", icon: BarChart3 },
            { href: "/agent-dashboard", label: "Agent Dashboard", icon: Users },
            {
              href: "/admin-dashboard",
              label: "Admin Dashboard",
              icon: Settings,
            },
          ];
        case "agent":
          return [
            ...baseItems,
            { href: "/dashboard", label: "User Dashboard", icon: BarChart3 },
            { href: "/agent-dashboard", label: "Agent Dashboard", icon: Users },
          ];
        case "user":
        default:
          // Regular users only see Home and their personal Dashboard
          return [
            ...baseItems,
            { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
          ];
      }
    }

    // Not logged in - only show Home
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </motion.div>
              <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CreditFix Pro
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Ant Design Demo Link */}
              {/* <Link
                to="/ant-demo"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
              >
                <span>🐜 Ant Design Demo</span>
              </Link> */}

              {/* Mantine Demo Link */}
              {/* <Link
                to="/mantine-demo"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200"
              >
                <span>🎨 Mantine Demo</span>
              </Link> */}

              {/* Live Dashboard Link */}
              {/* <Link
                to="/live-dashboard"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
              >
                <span>🚀 Live Dashboard</span>
              </Link> */}

          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.profilePhoto || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={dashboardPath} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1">
                    <ThemeToggle />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={openLogin}>
                  Sign In
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Only show if user has navigation items */}
          {(user || navItems.length > 1) && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-14 sm:top-16 bottom-0 z-40 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 overflow-y-auto">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-[44px]",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-center">
                  <ThemeToggle />
                </div>
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        window.location.href = "/profile";
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        openLogin();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      onClick={() => {
                        openSignUp();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Start Repair
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
      <div className="h-14 sm:h-16" aria-hidden="true" />
    </>
  );
};

export default Navigation;
