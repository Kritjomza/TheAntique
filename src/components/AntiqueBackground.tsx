"use client";

import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const Particles = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-brand-gold/30 rounded-full blur-[0.8px]"
          initial={{ opacity: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
          animate={{
            opacity: [0, Math.random() * 0.6 + 0.2, 0],
            y: [`${p.y}vh`, `${p.y - 15 - Math.random() * 15}vh`],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 8 - 4)}vw`],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

const AmbientSmoke = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen opacity-70">
      {/* Smoke cloud 1 - Warm Gold */}
      <motion.div
        className="absolute top-[-10%] left-[-20%] w-[60vw] h-[60vh] bg-brand-gold/10 blur-[90px] rounded-full"
        animate={{
          x: [0, 50, 0, -30, 0],
          y: [0, 30, -20, 10, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Smoke cloud 2 - Deep Charcoal / Amber */}
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vh] bg-amber-900/10 blur-[100px] rounded-full"
        animate={{
          x: [0, -60, 20, -10, 0],
          y: [0, -40, 30, -20, 0],
          scale: [1, 1.1, 0.8, 1.2, 1],
          opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Smoke cloud 3 - Mysterious Indigo center */}
      <motion.div
        className="absolute top-[20%] left-[20%] w-[50vw] h-[50vh] bg-indigo-900/5 blur-[120px] rounded-full"
        animate={{
          x: [0, 40, -40, 20, 0],
          y: [0, -30, 40, -10, 0],
          scale: [0.9, 1.3, 0.8, 1.1, 0.9],
          opacity: [0.1, 0.4, 0.2, 0.5, 0.1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
};

export default function AntiqueBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates between -1 and +1
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      
      mouseX.set(normalizedX * -15); // Inverse movement for parallax
      mouseY.set(normalizedY * -15);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden bg-brand-parchment">
      {/* Ambient Smoke Effect */}
      <motion.div style={{ x: smoothX, y: smoothY }}>
        <AmbientSmoke />
      </motion.div>

      {/* Light Rays / God Rays coming from top-left */}
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[150%] h-[150%] origin-top-left flex pointer-events-none mix-blend-screen"
        style={{
          x: smoothX,
          y: smoothY,
        }}
      >
        <motion.div
          className="w-full h-full"
          style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 40%, rgba(212,175,55,0.02) 60%, transparent 80%)",
            transform: "rotate(-15deg)",
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            rotate: ["-15deg", "-13deg", "-15deg"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Floating dust particles */}
      <motion.div style={{ x: smoothX, y: smoothY }}>
        <Particles />
      </motion.div>

      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiLz48L3N2Zz4=')"
        }}
      />
      
      {/* Dynamic breathing vignette */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at center, transparent 0%, rgba(32,32,32,0.6) 100%)",
            "radial-gradient(ellipse at center, transparent 15%, rgba(32,32,32,0.7) 100%)",
            "radial-gradient(ellipse at center, transparent 0%, rgba(32,32,32,0.6) 100%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
