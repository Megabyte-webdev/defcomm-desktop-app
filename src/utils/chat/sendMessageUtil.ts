import { UseMutationResult } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { onFailure } from "../../utils/notifications/OnFailure";

interface SendMessageParams {
  client: AxiosInstance;
  message: String;
  file: File | null;
  chat_user_type: string;
  chat_user_id: string;
  chat_id: string;
  mss_type: string;
  sendMessageMutation: UseMutationResult<any, unknown, FormData, unknown>;
}

export const sendMessageUtil = async ({
  client,
  message,
  file,
  chat_user_type = "user",
  chat_user_id,
  chat_id,
  sendMessageMutation,
  mss_type = "text",
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
