import { useState, useCallback } from "react";
import { useGetAdminMe } from "@workspace/api-client-react";

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(
    () => localStorage.getItem("school_token")
  );

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("school_token", newToken);
    } else {
      localStorage.removeItem("school_token");
    }
    setTokenState(newToken);
  }, []);

  const { data: admin, isLoading } = useGetAdminMe({
    query: {
      enabled: !!token,
      retry: false,
    } as any,
  });

  const isAuthenticated = !!admin && !!token;

  return {
    token,
    setToken,
    admin,
    isLoading: isLoading && !!token,
    isAuthenticated,
  };
}
