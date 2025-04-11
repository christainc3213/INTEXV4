import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface AdminAuthorizeProps {
  children: React.ReactNode;
}

const AdminAuthorizeView: React.FC<AdminAuthorizeProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch(
          "https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/user/info",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.roles?.includes("Administrator"));
        } else {
          console.error("Failed to fetch admin info");
        }
      } catch (err) {
        console.error("Error checking admin status", err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <p>Loading admin access...</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AdminAuthorizeView;
