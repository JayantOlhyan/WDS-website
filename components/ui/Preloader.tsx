"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TEXTS = [
  "INITIALIZING WDS SYSTEM...",
  "LOADING ASSETS...",
  "ESTABLISHING CONNECTION...",
  "SYSTEM READY."
];

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Increment progress with random chunks
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    // Update text based on time
    const textInterval = setInterval(() => {
      setTextIndex((prev) => Math.min(prev + 1, TEXTS.length - 1));
    }, 600);

    // Hide preloader after sequence completes
    const finishTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearTimeout(finishTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-wds-bg flex flex-col items-center justify-center"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-grid-lines opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md w-full px-8">
            <h1 className="font-pixel text-4xl sm:text-5xl text-wds-yellow mb-10 text-center drop-shadow-[0_0_15px_rgba(255,230,0,0.5)]">
              WDS<span className="text-wds-white animate-pulse">_</span>
            </h1>
            
            <div className="w-full space-y-4">
              <div className="flex justify-between font-mono text-xs sm:text-sm text-wds-muted">
                <span>{TEXTS[textIndex]}</span>
                <span className="text-wds-yellow">{Math.min(progress, 100)}%</span>
              </div>
              
              <div className="h-5 w-full border-2 border-wds-yellow bg-wds-bg p-0.5 shadow-[0_0_10px_rgba(255,230,0,0.2)]">
                <div 
                  className="h-full bg-wds-yellow transition-all duration-150 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="mt-6 h-4">
              {progress >= 100 && (
                <div className="font-mono text-xs text-wds-green font-bold animate-pulse">
                  &gt; ACCESS GRANTED
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
