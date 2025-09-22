import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { extractErrorMessage } from "../utils/formmaters";

const useConference = () => {
  const { authDetails } = useContext(AuthContext);
  const token = authDetails?.access_token;
  const client = axiosClient(token);
  const queryClient = useQueryClient();

  // Fetch Conferences
  const getMeetingInviteQuery = useQuery({
    queryKey: ["meetingInvitations"],
    queryFn: async () => {
      const { data } = await client.get("/user/meetingInvitationlist");
      return data?.data || [];
    },
    enabled: !!authDetails?.user_enid,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const getMyMeetingsQuery = useQuery({
    queryKey: ["myMeetings"],
    queryFn: async () => {
      const { data } = await client.get(`/user/getmeeting`);
      return data?.data || [];
    },
    enabled: !!authDetails,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const getMeetingByIdQuery = (id) => {
    return useQuery({
      queryKey: ["meeting", id],
      queryFn: async () => {
        const { data } = await client.get(`/user/getmeeting/${id}`);
        return data?.data || null;
      },
      enabled: !!id && !!authDetails, // only fetch if ID and auth exist
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    });
  };

  const joinMeeting = async (id) => {
    const { data } = await client.get(`/user/meetingInvitationJoin/${id}`);
    return data || null;
  };

  // Create Meeting Mutation
  const createMeetingMutation = useMutation({
    mutationFn: (payload) => client.post("/user/meeting/create", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["myMeetings"]);
      onSuccess({
        message: "Meeting successfully created!",
        success: "New meeting added",
      });
    },
    onError: (err) => {
      onFailure({
        message: "Failed to create meeting",
        error: extractErrorMessage(err),
      });
    },
  });

  // Update Meeting Mutation
  const updateMeetingMutation = useMutation({
    mutationFn: (payload) => client.post("/user/meeting/update", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["myMeetings"]);
      onSuccess({
        message: "Meeting updated successfully!",
        success: "Meeting updated",
      });
    },
    onError: (err) => {
      onFailure({
        message: "Failed to update meeting",
        error: extractErrorMessage(err),
      });
    },
  });

  const addUserToMeetingMutation = useMutation({
    mutationFn: (payload) => client.post("/user/meetingInvitation", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["myMeetings"]);
    },
    onError: (err) => {
      onFailure({
        message: "Failed to add user to meeting",
        error: extractErrorMessage(err),
      });
    },
  });

  return {
    getMeetingInviteQuery,
    getMeetingByIdQuery,
    joinMeeting,
    getMyMeetingsQuery,
    createMeetingMutation,
    updateMeetingMutation,
    addUserToMeetingMutation,
  };
};

export default useConference;
