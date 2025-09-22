import { lazy, Suspense, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Fallback from "../components/Fallback";
import { ThemeProvider } from "../context/ThemeContext";

// Pages
const DashboardWrapper = lazy(() => import("../layout/DashboardWrapper"));

const SecureGroupChat = lazy(() => import("../pages/SecureGroupChat"));
const SecureChatUI = lazy(() => import("../pages/SecureChatUI"));

function DashBoardRoute() {
  const { authDetails } = useContext(AuthContext);

  return authDetails?.user?.role === "user" ? (
    <ThemeProvider>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<DashboardWrapper />}>
            <Route index element={<SecureChatUI />} />
            <Route path="group/:groupId/chat" element={<SecureGroupChat />} />

            <Route path="user/:userId/chat" element={<SecureChatUI />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default DashBoardRoute;
