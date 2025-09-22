// src/hooks/useTrans.ts
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { useContext } from "react";
import type { AxiosInstance, AxiosResponse } from "axios";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";

/* -------------------- Types -------------------- */
type SpeechToTextVars = {
  audio: File | Blob;
  language?: string;
};

type TextToSpeechVars = {
  text: string;
  language: string;
};

type TranslateTextVars = {
  text: string;
  target_lang: string;
  source_lang?: string;
};

type SpeechToSpeechVars = {
  audio: File | Blob;
  target_lang: string;
  source_lang?: string;
};

type MaybeWrappedStringResponse = string | { data?: string };
type MaybeWrappedBlobResponse = Blob | { data?: Blob };

const useTrans = () => {
  // typed useContext to avoid 'any'
  const { authDetails } = useContext(AuthContext) as any;
  const token = authDetails?.access_token ?? null;
  const client: AxiosInstance = axiosClient(token);
  const queryClient = useQueryClient();

  const speechToText: UseMutationResult<string, Error, SpeechToTextVars> =
    useMutation<string, Error, SpeechToTextVars>({
      mutationFn: async ({ audio, language }) => {
        const fd = new FormData();
        fd.append("audio", audio);
        if (language) fd.append("language", language);

        // axios returns AxiosResponse<T>
        const res: AxiosResponse<MaybeWrappedStringResponse> =
          await client.post("/trans/speech-to-text", fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

        const payload = res.data;
        // normalize to string
        return typeof payload === "string" ? payload : payload?.data ?? "";
      },
      onSuccess: () => {
        onSuccess({
          message: "Audio transcribed successfully!",
          success: "Transcription complete",
        });
      },
      onError: (err: unknown) => {
        onFailure({
          message: "Failed to transcribe audio",
          error: extractErrorMessage(err),
        });
      },
    });

  const textToSpeech: UseMutationResult<Blob, Error, TextToSpeechVars> =
    useMutation<Blob, Error, TextToSpeechVars>({
      mutationFn: async ({ text, language }) => {
        const fd = new FormData();
        fd.append("text", text);
        fd.append("language", language);

        const res: AxiosResponse<MaybeWrappedBlobResponse> = await client.post(
          "/trans/text-to-speech",
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
          }
        );

        const payload = res.data;
        return payload instanceof Blob ? payload : (payload?.data as Blob);
      },
      onSuccess: () => {
        onSuccess({
          message: "Text converted to speech!",
          success: "TTS ready",
        });
      },
      onError: (err: unknown) => {
        onFailure({
          message: "Failed to convert text to speech",
          error: extractErrorMessage(err),
        });
      },
    });

  const translateText: UseMutationResult<string, Error, TranslateTextVars> =
    useMutation<string, Error, TranslateTextVars>({
      mutationFn: async ({ text, target_lang, source_lang }) => {
        const payload: Record<string, unknown> = { text, target_lang };
        if (source_lang) payload.source_lang = source_lang;

        const res: AxiosResponse<MaybeWrappedStringResponse> =
          await client.post("/trans/translate-text", payload, {
            headers: {
              "Content-Type": "application/json",
            },
          });

        const data = res.data;
        return typeof data === "string" ? data : data?.data ?? "";
      },
      onSuccess: () => {
        onSuccess({
          message: "Text translated successfully!",
          success: "Translation complete",
        });
      },
      onError: (err: unknown) => {
        onFailure({
          message: "Failed to translate text",
          error: extractErrorMessage(err),
        });
      },
    });

  const speechToSpeech: UseMutationResult = useMutation({
    mutationFn: async ({ audio, target_lang, source_lang }) => {
      const fd = new FormData();
      fd.append("audio", audio);
      fd.append("target_lang", target_lang);
      if (source_lang) fd.append("source_lang", source_lang);

      const res = await client.post("/trans/speech-to-speech", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res?.data;
    },
    onError: (err: unknown) => {
      onFailure({
        message: "Failed to convert speech",
        error: extractErrorMessage(err),
      });
    },
  });

  return {
    speechToText: (vars: SpeechToTextVars) => speechToText.mutateAsync(vars),
    textToSpeech: (vars: TextToSpeechVars) => textToSpeech.mutateAsync(vars),
    translateText: (vars: TranslateTextVars) => translateText.mutateAsync(vars),
    speechToSpeech: speechToSpeech.mutateAsync,
    // expose states for UI
    status: {
      stt: speechToText.status,
      tts: textToSpeech.status,
      trans: translateText.status,
      s2s: speechToSpeech.status,
    },
  };
};
export default useTrans;
