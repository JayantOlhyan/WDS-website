"use client";

import React, { useState, useEffect } from "react";

export function CRTOverlay() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [scanlinesActive, setScanlinesActive] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("wds_scanlines");
    if (saved !== null) {
      setScanlinesActive(saved === "true");
    }
  }, []);

  if (!mounted || !scanlinesActive) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-30 scanline-effect"
    />
  );
}
