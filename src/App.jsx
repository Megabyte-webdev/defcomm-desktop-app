import { Suspense, lazy, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import FallBack from "./components/Fallback";
import { DashboardContextProvider } from "./context/DashboardContext";
import { queryClient } from "./services/query-client";
import { ChatProvider } from "./context/ChatContext";
import { BotProvider } from "./context/BotContext";
import { MeetingProvider } from "./context/MeetingContext";
import { NotificationProvider } from "./context/NotificationContext";
import { GroupProvider } from "./context/GroupContext";

// Lazy load components
const DefcommLogin = lazy(() => import("./pages/DefcommLogin"));
const SecureRoute = lazy(() => import("./routes/SecureRoute"));
const Dashboard = lazy(() => import("./routes/DashboardRoute"));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
            <GroupProvider>
              <MeetingProvider>
                <BotProvider>
                  <DashboardContextProvider>
                    <Suspense fallback={<FallBack />}>
                      <Router>
                        <Routes>
                          <Route path="/" element={<DefcommLogin />} />
                          <Route path="/login" element={<DefcommLogin />} />
                          {/* Using ProtectedRoute as a Component for dashboard */}
                          <Route path="/dashboard/*" element={<SecureRoute />}>
                            <Route
                              path="*"
                              element={
                                <ProtectedRoute>
                                  <Dashboard />
                                </ProtectedRoute>
                              }
                            />
                          </Route>
                        </Routes>
                      </Router>
                    </Suspense>
                    <ToastContainer
                      autoClose={2000}
                      draggable
                      className="z-[100000000000] mt-2"
                    />
                  </DashboardContextProvider>
                </BotProvider>
              </MeetingProvider>
            </GroupProvider>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Protected Route Wrapper as a Component
const ProtectedRoute = ({ children }) => {
  const { authDetails, isLoading } = useContext(AuthContext);

  if (isLoading)
    return <div className="text-white text-center mt-10">Loading...</div>;

  if (!authDetails || authDetails.user?.role !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default App;
