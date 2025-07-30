import { useContext } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { queryClient } from "../services/query-client";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";
import { ChatContext } from "../context/ChatContext";
import { m } from "framer-motion";

export const useSendMessageMutation = (
  client: AxiosInstance,
  clearMessageInput: () => void = () => {}
): UseMutationResult<any, unknown, FormData, unknown> => {
  const { setCallMessage } = useContext(ChatContext);

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await client.post("/user/chat/messages/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },

    onSuccess: async (response, variables) => {
      const messageData = response?.data?.data;

      // If already fetched, append new message to existing messages
      queryClient.setQueryData(
        ["chatMessages", Number(variables.get("current_chat_user"))],
        (old) => {
          if (!old || !Array.isArray(old?.data)) return old;

          const exists = old.data.find((msg) => msg.id === messageData?.id);
          if (exists) return old;

          return {
            ...old,
            data: [...old.data, messageData],
          };
        }
      );
      // If it's a call message, store the message in context
      if (variables?.get("mss_type") === "call") {
        setCallMessage({
          ...messageData,
          id: messageData?.id_en,
          msg_id: messageData?.id,
        });
      }
      // Clear input field if provided
      clearMessageInput();
    },

    onError: (error) => {
      console.error("❌ Message send error:", error);
      onFailure({
        message: "Message not sent",
        error:
          extractErrorMessage(error) || "Failed to send message. Try again.",
      });
    },
  });
};

export const useTypingStatus = (client: AxiosInstance) => {
  return useMutation({
    mutationFn: ({ current_chat_user, typing }: any) =>
      client.post("/user/messages/typing", {
        current_chat_user,
        typing,
      }),
  });
};
