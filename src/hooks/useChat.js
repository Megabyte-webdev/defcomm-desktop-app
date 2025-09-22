import { useContext, useEffect, useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";

const useChat = () => {
  const { authDetails } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const groupId = authDetails?.user?.company_id;
  const userId = authDetails?.user?.id;
  const token = authDetails?.access_token;
  const client = axiosClient(token);

  const useFetchContacts = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data } = await client.get("/user/contact");
      return data?.data || [];
    },
    enabled: !!authDetails, // Fetch only when authenticated
  });

  // Fetch Contacts Manually
  const fetchContacts = async () => {
    const { data } = await client.get(`/user/contact`);
    return data?.data || [];
  };
  // Fetch Contacts Manually
  const fetchChatHistory = async () => {
    const { data } = await client.get(`/user/chat/history`);
    return data?.data || [];
  };

  // Fetch Group Members Manually
  const fetchGroupMembers = async () => {
    if (!groupId) return [];
    const { data } = await client.get(`/user/group/member/${groupId}`);
    return data || [];
  };

  // Fetch Chat Messages Manually
  const fetchChatMessages = async (memberId) => {
    if (!memberId) return [];
    const { data } = await client.get(`/user/chat/messages/${memberId}/user`);
    return data || [];
  };
  // Fetch Chat Messages Manually
  const fetchGroupChatMessages = async (groupId) => {
    if (!groupId) return [];
    const { data } = await client.get(`/user/chat/messages/${groupId}/group`);
    return data || [];
  };

  const getChatMessages = (peerId) => {
    return useInfiniteQuery({
      queryKey: ["chatMessages", peerId],
      queryFn: async ({ pageParam = 1 }) => {
        // ✅ Check cache first before hitting API
        const cached = queryClient.getQueryData(["chatMessages", peerId]);

        if (cached) {
          const alreadyFetched = cached.pages.find(
            (page) => page?.chat_meta?.current_page === pageParam
          );
          if (alreadyFetched) {
            return alreadyFetched; // return cached page, no refetch
          }
        }

        // Otherwise, fetch from API
        let url = `/user/chat/messages/${peerId}/user`;
        if (pageParam > 1) {
          url += `?page=${pageParam}`;
        }

        const { data } = await client.get(url);
        return data; // { chat_meta, data: [...] }
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage?.chat_meta) return undefined;

        const { current_page, last_page } = lastPage.chat_meta;
        return current_page < last_page ? current_page + 1 : undefined;
      },
      enabled: !!authDetails && !!peerId,
      staleTime: Infinity, // never stale
      cacheTime: Infinity, // keep cached forever
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  const getCallLogs = useQuery({
    queryKey: ["callLogs"],
    queryFn: async () => {
      const { data } = await client.get(`/user/chat/callLog`);
      return data?.data || [];
    },
    enabled: !!authDetails,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const updateCallLog = useMutation({
    mutationFn: async (callLog) => {
      const { data } = await client.post(`/user/chat/messages/call`, callLog);
      //   return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callLogs"] });
    },
  });

  const useMessageRead = (id) => {
    return useQuery({
      queryKey: ["messageRead", id],
      queryFn: async () => {
        if (!id) throw new Error("Message id is required");

        const { data } = await client.get(`/user/messages/isread/${id}`);
        return data?.data || data;
      },
      enabled: !!id, // only run when id is available
    });
  };

  return {
    fetchContacts,
    fetchChatHistory,
    fetchGroupMembers,
    fetchChatMessages,
    getCallLogs,
    getChatMessages,
    updateCallLog,
    fetchGroupChatMessages,
    useFetchContacts,
    useMessageRead,
  };
};

export default useChat;
