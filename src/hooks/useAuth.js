import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { queryClient } from "../services/query-client";
import { extractErrorMessage } from "../utils/formmaters";

const useAuth = () => {
  const navigate = useNavigate();
  const { authDetails, updateAuth } = useContext(AuthContext);
  const client = axiosClient(authDetails?.access_token);

  // 🔄 Query: Get Profile Data
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await client.get("/user/profile");
      updateAuth({ ...authDetails, user: data?.data }); // You might want to update with new profile data too
      return data;
    },
    enabled: !!authDetails?.access_token, // only run if user is logged in
    onError: (err) => {
      onFailure({
        message: "Failed to fetch profile",
        error: extractErrorMessage(err),
      });
    },
  });

  // 🔐 Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await client.post("/login", credentials);
      if (!data?.data?.user) {
        throw new Error("Invalid response: User data not found");
      }
      return data.data;
    },
    onSuccess: (userData) => {
      updateAuth(userData);
      onSuccess({
        message: "Login Successful!",
        success: "Continuing to dashboard",
      });
      navigate("/dashboard/home");
    },
    onError: (error) => {
      onFailure({ message: "Login Failed", error: extractErrorMessage(error) });
    },
  });

  // 📤 Profile Upload Mutation
  const profileMutation = useMutation({
    mutationFn: async (userData) => {
      const { data } = await client.post("/user/profile/upload", userData, {
        headers: {
          "Content-Type": "multipart/form-data", // This header ensures the form data is processed correctly
        },
      });
      return data;
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries(["profile"]); // Refresh profile
      onSuccess({
        message: "Profile Update",
        success: "Profile updated successfully!",
      });
    },
    onError: (err) => {
      console.log("Profile Update error:", err);
      onFailure({
        message: "Profile Update Failed",
        error: extractErrorMessage(err),
      });
    },
  });

  // 🔢 OTP Request
  const requestOtpMutation = useMutation({
    mutationFn: async (credential) => {
      const { data } = await client.post("/requestOtpSms", {
        phone: credential?.phone,
      });
      if (data?.status !== 200) throw new Error("An error occurred");
      return data;
    },
    onSuccess: (data) => {
      onSuccess({
        message: "OTP Requested!",
        success: `Here is your OTP - ${data?.otp || data?.message}`,
      });
    },
    onError: (err) => {
      onFailure({
        message: "OTP Request Failed",
        error: extractErrorMessage(err),
      });
    },
  });

  // ✅ OTP Verify
  const verifyOtpMutation = useMutation({
    mutationFn: async (otpData) => {
      const { data } = await client.post("/loginWithPhone", otpData);
      if (data?.status !== 200)
        throw new Error("Invalid response: User data not found");
      return data.data;
    },
    onSuccess: (userData) => {
      updateAuth(userData);
      navigate("/dashboard", { replace: true });
      onSuccess({
        message: "OTP Verified!",
        success: "Continuing to dashboard",
      });
    },
    onError: (err) => {
      onFailure({
        message: "OTP Verification Failed",
        error: extractErrorMessage(err),
      });
    },
  });

  // 🚪 Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      queryClient.clear(); // Clear cache
    },
    onSuccess: () => {
      updateAuth(null);
      navigate("/", { replace: true });
      onSuccess({
        message: "Logout successful",
        success: "You have been logged out.",
      });
    },
    onError: (err) => {
      onFailure({ message: "Logout Failed", error: extractErrorMessage(err) });
    },
  });

  // ⏳ Loading states
  const isLoading = {
    login: loginMutation.isPending,
    profile: profileMutation.isPending,
    requestOtp: requestOtpMutation.isPending,
    verifyOtp: verifyOtpMutation.isPending,
    logout: logoutMutation.isPending,
    overall:
      loginMutation.isPending ||
      profileMutation.isPending ||
      requestOtpMutation.isPending ||
      verifyOtpMutation.isPending ||
      logoutMutation.isPending,
  };

  return {
    login: loginMutation.mutate,
    profile: profileMutation.mutateAsync,
    verifyOtp: verifyOtpMutation.mutate,
    requestOtp: requestOtpMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoading,
    profileQuery, // <-- added here
  };
};

export default useAuth;
