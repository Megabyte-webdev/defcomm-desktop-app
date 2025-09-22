import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";
import { onSuccess } from "../utils/notifications/OnSuccess";

const useDeviceSettings = () => {
  const { authDetails } = useContext(AuthContext);
  const token = authDetails?.access_token;
  const client = axiosClient(token);
  const queryClient = useQueryClient();

  const getSettingsQuery = useQuery({
    queryKey: [`userSettings`],
    queryFn: async () => {
      const { data } = await client.get("/user/getsetting");
      return data?.data || [];
    },
    enabled: !!authDetails,
    refetchOnMount: true,
    staleTime: 0,
  });

  // ✅ Fetch device login logs
  const getDeviceLogsQuery = useQuery({
    queryKey: ["deviceLogs"],
    queryFn: async () => {
      const { data } = await client.get("/auth/logindevicelog");
      return data?.data || [];
    },
    enabled: !!authDetails,
    refetchOnMount: true,
    staleTime: 0,
  });

  // ✅ Fetch active devices
  const getDevicesQuery = (type) =>
    useQuery({
      queryKey: [`${type}Devices`],
      queryFn: async () => {
        const { data } = await client.get(`/auth/logindevice/${type}`);
        return data?.data || [];
      },
      enabled: !!authDetails && !!type,
      refetchOnMount: true,
      staleTime: 0,
    });

  // ✅ Mutation to update device status
  const updateDeviceStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await client.get(
        `/auth/logindevicestatus/${id}/${status}`
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Refetch queries to refresh UI
      queryClient.invalidateQueries(["deviceLogs"]);
      queryClient.invalidateQueries([`${variables?.status}Devices`]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const updateUserSettingsMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await client.post("/user/setting", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      // ✅ Refetch the latest settings
      queryClient.invalidateQueries(["userSettings"]);
      onSuccess({
        title: "Setting Updated",
        message: "settings updated successfully",
      });
    },
    onError: (error) => {
      onFailure({
        title: "Setting Update Error",
        message: extractErrorMessage(error) || "Failed to update settings",
      });
    },
  });

  const getLanguagesQuery = useQuery({
    queryKey: [`languageCodes`],
    queryFn: async () => {
      const { data } = await client.get("/user/languagecode");
      return data?.data || [];
    },
    enabled: !!authDetails,
    refetchOnMount: true,
    staleTime: 0,
  });

  return {
    getDeviceLogsQuery,
    getDevicesQuery,
    updateDeviceStatusMutation,
    updateUserSettingsMutation,
    getLanguagesQuery,
    getSettingsQuery,
  };
};

export default useDeviceSettings;
