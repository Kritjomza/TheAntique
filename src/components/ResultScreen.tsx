"use client";

import { motion } from "framer-motion";
import { useQuiz } from "@/context/QuizContext";
import { toPng } from "html-to-image";
import { useCallback, useRef, useState } from "react";
import { Download, Loader2, Sparkles, Feather } from "lucide-react";
import { archetypeDetails, ArchetypeName } from "@/lib/scoring";
import GlobalPulse from "./GlobalPulse";
import Guestbook from "./Guestbook";

export default function ResultScreen() {
  const { userName, archetype } = useQuiz();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // If somehow archetype is not set, use a fallback to prevent crashing.
  const validArchetype = archetype || ("สมุดบันทึกปกหนังทำมือ" as ArchetypeName);
  const details = archetypeDetails[validArchetype];

  const handleExport = useCallback(() => {
    if (cardRef.current === null) return;
    setIsExporting(true);

    const node = cardRef.current;
    // Fix mobile/scrolling clipping issues by explicitly setting size and transform
    toPng(node, { 
      cacheBust: true, 
      quality: 1.0, 
      pixelRatio: 2,
      width: node.offsetWidth,
      height: node.offsetHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      }
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `TheAntiqueShop_${userName}_Result.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Oops, something went wrong!", err);
      })
      .finally(() => {
        setIsExporting(false);
      });
  }, [cardRef, userName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="flex flex-col items-center justify-start min-h-screen pt-12 pb-24 w-full px-4 overflow-y-auto overflow-x-hidden"
    >
      <div 
        ref={cardRef} 
        className="bg-brand-light p-8 md:p-12 border border-brand-gold/40 shadow-2xl relative w-full max-w-xl mx-auto flex flex-col items-center text-center rounded-sm"
        style={{
          boxShadow: "0 25px 50px -12px rgba(42, 42, 42, 0.25), inset 0 0 40px rgba(212, 175, 55, 0.05)",
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')"
        }}
      >
        {/* Ornate corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-[2px] border-l-[2px] border-brand-gold/70"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-[2px] border-r-[2px] border-brand-gold/70"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-[2px] border-l-[2px] border-brand-gold/70"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-[2px] border-r-[2px] border-brand-gold/70"></div>

        <div className="absolute top-5 left-5 w-2 h-2 bg-brand-gold/40 rounded-full"></div>
        <div className="absolute top-5 right-5 w-2 h-2 bg-brand-gold/40 rounded-full"></div>
        <div className="absolute bottom-5 left-5 w-2 h-2 bg-brand-gold/40 rounded-full"></div>
        <div className="absolute bottom-5 right-5 w-2 h-2 bg-brand-gold/40 rounded-full"></div>

        {/* Header */}
        <p className="font-sans text-brand-gold uppercase tracking-[0.3em] text-[10px] mb-8 font-semibold">
          — The Antique Shop Registry —
        </p>
        
        <h2 className="text-xl md:text-2xl font-serif text-brand-charcoal mb-8 text-balance">
          วัตถุโบราณที่สะท้อนจิตวิญญาณของ <br/>
          <span className="text-3xl md:text-5xl mt-3 block text-brand-charcoal underline decoration-brand-gold/30 underline-offset-[12px] decoration-[1px]">
            {userName}
          </span>
        </h2>
        
        {/* Character Image */}
        <div className="w-40 h-40 md:w-56 md:h-56 my-6 rounded-full border-[3px] border-brand-gold/40 flex flex-col items-center justify-center p-2 relative shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-brand-charcoal/5">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              {/* Using standard img for html-to-image compatibility */}
              <img 
                src={details.image} 
                alt={details.name} 
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="absolute -inset-2 border border-brand-gold/20 rounded-full border-dashed" />
            <div className="absolute -inset-4 border border-brand-charcoal/10 rounded-full" />
        </div>

        <div className="flex items-center gap-4 my-6 w-full max-w-sm">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-brand-gold/50" />
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-brand-gold/50" />
        </div>

        {/* Name and Title */}
        <h1 className="text-3xl md:text-4xl font-serif text-brand-charcoal font-bold leading-tight px-2 drop-shadow-sm">
          {details.name}
        </h1>
        <p className="font-serif text-brand-gold/80 text-xl md:text-2xl mt-3 italic mb-8">
          "{details.title}"
        </p>

        {/* Content Body */}
        <div className="bg-brand-sepia/20 p-6 md:p-8 rounded-sm border border-brand-charcoal/10 text-left w-full space-y-6">
          
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-widest text-brand-charcoal/50 mb-2 font-bold drop-shadow-sm">
              คำอธิบาย (Description)
            </h3>
            <p className="font-serif text-brand-charcoal/90 leading-relaxed text-sm">
              {details.description}
            </p>
          </div>

          <div className="h-[1px] w-full bg-brand-charcoal/10" />

          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-widest text-brand-charcoal/50 mb-2 font-bold drop-shadow-sm">
              ลักษณะนิสัย (Personality)
            </h3>
            <p className="font-serif text-brand-charcoal/90 leading-relaxed text-sm">
              {details.personality}
            </p>
          </div>

          <div className="h-[1px] w-full bg-brand-charcoal/10" />

          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-widest text-brand-charcoal/50 mb-2 font-bold drop-shadow-sm">
              ลักษณะเด่น (Traits)
            </h3>
            <p className="font-sans text-brand-gold/90 font-medium text-sm tracking-wide">
              {details.traits}
            </p>
          </div>

          <div className="h-[1px] w-full bg-brand-charcoal/10" />

          <div className="bg-brand-charcoal/5 p-4 rounded-sm italic border-l-2 border-brand-gold">
            <h3 className="font-sans text-[10px] not-italic uppercase tracking-widest text-brand-charcoal/50 mb-1">
              เสียงสะท้อนในใจ (Inner Voice)
            </h3>
            <p className="font-serif text-brand-charcoal/80 text-sm">
              "{details.innerVoice}"
            </p>
          </div>

        </div>

        {/* Quote Footer */}
        <p className="font-serif text-brand-charcoal text-lg md:text-xl mt-10 max-w-sm italic">
          "{details.quote}"
        </p>
        
        <p className="font-sans text-[9px] text-brand-charcoal/30 uppercase tracking-[0.4em] mt-12">
          © The Antique Shop
        </p>
      </div>

      <motion.button
         onClick={handleExport}
         disabled={isExporting}
         className="mt-10 mb-20 px-8 py-4 bg-brand-charcoal text-brand-light border border-transparent hover:bg-brand-charcoal/90 hover:border-brand-gold/50 transition-all duration-300 font-sans tracking-widest uppercase text-sm flex items-center gap-3 disabled:opacity-50 shadow-xl"
         whileHover={{ scale: 1.02 }}
         whileTap={{ scale: 0.98 }}
      >
        {isExporting ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
        <span>บันทึกลงในความทรงจำ (Save as PNG)</span>
      </motion.button>

      {/* Global Pulse and Guestbook */}
      <div className="w-[1px] h-32 bg-gradient-to-b from-brand-charcoal/0 via-brand-gold/50 to-brand-charcoal/0 mb-8" />
      <GlobalPulse currentArchetype={validArchetype} />
      
      <div className="w-[1px] h-32 bg-gradient-to-b from-brand-charcoal/0 via-brand-gold/50 to-brand-charcoal/0 my-8" />
      <Guestbook currentArchetype={validArchetype} currentUserName={userName} />

    </motion.div>
  );
}
