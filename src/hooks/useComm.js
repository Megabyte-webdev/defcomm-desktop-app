import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";

const useComm = () => {
  const { authDetails } = useContext(AuthContext);
  const token = authDetails?.access_token;
  const client = axiosClient(token);
  const queryClient = useQueryClient();

  // 🔁 Fetch Walkie-Talkie Channels
  const getChannelList = useQuery({
    queryKey: ["channelList"],
    queryFn: async () => {
      const { data } = await client.get("/walkietalkie/channecreatellist");
      return data?.data || [];
    },
    enabled: !!authDetails?.user_enid,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const getInvitedChannelList = useQuery({
    queryKey: ["channelList Invited"],
    queryFn: async () => {
      const { data } = await client.get(
        "/walkietalkie/channellistinvited/active"
      );
      return data?.data || [];
    },
    enabled: !!authDetails?.user_enid,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const getInvitedChannelPending = useQuery({
    queryKey: ["channelList Invited Pending"],
    queryFn: async () => {
      const { data } = await client.get(
        "/walkietalkie/channellistinvited/pending"
      );
      return data?.data || [];
    },
    enabled: !!authDetails?.user_enid,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // ➕ Create New Comm Channel
  const createChannelMutation = useMutation({
    mutationFn: (payload) =>
      client.post("/walkietalkie/channelcreate", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["channelList"]);
      onSuccess({
        message: "Comm channel successfully created!",
        success: "New channel added",
      });
    },
    onError: (err) => {
      onFailure({
        message: "Failed to create comm channel",
        error: extractErrorMessage(err),
      });
    },
  });

  const addUserToChannel = useMutation({
    mutationFn: (payload) =>
      client.post("/walkietalkie/channelinvite", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["channelList"]);
    },
    onError: (err) => {
      onFailure({
        message: "Failed to add user to channel",
        error: extractErrorMessage(err),
      });
    },
  });
  const updateChannelInviteStatus = useMutation({
    mutationFn: (payload) =>
      client.post("/walkietalkie/channelinvitedstatus", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["channelList Invited"]);
      queryClient.invalidateQueries(["channelList Invited Pending"]);
      onSuccess({
        message: "Channel invitation status updated!",
        success: "Updated successfully",
      });
    },
    onError: (err) => {
      onFailure({
        message: "Failed to update channel invitation status",
        error: extractErrorMessage(err),
      });
    },
  });

  const deleteChannel = useMutation({
    mutationFn: (channelId) =>
      client.get(`/walkietalkie/channedelete/${channelId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["channelList"]);
      queryClient.invalidateQueries(["channelList Invited"]);
      onSuccess({
        message: "Channel deleted successfully!",
        success: "Deleted",
      });
    },
    onError: (err) => {
      onFailure({
        message: "Failed to delete channel",
        error: extractErrorMessage(err),
      });
    },
  });

  const broadcastMessage = useMutation({
    mutationFn: (payload) =>
      client.post("/walkietalkie/channelbroadcast", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onError: (err) => {
      onFailure({
        message: "Failed to broadcast message",
        error: extractErrorMessage(err),
      });
    },
  });

  return {
    getChannelList,
    createChannelMutation,
    addUserToChannel,
    getInvitedChannelList,
    getInvitedChannelPending,
    updateChannelInviteStatus,
    broadcastMessage,
    deleteChannel,
  };
};

export default useComm;
