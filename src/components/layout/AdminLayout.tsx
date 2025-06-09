import React from "react";
import Layout from "./Layout";
import { ProjectDebug } from "@/components/debug/ProjectDebug";
import ProjectDebugRefresher from "@/components/debug/ProjectDebugRefresher";

/**
 * AdminLayout extends the regular Layout and adds additional
 * admin-specific components like debug tools
 */
interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <Layout>
      {children}

      {/* Admin-specific debug tools */}
      {process.env.NODE_ENV === "development" && (
        <>
          <ProjectDebugRefresher />
          <ProjectDebug />
        </>
      )}
    </Layout>
  );
};

export default AdminLayout;
