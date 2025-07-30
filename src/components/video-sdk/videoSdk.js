import { createMeeting, MeetingProvider } from "@videosdk.live/react-sdk";

const VIDEO_SDK_API_KEY = "YOUR_VIDEOSDK_API_KEY";
let authToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI1Nzk3NWJmMi0zNGZkLTQzMGUtOTU4Mi1lMjBiODI3ZWQ5NTIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNjQ2NzIyNCwiZXhwIjoxNzY4MDAzMjI0fQ.OEVlKBS6Zni6cSplfbgLOhj96_jz60ymZclUZqNgUsw";

export const getMeetingId = async () => {
  const res = await fetch("https://api.videosdk.live/v2/rooms", {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
  });
  const { roomId } = await res.json();
  return roomId;
};

export const joinMeeting = async ({ meetingId, token, participantName }) => {
  const meeting = await createMeeting({
    meetingId,
    token,
  });

  return { meeting, participantName };
};
