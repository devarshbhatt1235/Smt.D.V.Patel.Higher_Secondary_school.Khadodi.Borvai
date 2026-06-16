import { useState, useEffect } from "react";
import { useGetAdminMe } from "@workspace/api-client-react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("school_token"));
  
  useEffect(() => {
    if (token) {
      localStorage.setItem("school_token", token);
    } else {
      localStorage.removeItem("school_token");
    }
  }, [token]);

  const { data: admin, isLoading, error } = useGetAdminMe({
    query: {
      enabled: !!token,
      retry: false,
    } as any
  });

  const isAuthenticated = !!admin && !!token;

  return {
    token,
    setToken,
    admin,
    isLoading: isLoading && !!token,
    isAuthenticated,
    error
  };
}
