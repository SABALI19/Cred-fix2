import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileSettings from "@/components/profile/ProfileSettings";
import { PageTransition } from "@/components/animations/AnimatedComponents";

const Profile = () => {
  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navigation />

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Profile Settings</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Manage your account information, profile photo, and personal
                  details
                </p>
              </div>
            </div>

            <ProfileSettings />
          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
};

export default Profile;
