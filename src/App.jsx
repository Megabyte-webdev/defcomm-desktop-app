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

// Lazy load components
const SecureChatUI = lazy(() => import("./pages/SecureChatUI"));
const DefcommLogin = lazy(() => import("./pages/DefcommLogin"));
const DashboardWrapper = lazy(() => import("./layout/DashboardWrapper"));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
            <MeetingProvider>
              <BotProvider>
                <DashboardContextProvider>
                  <Suspense fallback={<FallBack />}>
                    <Router>
                      <Routes>
                        <Route path="/" element={<DefcommLogin />} />
                        <Route
                          path="/dashboard/*"
                          element={<DashboardWrapper />}
                        >
                          <Route index element={<SecureChatUI />} />

                          {/* Catch-all redirect */}
                          <Route path="*" element={<Navigate to="/" />} />
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
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Protected Route Wrapper as a Component
const ProtectedRoute = ({ Component }) => {
  const { authDetails, isLoading } = useContext(AuthContext);
  if (isLoading)
    return <div className="text-white text-center mt-10">Loading...</div>;
  // Check if the user role is "user"
  if (!authDetails || authDetails.user?.role !== "user") {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default App;
