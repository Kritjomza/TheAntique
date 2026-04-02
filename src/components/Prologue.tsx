"use client";

import { motion } from "framer-motion";
import { useQuiz } from "@/context/QuizContext";
import { useEffect, useState } from "react";
import GlobalPulse from "./GlobalPulse";
import Guestbook from "./Guestbook";

export default function Prologue() {
  const { userName, setUserName, setIsStarted, nextScene } = useQuiz();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsStarted(true);
      nextScene();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)", transition: { duration: 1.5 } }}
      className="flex flex-col items-center justify-start min-h-screen w-full relative overflow-y-auto"
    >

      {/* Hero Section */}
      <div className="z-10 flex flex-col items-center justify-center min-h-[90vh] max-w-md w-full px-6">
        <motion.h1 
          className="text-4xl md:text-6xl font-serif text-brand-charcoal mb-4 tracking-wider text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        >
          The Antique Shop
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-brand-charcoal/70 mb-12 font-serif italic text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          "ร้านของเก่าที่รอเจ้าของ"
        </motion.p>

        <motion.form 
          onSubmit={handleStart}
          className="w-full flex flex-col items-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 3 }}
        >
          <div className="relative w-full">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="ระบุชื่อของคุณเพื่อเริ่มการเดินทาง..."
              className="w-full bg-transparent border-b border-brand-charcoal/30 px-4 py-3 text-center focus:outline-none focus:border-brand-gold transition-colors font-sans"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            className="px-8 py-3 uppercase tracking-widest text-sm font-sans border border-brand-charcoal/20 hover:border-brand-gold hover:text-brand-gold transition-all duration-500 relative overflow-hidden group bg-transparent"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">เริ่มเดินทาง</span>
            <div className="absolute inset-0 bg-brand-gold/10 -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </motion.button>
        </motion.form>
      </div>

      {/* Global Pulse and Guestbook */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 4 }}
        className="w-full flex flex-col items-center pb-32"
      >
        <div className="w-[1px] h-32 bg-gradient-to-b from-brand-charcoal/0 via-brand-gold/50 to-brand-charcoal/0 mb-8" />
        
        <GlobalPulse />
        
        <div className="w-[1px] h-32 bg-gradient-to-b from-brand-charcoal/0 via-brand-gold/50 to-brand-charcoal/0 my-8" />

        <Guestbook />
      </motion.div>
    </motion.div>
  );
}
