"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Particles = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-brand-gold/20 rounded-full blur-[0.5px]"
          initial={{ opacity: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
          animate={{
            opacity: [0, Math.random() * 0.5 + 0.2, 0],
            y: [`${p.y}vh`, `${p.y - 10 - Math.random() * 10}vh`],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 6 - 3)}vw`],
          }}
          transition={{
            duration: Math.random() * 8 + 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

export default function AntiqueBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-2]">
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiLz48L3N2Zz4=')"
        }}
      />
      
      {/* Subtle vignette/gradient vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(42,42,42,0.15)_100%)]" />

      {/* Floating dust particles */}
      <Particles />
    </div>
  );
}
