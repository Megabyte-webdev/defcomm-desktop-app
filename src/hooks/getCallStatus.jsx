export const getCallStatus = (msg, callMessage) => {
  const callTimestamp = new Date(msg?.updated_at).getTime(); // when invite was sent
  const currentTime = Date.now(); // current time
  const timeDifference = (currentTime - callTimestamp) / 1000; // seconds since invite

  if (callMessage?.status === "on") return "In Call"; // active call
  if (timeDifference <= 60) {
    // within 60 seconds of invite
    return callMessage?.status === "ringing" ? "Ringing..." : "Call Ended";
  }
  return "Call Ended"; // fallback
};
