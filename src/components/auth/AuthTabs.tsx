import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthTabsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({
  loading,
  setLoading,
  setError,
  setSuccess,
}) => {
  return (
    <LoginForm
      loading={loading}
      setLoading={setLoading}
      setError={setError}
      setSuccess={setSuccess}
    />
    // <Tabs defaultValue="login" className="w-full">
    //   <TabsList className="grid w-full grid-cols-2">
    //     <TabsTrigger value="login">Sign In</TabsTrigger>
    //     <TabsTrigger value="signup">Sign Up</TabsTrigger>
    //   </TabsList>

    //   <TabsContent value="login">

    //   </TabsContent>

    //   <TabsContent value="signup">
    //     <SignupForm
    //       loading={loading}
    //       setLoading={setLoading}
    //       setError={setError}
    //       setSuccess={setSuccess}
    //     />
    //   </TabsContent>
    // </Tabs>
  );
};

export default AuthTabs;
