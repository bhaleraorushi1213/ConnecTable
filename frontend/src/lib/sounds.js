const createAudio = (src) => {
  const audio = new Audio(src);
  audio.preload = "auto";
  return audio;
};

const sounds = {
  message: createAudio("/sounds/notification.mp3"),
  notification: createAudio("/sounds/notification1.mp3"),
  sent: createAudio("/sounds/notification2.mp3"),
};

export const playSound = (type = "message", volume = 0.5) => {
  try {
    const sound = sounds[type];
    if (!sound) return;

    sound.volume = volume;
    sound.currentTime = 0;
    
    sound.play().catch((err) => {
      // browsers block autoplay without user interaction
      console.log("Sound blocked:", err);
    });
  } catch (error) {
    console.log("Error playing sound:", error);
  }
};