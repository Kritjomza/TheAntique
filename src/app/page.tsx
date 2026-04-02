"use client";

import { QuizProvider } from "@/context/QuizContext";
import AppContent from "@/components/AppContent";

export default function Home() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}
