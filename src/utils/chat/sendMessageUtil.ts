import { UseMutationResult } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { onFailure } from "../notifications/OnFailure";

interface SendMessageParams {
  message: string;
  file: File | null;
  chat_user_type: string;
  chat_user_id: string;
  chat_id: string | null;
  mss_type: string;
  sendMessageMutation: UseMutationResult<any, unknown, FormData, unknown>;
  tag_users: any | null;
  tag_mess: string | null;
}

export const sendMessageUtil = async ({
  message,
  file,
  chat_user_type = "user",
  chat_user_id,
  chat_id,
  sendMessageMutation,
  mss_type = "text",
  tag_users = null,
  tag_mess = null,
}: SendMessageParams) => {
  if (!message.trim() && !file) return; // Prevent empty message submission

  const formData = new FormData();
  if (file) {
    formData.append("message", file);
    formData.append("is_file", "yes");
    formData.append("file_type", file.type);
  } else {
    formData.append("message", message);
    formData.append("is_file", "no");
  }

  if (tag_users) {
    formData.append("tag_user", tag_users);
  }
  if (tag_mess) {
    formData.append("tag_mess", tag_mess);
  }

  formData.append("current_chat_user_type", chat_user_type);
  formData.append("current_chat_user", chat_user_id);
  formData.append("chat_id", chat_id);
  formData.append("mss_type", mss_type);

  try {
    await sendMessageMutation.mutateAsync(formData);
    return true;
  } catch (error) {
    onFailure({ message: "Message send failed", error: error.message });
    return false;
  }
};
