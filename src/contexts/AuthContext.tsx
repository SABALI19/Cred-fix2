import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { authService, type AuthUser } from "@/services/authService";
import { tokenStorage } from "@/services/apiClient";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "agent" | "admin";
  profilePhoto?: string;
  bio?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoginOpen: boolean;
  isSignUpOpen: boolean;
  isIRSVerificationOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openSignUp: () => void;
  closeSignUp: () => void;
  openIRSVerification: () => void;
  closeIRSVerification: () => void;
  login: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    details?: {
      phone?: string;
      address?: {
        streetAddress?: string;
        city?: string;
        state?: string;
        zipCode?: string;
      };
    },
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isIRSVerificationOpen, setIsIRSVerificationOpen] = useState(false);

  const mapUser = (u: AuthUser): User => ({
    id: u._id || u.id || "",
    email: u.email,
    name: u.name,
    role: u.role,
    profilePhoto: u.profilePhoto,
    bio: u.bio,
    phone: u.phone,
  });

  useEffect(() => {
    const bootstrap = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(mapUser(currentUser));
      } catch (_error) {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };
    bootstrap();
  }, []);

  const openLogin = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const openSignUp = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  const closeSignUp = () => {
    setIsSignUpOpen(false);
  };

  const openIRSVerification = () => {
    setIsIRSVerificationOpen(true);
  };

  const closeIRSVerification = () => {
    setIsIRSVerificationOpen(false);
  };

  const login = async (email: string, password: string) => {
    const loggedInUser = await authService.login(email, password);
    setUser(mapUser(loggedInUser));
    closeLogin();

    // Show IRS verification popup after successful login
    setTimeout(() => {
      setIsIRSVerificationOpen(true);
    }, 1000);
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    details,
  ) => {
    const createdUser = await authService.register({
      name,
      email,
      password,
      phone: details?.phone,
      address: details?.address,
    });
    setUser(mapUser(createdUser));
    closeSignUp();

    // Show IRS verification popup after successful signup
    setTimeout(() => {
      setIsIRSVerificationOpen(true);
    }, 1000);
  };

  const logout = () => {
    authService.logout().catch(() => null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const updated = await authService.updateProfile(updates);
    setUser(mapUser(updated));
  };

  const value: AuthContextType = {
    user,
    isLoginOpen,
    isSignUpOpen,
    isIRSVerificationOpen,
    openLogin,
    closeLogin,
    openSignUp,
    closeSignUp,
    openIRSVerification,
    closeIRSVerification,
    login,
    signUp,
    logout,
    updateProfile,
  };

  if (isBootstrapping) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
