import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";

const useChat = () => {
    const { authDetails } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const groupId = authDetails?.user?.company_id;
    const userId = authDetails?.user?.id;
    const token = authDetails?.access_token;
    const client = axiosClient(token);

    const useFetchContacts = () =>
        useQuery({
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

    return {
        fetchContacts,
        fetchChatHistory,
        fetchGroupMembers,
        fetchChatMessages,

    };
};

export default useChat;
