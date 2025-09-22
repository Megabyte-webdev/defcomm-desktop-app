import { useContext, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import { CommContext } from "../context/CommContext";
import { AuthContext } from "../context/AuthContext";
import { formatLocalTime } from "../utils/formmaters";
import { useRadioHiss } from "../utils/walkie-talkie/useRadioHiss";
import useTrans from "../hooks/useTrans";
import { onSuccess } from "../utils/notifications/OnSuccess";

const useCommChannel = ({ channelId, token }) => {
  const pusherRef = useRef(null);
  const channelRef = useRef(null);
  const audioRef = useRef(null); // currently playing voice
  const queueRef = useRef([]); // queued messages

  const { speechToText } = useTrans();

  const { startRadioHiss, stopRadioHiss } = useRadioHiss();

  const { authDetails } = useContext(AuthContext);
  const user = authDetails?.user;

  const {
    setIsCommActive,
    activeChannel,
    setConnectingChannelId,
    setWalkieMessages,
    setRecentMessages,
    setCurrentSpeaker,
  } = useContext(CommContext);

  /** Plays the next queued message */
  const playNextInQueue = () => {
    if (queueRef.current.length === 0) {
      setCurrentSpeaker(null);
      stopRadioHiss();
      return;
    }

    const nextMsg = queueRef.current.shift();

    setCurrentSpeaker({
      name:
        nextMsg.sender?.id === user?.id
          ? "You"
          : nextMsg.user_name || nextMsg.display_name || "Unknown",
      time: formatLocalTime(),
      transcript: nextMsg.transcript || null,
    });

    // Start background hiss before voice
    startRadioHiss();

    const audioUrl = `${import.meta.env.VITE_BASE_URL}/${nextMsg.record}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.play().catch((err) => console.warn("Audio play error:", err));

    audio.onended = () => {
      stopRadioHiss(); // stop when done
      audioRef.current = null;
      playNextInQueue();
    };
  };

  useEffect(() => {
    if (!channelId || !token) return;

    setConnectingChannelId(channelId);
    setIsCommActive(false);

    // cleanup old
    if (channelRef.current) {
      if (pusherRef.current) {
        pusherRef.current.unsubscribe(channelRef.current.name);
        pusherRef.current.disconnect();
      }
      setIsCommActive(false);
      pusherRef.current = null;
      channelRef.current = null;
    }

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: "mt1",
      wsHost: import.meta.env.VITE_PUSHER_HOST,
      forceTLS: true,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT,
      auth: { headers: { Authorization: `Bearer ${token}` } },
    });

    const channelName = `private-walkie.${channelId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      onSuccess({
        message: "Channel Connected",
        success: `You are now subscribed to ${
          activeChannel?.name || channelName
        }.`,
      });
      setIsCommActive(true);
      setConnectingChannelId(null);
    });

    channel.bind("walkie.message.sent", async ({ data }) => {
      const msg = {
        ...data.mss_chat,
        display_name:
          data.sender?.id === user?.id
            ? "You"
            : data.mss_chat.user_name || "Unknown",
      };

      // update message lists immediately (so UI shows the incoming message item)
      setWalkieMessages((prev) => [...prev, msg]);
      setRecentMessages((prev) => [msg, ...prev].slice(0, 2));

      // only transcribe & queue remote audio (not self-sent)
      if (msg?.record && data.sender?.id !== user?.id) {
        const audioUrl = `/secure/${msg.record}`;

        try {
          // fetch as blob
          const res = await fetch(audioUrl);
          if (!res.ok)
            throw new Error("Failed to fetch audio for transcription");
          const blob = await res.blob();

          const transcript = await speechToText.mutateAsync({
            audio: blob,
            language: "en-US",
          });

          // attach transcript to message object
          msg.transcript = transcript?.text ?? transcript ?? null;
        } catch (err) {
          // transcription failed — still queue the audio so user hears it
          console.warn("Transcription failed, will still queue audio:", err);
          msg.transcript = null;
        }

        // enqueue (now we have transcript or null)
        queueRef.current.push(msg);
        if (!audioRef.current) playNextInQueue();
      }
    });

    pusherRef.current = pusher;
    channelRef.current = channel;

    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      setIsCommActive(false);
      setConnectingChannelId(null);
      setCurrentSpeaker(null);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopRadioHiss();
      queueRef.current = [];
    };
  }, [channelId, token]);

  return () => {
    try {
      pusherRef.current?.disconnect();
    } catch (e) {
      console.warn("Cleanup error:", e);
    }
  };
};
export default useCommChannel;
