import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthTabs from "@/components/auth/AuthTabs";

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/epomsx-login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f9fafb", // fallback color
      }}
    >
      <div
        className="max-w-md w-full space-y-8 rounded-lg shadow-lg p-8"
        style={{
          background: "rgba(245, 245, 255, 0.6)", // whitish grey with 60% opacity
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        <div className="text-center">
          <img
            src="/myepomsx.png"
            alt="MyEPOMSX Logo"
            className="mx-auto mb-4 h-16 w-16"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            MyEPOMSX
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <AuthTabs
          loading={loading}
          setLoading={setLoading}
          setError={setError}
          setSuccess={setSuccess}
        />
      </div>
    </div>
  );
};

export default AuthPage;
