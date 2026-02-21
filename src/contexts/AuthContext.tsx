import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { authService, type AuthUser } from "@/services/authService";
import { tokenStorage } from "@/services/apiClient";
import { socketClient } from "@/services/socketClient";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "agent" | "admin";
  assignedAgentId?: string | null;
  assignedAgent?: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    phone?: string;
    bio?: string;
  } | null;
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
  login: (email: string, password: string) => Promise<User>;
  selectAgent: (agentId: string | null) => Promise<void>;
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
    assignedAgentId: u.assignedAgentId ?? null,
    assignedAgent: u.assignedAgent ?? null,
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

  useEffect(() => {
    if (user?.id) {
      socketClient.connect();
      return;
    }

    socketClient.disconnect();
  }, [user?.id]);

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
    const mappedUser = mapUser(loggedInUser);
    setUser(mappedUser);
    closeLogin();

    // Show IRS verification popup after successful login
    setTimeout(() => {
      setIsIRSVerificationOpen(true);
    }, 1000);

    return mappedUser;
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

  const selectAgent = async (agentId: string | null) => {
    const updated = await authService.selectAgent(agentId);
    setUser(mapUser(updated));
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
    selectAgent,
    signUp,
    logout,
    updateProfile,
  };

  if (isBootstrapping) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
