"use client";
import React from "react";
import AudioEffects from "./AudioEffects";
import AltAuditEffects from "./AltAuditEffects";
import MagnifierEffects from "./MagnifierEffects";
import KeyboardShortcuts from "./KeyboardShortcuts";
import VideoPauseEffects from "./VideoPauseEffects";

export default function Effects() {
  return (
    <>
      <AudioEffects />
      <AltAuditEffects />
      <MagnifierEffects />
      <KeyboardShortcuts />
      <VideoPauseEffects />
    </>
  );
}
