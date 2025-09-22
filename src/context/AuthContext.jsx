import { createContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Read from localStorage on mount
  const [authDetails, setAuthDetails] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Query for getting auth details (React Query cache)
  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => Promise.resolve(authDetails),
    initialData: authDetails,
    staleTime: 0, // Ensure immediate refetch on changes
  });

  // Sync query data with auth state
  useEffect(() => {
    if (data) setAuthDetails(data);
  }, [data]);

  // Function to update auth state and React Query
  const updateAuth = (newUser) => {
    setAuthDetails(newUser);
    if (newUser) {
      localStorage.setItem("authUser", JSON.stringify(newUser));
      queryClient.setQueryData(["authUser"], newUser); // Update React Query
    } else {
      localStorage.removeItem("authUser");
      queryClient.removeQueries(["authUser"]); // Completely remove query
    }
  };

  return (
    <AuthContext.Provider value={{ authDetails, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
