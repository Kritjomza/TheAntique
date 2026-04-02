"use client";

import { useQuiz } from "@/context/QuizContext";
import { AnimatePresence, motion } from "framer-motion";
import Prologue from "./Prologue";
import StoryScene from "./StoryScene";
import ResultScreen from "./ResultScreen";
import { scenes } from "@/lib/sceneData";
import AntiqueBackground from "./AntiqueBackground";

export default function AppContent() {
  const { currentScene } = useQuiz();
  const totalScenes = scenes.length;
  const progress = currentScene > 0 && currentScene <= totalScenes
    ? (currentScene / totalScenes) * 100
    : 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden relative">
      <AntiqueBackground />
      {/* Progress bar — only visible during story scenes */}
      {currentScene > 0 && currentScene <= totalScenes && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-brand-charcoal/5">
          <motion.div
            className="h-full bg-brand-gold/60"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentScene === 0 && <Prologue key="prologue" />}
        {currentScene > 0 && currentScene <= totalScenes && (
          <StoryScene key={`scene-${currentScene}`} />
        )}
        {currentScene > totalScenes && <ResultScreen key="result" />}
      </AnimatePresence>
    </main>
  );
}
