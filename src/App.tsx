import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoginModal from "@/components/auth/LoginModal";
import SignUpModal from "@/components/auth/SignUpModal";
import IRSVerificationPopup from "@/components/auth/IRSVerificationPopup";
import Chatbot from "@/components/chatbot/Chatbot";
import WelcomeSignupModal from "@/components/WelcomeSignupModal";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagement from "./pages/AdminManagement";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import ROICalculator from "./pages/ROICalculator";
import HelpCenter from "./pages/HelpCenter";
import ReferralProgram from "./pages/ReferralProgram";
import Specialists from "./pages/Specialists";
import Profile from "./pages/Profile";
import Documents from "./pages/Documents";
import Support from "./pages/Support";
import AntIndex from "./pages/AntIndex";
import AntDashboard from "./pages/AntDashboard";
import MantineIndex from "./pages/MantineIndex";
import MantineDashboard from "./pages/MantineDashboard";
import LiveDashboard from "./pages/LiveDashboard";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { creditFixMantineTheme } from "@/config/mantineTheme";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isIRSVerificationOpen, closeIRSVerification } = useAuth();

  return (
    <>
      <LoginModal />
      <SignUpModal />
      <IRSVerificationPopup
        isOpen={isIRSVerificationOpen}
        onClose={closeIRSVerification}
      />
      <WelcomeSignupModal />
      <Chatbot />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-management" element={<AdminManagement />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/roi-calculator" element={<ROICalculator />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/referral-program" element={<ReferralProgram />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/support" element={<Support />} />
          <Route path="/ant-demo" element={<AntIndex />} />
          <Route path="/ant-dashboard" element={<AntDashboard />} />
          <Route path="/mantine-demo" element={<MantineIndex />} />
          <Route path="/mantine-dashboard" element={<MantineDashboard />} />
          <Route path="/live-dashboard" element={<LiveDashboard />} />
          <Route path="/sign-in" element={<SignIn />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={creditFixMantineTheme} withGlobalStyles withNormalizeCSS>
        <Notifications />
        <ThemeProvider defaultTheme="system" storageKey="creditfix-ui-theme">
          <AuthProvider>
            <ChatbotProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
            </ChatbotProvider>
          </AuthProvider>
        </ThemeProvider>
      </MantineProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
