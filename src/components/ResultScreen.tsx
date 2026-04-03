"use client";

import { motion } from "framer-motion";
import { useQuiz } from "@/context/QuizContext";
import { toPng } from "html-to-image";
import { useCallback, useRef, useState } from "react";
import { Download, Loader2, Sparkles } from "lucide-react";
import { archetypeDetails, ArchetypeName } from "@/lib/scoring";
import GlobalPulse from "./GlobalPulse";
import Guestbook from "./Guestbook";

/* ══════════════════════════════════════════════════════════
   MobileExportCard — Hidden offscreen, rendered at fixed
   mobile width (430px). Height adapts to content so nothing
   is clipped. Output PNG will be 860×auto (2x retina).
   The design matches the visible card pixel-for-pixel.
   ══════════════════════════════════════════════════════════ */

const EXPORT_WIDTH = 430;

function MobileExportCard({
  cardRef,
  userName,
  details,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  userName: string;
  details: (typeof archetypeDetails)[ArchetypeName];
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: "-99999px",
        top: 0,
        width: `${EXPORT_WIDTH}px`,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <div
        ref={cardRef}
        style={{
          width: `${EXPORT_WIDTH}px`,
          backgroundColor: "#FAF8F0",
          fontFamily: "'Noto Serif Thai', 'Cormorant Garamond', 'Playfair Display', serif",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "48px 32px",
          boxSizing: "border-box",
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')",
        }}
      >
        {/* ── Ornate corners ── */}
        <div style={{ position: "absolute", top: 16, left: 16, width: 24, height: 24, borderTop: "2px solid rgba(212,175,55,0.7)", borderLeft: "2px solid rgba(212,175,55,0.7)" }} />
        <div style={{ position: "absolute", top: 16, right: 16, width: 24, height: 24, borderTop: "2px solid rgba(212,175,55,0.7)", borderRight: "2px solid rgba(212,175,55,0.7)" }} />
        <div style={{ position: "absolute", bottom: 16, left: 16, width: 24, height: 24, borderBottom: "2px solid rgba(212,175,55,0.7)", borderLeft: "2px solid rgba(212,175,55,0.7)" }} />
        <div style={{ position: "absolute", bottom: 16, right: 16, width: 24, height: 24, borderBottom: "2px solid rgba(212,175,55,0.7)", borderRight: "2px solid rgba(212,175,55,0.7)" }} />

        {/* Gold dots */}
        <div style={{ position: "absolute", top: 20, left: 20, width: 8, height: 8, backgroundColor: "rgba(212,175,55,0.4)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 8, height: 8, backgroundColor: "rgba(212,175,55,0.4)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: 20, left: 20, width: 8, height: 8, backgroundColor: "rgba(212,175,55,0.4)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: 20, right: 20, width: 8, height: 8, backgroundColor: "rgba(212,175,55,0.4)", borderRadius: "50%" }} />

        {/* Inner border frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "1px solid rgba(212,175,55,0.12)",
            pointerEvents: "none",
          }}
        />

        {/* ── Header ── */}
        <p
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            color: "#d4af37",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            fontSize: 10,
            marginBottom: 28,
            fontWeight: 600,
          }}
        >
          — The Antique Shop Registry —
        </p>

        <h2 style={{ fontSize: 18, color: "#2a2a2a", marginBottom: 28, lineHeight: 1.5 }}>
          วัตถุโบราณที่สะท้อนจิตวิญญาณของ
          <br />
          <span
            style={{
              fontSize: 36,
              display: "block",
              marginTop: 8,
              textDecoration: "underline",
              textDecorationColor: "rgba(212,175,55,0.3)",
              textUnderlineOffset: "12px",
            }}
          >
            {userName}
          </span>
        </h2>

        {/* ── Character Image ── */}
        <div
          style={{
            width: 180,
            height: 180,
            margin: "16px auto",
            borderRadius: "50%",
            border: "3px solid rgba(212,175,55,0.4)",
            padding: 6,
            boxShadow: "0 0 30px rgba(212,175,55,0.15)",
            backgroundColor: "rgba(42,42,42,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
            <img
              src={details.image}
              alt={details.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* ── Sparkle divider ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0", width: "80%" }}>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.5))" }} />
          <span style={{ color: "#d4af37", fontSize: 14 }}>✦</span>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, rgba(212,175,55,0.5))" }} />
        </div>

        {/* ── Name and Title ── */}
        <h1 style={{ fontSize: 28, color: "#2a2a2a", fontWeight: "bold", margin: "8px 0 4px" }}>
          {details.name}
        </h1>
        <p style={{ color: "rgba(212,175,55,0.8)", fontSize: 18, fontStyle: "italic", marginBottom: 24 }}>
          &ldquo;{details.title}&rdquo;
        </p>

        {/* ── Content Body ── */}
        <div
          style={{
            backgroundColor: "rgba(210,180,120,0.12)",
            padding: "20px 24px",
            borderRadius: 4,
            border: "1px solid rgba(42,42,42,0.1)",
            textAlign: "left",
            width: "100%",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(42,42,42,0.5)", marginBottom: 6, fontWeight: 700 }}>
              คำอธิบาย (Description)
            </h3>
            <p style={{ color: "rgba(42,42,42,0.9)", lineHeight: 1.7, fontSize: 13 }}>
              {details.description}
            </p>
          </div>

          <div style={{ height: 1, background: "rgba(42,42,42,0.1)", margin: "12px 0" }} />

          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(42,42,42,0.5)", marginBottom: 6, fontWeight: 700 }}>
              ลักษณะนิสัย (Personality)
            </h3>
            <p style={{ color: "rgba(42,42,42,0.9)", lineHeight: 1.7, fontSize: 13 }}>
              {details.personality}
            </p>
          </div>

          <div style={{ height: 1, background: "rgba(42,42,42,0.1)", margin: "12px 0" }} />

          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(42,42,42,0.5)", marginBottom: 6, fontWeight: 700 }}>
              ลักษณะเด่น (Traits)
            </h3>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(212,175,55,0.9)", fontWeight: 500, fontSize: 13, letterSpacing: "0.03em" }}>
              {details.traits}
            </p>
          </div>

          <div style={{ height: 1, background: "rgba(42,42,42,0.1)", margin: "12px 0" }} />

          <div style={{ backgroundColor: "rgba(42,42,42,0.05)", padding: 14, borderRadius: 4, fontStyle: "italic", borderLeft: "2px solid #d4af37" }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontStyle: "normal", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(42,42,42,0.5)", marginBottom: 4 }}>
              เสียงสะท้อนในใจ (Inner Voice)
            </h3>
            <p style={{ color: "rgba(42,42,42,0.8)", fontSize: 13 }}>
              &ldquo;{details.innerVoice}&rdquo;
            </p>
          </div>
        </div>

        {/* ── Quote Footer ── */}
        <p style={{ color: "#2a2a2a", fontSize: 16, marginTop: 28, maxWidth: "80%", fontStyle: "italic", lineHeight: 1.6 }}>
          &ldquo;{details.quote}&rdquo;
        </p>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "rgba(42,42,42,0.3)", textTransform: "uppercase", letterSpacing: "0.4em", marginTop: 32 }}>
          © The Antique Shop
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Main Result Screen
   ══════════════════════════════════════════════ */
export default function ResultScreen() {
  const { userName, archetype } = useQuiz();
  const exportCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const validArchetype = archetype || ("สมุดบันทึกปกหนังทำมือ" as ArchetypeName);
  const details = archetypeDetails[validArchetype];

  const handleExport = useCallback(async () => {
    if (exportCardRef.current === null || isExporting) return;
    setIsExporting(true);

    try {
      const node = exportCardRef.current;
      const nodeHeight = node.scrollHeight;

      // Pre-warm pass: ensures fonts & images are fully rasterized
      await toPng(node, {
        cacheBust: true,
        quality: 1.0,
        width: EXPORT_WIDTH,
        height: nodeHeight,
      });

      // Final render at 2x pixel ratio for sharp retina-quality output
      // Output: 860px × (auto) — exactly mobile portrait sized
      const dataUrl = await toPng(node, {
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 2,
        width: EXPORT_WIDTH,
        height: nodeHeight,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `TheAntiqueShop_${userName}_Result.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }, [userName, isExporting]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="flex flex-col items-center justify-start min-h-screen pt-12 pb-24 w-full px-4 overflow-y-auto overflow-x-hidden"
    >
      {/* Hidden export card at fixed mobile width — mirrors visible card */}
      <MobileExportCard cardRef={exportCardRef} userName={userName} details={details} />

      {/* ─── Visible result card (responsive) ─── */}
      <div
        className="bg-brand-light p-8 md:p-12 border border-brand-gold/40 shadow-2xl relative w-full max-w-xl mx-auto flex flex-col items-center text-center rounded-sm"
        style={{
          boxShadow: "0 25px 50px -12px rgba(42, 42, 42, 0.25), inset 0 0 40px rgba(212, 175, 55, 0.05)",
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')",
        }}
      >
        {/* Ornate corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-[2px] border-l-[2px] border-brand-gold/70" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-[2px] border-r-[2px] border-brand-gold/70" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-[2px] border-l-[2px] border-brand-gold/70" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-[2px] border-r-[2px] border-brand-gold/70" />

        <div className="absolute top-5 left-5 w-2 h-2 bg-brand-gold/40 rounded-full" />
        <div className="absolute top-5 right-5 w-2 h-2 bg-brand-gold/40 rounded-full" />
        <div className="absolute bottom-5 left-5 w-2 h-2 bg-brand-gold/40 rounded-full" />
        <div className="absolute bottom-5 right-5 w-2 h-2 bg-brand-gold/40 rounded-full" />

        {/* Header */}
        <p className="font-sans text-brand-gold uppercase tracking-[0.3em] text-[10px] mb-8 font-semibold">
          — The Antique Shop Registry —
        </p>

        <h2 className="text-xl md:text-2xl font-serif text-brand-charcoal mb-8 text-balance">
          วัตถุโบราณที่สะท้อนจิตวิญญาณของ <br />
          <span className="text-3xl md:text-5xl mt-3 block text-brand-charcoal underline decoration-brand-gold/30 underline-offset-[12px] decoration-[1px]">
            {userName}
          </span>
        </h2>

        {/* Character Image */}
        <div className="w-40 h-40 md:w-56 md:h-56 my-6 rounded-full border-[3px] border-brand-gold/40 flex flex-col items-center justify-center p-2 relative shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-brand-charcoal/5">
          <div className="w-full h-full rounded-full overflow-hidden relative">
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
          &ldquo;{details.title}&rdquo;
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
              &ldquo;{details.innerVoice}&rdquo;
            </p>
          </div>
        </div>

        {/* Quote Footer */}
        <p className="font-serif text-brand-charcoal text-lg md:text-xl mt-10 max-w-sm italic">
          &ldquo;{details.quote}&rdquo;
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
