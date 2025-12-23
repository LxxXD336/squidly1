"use client";
import { useEffect } from "react";
import { useAcc } from "../AccProvider";

export default function VideoPauseEffects() {
  const { state } = useAcc();

  useEffect(() => {
    const vids = Array.from(document.querySelectorAll("video")) as HTMLVideoElement[];
    if (state.pauseMotion) {
      vids.forEach((v) => {
        v.pause();
        (v as any)._acc_prevAutoplay = v.autoplay;
        v.autoplay = false;
      });
    } else {
      vids.forEach((v) => {
        if ((v as any)._acc_prevAutoplay) {
          v.autoplay = true;
          v.play?.().catch(() => {});
        }
        delete (v as any)._acc_prevAutoplay;
      });
    }
  }, [state.pauseMotion]);

  return null;
}
