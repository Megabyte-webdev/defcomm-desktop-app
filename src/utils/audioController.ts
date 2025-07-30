const audioController = {
  audio: null as HTMLAudioElement | null,
  timeoutId: null as ReturnType<typeof setTimeout> | null,
  isPlaying: false,
  muted: false,

  playRingtone(ringtone: string, repeatFor30s: boolean = false) {
    // Prevent duplicate play
    if (this.isPlaying) return;

    this.stopRingtone(); // Clear any existing state

    this.audio = new Audio(ringtone);
    this.audio.loop = repeatFor30s;
    this.audio.volume = this.muted ? 0 : 1;

    this.isPlaying = true;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Ringtone play interrupted:", error);
        this.isPlaying = false;
      });
    }

    if (repeatFor30s) {
      this.timeoutId = setTimeout(() => {
        this.stopRingtone();
      }, 30000);
    }
  },

  stopRingtone() {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch (e) {
        console.warn("Error stopping audio:", e);
      }
      this.audio = null;
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.isPlaying = false;
  },

  setMuted(value: boolean) {
    this.muted = value;
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : 1;
    }
  },

  toggleMute() {
    this.setMuted(!this.muted);
  },
};

export default audioController;
