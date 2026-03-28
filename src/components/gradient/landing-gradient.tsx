
'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * LandingGradient
 * 
 * A custom-built animated mesh gradient using Framer Motion.
 * This component provides a fluid, vibrant background effect without external dependencies.
 */
export function LandingGradient() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0F0635]">
      {/* Pink Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 80, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#FB5066] blur-[120px] opacity-40"
      />

      {/* Cyan Glow */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -60, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#00EFFF] blur-[120px] opacity-30"
      />

      {/* Purple Glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 40, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-[#8B6AE6] blur-[120px] opacity-40"
      />

      {/* Yellow Glow */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          x: [0, -120, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[10%] -right-[20%] w-[50%] h-[50%] rounded-full bg-[#FBFF00] blur-[120px] opacity-20"
      />
    </div>
  );
}
