"use client";

import { motion } from "framer-motion";
import { useQuiz } from "@/context/QuizContext";
import { scenes, Choice } from "@/lib/sceneData";
import { Eye, MessageCircle, HelpCircle, Sparkles } from "lucide-react";

/* ──────────────────────────────────────────────
   Visual Mockup — placeholder illustration area
   ────────────────────────────────────────────── */
function VisualMockup({ visual, mood }: { visual: string; mood?: string }) {
  const bgMap: Record<string, string> = {
    warm: "from-amber-900/30 to-yellow-800/10",
    bright: "from-amber-600/20 to-orange-300/10",
    dark: "from-gray-900/50 to-indigo-950/30",
    dramatic: "from-red-900/20 to-gray-900/30",
  };
  const bg = bgMap[mood || "warm"] || bgMap.warm;

  return (
    <motion.div
      className={`w-full max-w-lg aspect-[16/9] rounded-lg bg-gradient-to-br ${bg} border border-brand-charcoal/10 flex flex-col items-center justify-center p-6 mb-8 relative overflow-hidden`}
      initial={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 2.5, ease: "easeOut" }}
    >
      {/* Film-grain overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDgiLz48L3N2Zz4=')] opacity-40 pointer-events-none" />

      {/* Frame icon */}
      <Eye className="w-6 h-6 text-brand-gold/60 mb-3" />

      {/* Visual description */}
      <p className="font-sans text-xs text-brand-charcoal/50 text-center leading-relaxed max-w-sm italic">
        {visual}
      </p>

      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-brand-gold/30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-brand-gold/30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-brand-gold/30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-brand-gold/30" />
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Kintsugi Effect — animated golden cracks
   ────────────────────────────────────────────── */
function KintsugiEffect() {
  return (
    <motion.div
      className="w-48 h-48 mb-8 relative mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <div className="absolute inset-0 bg-brand-charcoal/10 rounded-2xl overflow-hidden border border-brand-gold/20">
        {/* Multiple kintsugi crack lines */}
        {[
          { top: "30%", rotate: "25deg", delay: 0.5 },
          { top: "50%", rotate: "-15deg", delay: 1 },
          { top: "65%", rotate: "40deg", delay: 1.5 },
          { top: "40%", rotate: "-35deg", delay: 2 },
        ].map((line, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[2px] origin-left"
            style={{
              top: line.top,
              rotate: line.rotate,
              background: "linear-gradient(90deg, transparent, #d4af37, #d4af37, transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 2, delay: line.delay, ease: "easeInOut" }}
          />
        ))}
        {/* Golden glow at center */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.5 }}
        >
          <Sparkles className="w-8 h-8 text-brand-gold/60" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Scene badge — shows scene type
   ────────────────────────────────────────────── */
function SceneBadge({ type }: { type: string }) {
  const config: Record<string, { icon: React.ReactNode; label: string }> = {
    narrative: { icon: <MessageCircle className="w-3 h-3" />, label: "ดำเนินเรื่อง" },
    question: { icon: <HelpCircle className="w-3 h-3" />, label: "คำถาม" },
    interaction: { icon: <Sparkles className="w-3 h-3" />, label: "ปฏิสัมพันธ์" },
  };
  const c = config[type] || config.narrative;

  return (
    <motion.div
      className="flex items-center gap-1.5 text-brand-gold/70 font-sans text-[10px] uppercase tracking-[0.2em] mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 1 }}
    >
      {c.icon}
      <span>{c.label}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   Main StoryScene Component
   ══════════════════════════════════════════════ */
export default function StoryScene() {
  const { currentScene, nextScene, finishQuiz, addScore } = useQuiz();
  const scene = scenes[currentScene - 1];

  if (!scene) return null;

  const handleChoice = (choice: Choice) => {
    if (choice.effect) {
      Object.entries(choice.effect).forEach(([axis, value]) => {
        addScore(axis as keyof typeof choice.effect, value as number);
      });
    }

    if (currentScene === scenes.length) {
      finishQuiz();
    } else {
      nextScene();
    }
  };

  const isEarthquake = scene.fx === "earthquake";
  const isKintsugi = scene.fx === "kintsugi";

  return (
    <motion.div
      key={`scene-${scene.id}`}
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.97 }}
      animate={
        isEarthquake
          ? { opacity: 1, filter: "blur(0px)", scale: 1, x: [0, -4, 4, -6, 6, -3, 3, 0] }
          : { opacity: 1, filter: "blur(0px)", scale: 1 }
      }
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.03 }}
      transition={
        isEarthquake
          ? {
              x: { duration: 0.6, repeat: 2, ease: "easeInOut" },
              opacity: { duration: 1.5, ease: "easeOut" },
            }
          : { duration: 1.5, ease: "easeInOut" }
      }
      className="flex flex-col items-center justify-center max-w-2xl w-full text-center px-6 py-8"
    >
      {/* Scene Title */}
      <motion.h2
        className="font-serif text-sm text-brand-charcoal/40 uppercase tracking-[0.25em] mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        ฉากที่ {scene.id}
      </motion.h2>

      <motion.h3
        className="font-serif text-lg text-brand-gold mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        {scene.title}
      </motion.h3>

      {/* Visual Mockup Area */}
      <VisualMockup visual={scene.visual} mood={scene.mood} />

      {/* Kintsugi FX for scene 11 */}
      {isKintsugi && <KintsugiEffect />}

      {/* Scene Badge */}
      <SceneBadge type={scene.type} />

      {/* Narrative Text */}
      <motion.p
        className="font-serif text-lg md:text-xl leading-relaxed text-brand-charcoal mb-10 max-w-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.8 }}
      >
        {scene.text}
      </motion.p>

      {/* Choices */}
      <motion.div
        className="flex flex-col space-y-3 w-full max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
      >
        {scene.choices.map((choice, index) => (
          <motion.button
            key={index}
            className="w-full px-5 py-4 border border-brand-charcoal/15 hover:border-brand-gold hover:bg-brand-gold/5 transition-all duration-500 font-sans text-sm text-brand-charcoal/80 hover:text-brand-gold relative overflow-hidden group text-left"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChoice(choice)}
          >
            <span className="relative z-10 flex items-start gap-3">
              <span className="text-brand-gold/50 font-serif text-xs mt-0.5 shrink-0">
                {String.fromCharCode(65 + index)}.
              </span>
              <span>{choice.text}</span>
            </span>
            <div className="absolute inset-0 bg-brand-gold/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
