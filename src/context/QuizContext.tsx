"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Scores, ArchetypeName, calculateArchetype } from "@/lib/scoring";

interface QuizContextType {
  userName: string;
  setUserName: (name: string) => void;
  isStarted: boolean;
  setIsStarted: (started: boolean) => void;
  currentScene: number;
  setCurrentScene: (scene: number) => void;
  scores: Scores;
  addScore: (axis: keyof Scores, value: number) => void;
  archetype: ArchetypeName | null;
  finishQuiz: () => void;
  nextScene: () => void;
  prevScene: () => void;
}

const initialScores: Scores = { I: 0, E: 0, T: 0, F: 0, S: 0, C: 0 };

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState(0); // 0 = Prologue, 1-13 = Story scenes, 14 = Result
  const [scores, setScores] = useState<Scores>(initialScores);
  const [archetype, setArchetype] = useState<ArchetypeName | null>(null);

  const addScore = (axis: keyof Scores, value: number) => {
    setScores((prev) => ({ ...prev, [axis]: prev[axis] + value }));
  };

  const nextScene = () => {
    setCurrentScene((prev) => prev + 1);
  };

  const prevScene = () => {
    setCurrentScene((prev) => Math.max(0, prev - 1));
  };

  const finishQuiz = async () => {
    const result = calculateArchetype(scores);
    setArchetype(result);
    setCurrentScene(14); // Assuming 14 is the result screen

    // Attempt to save to Supabase
    try {
      const { supabase } = await import("@/lib/supabaseClient");
      const { data, error } = await supabase.from("quiz_results").insert([
        { user_name: userName, archetype_result: result, scores_json: scores }
      ]);
      
      if (error) {
        console.error("Supabase Insert Error:", error);
      } else {
        console.log("Saved to supabase successfully!", data);
      }
    } catch (e) {
      console.error("Failed to save result exception:", e);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        userName,
        setUserName,
        isStarted,
        setIsStarted,
        currentScene,
        setCurrentScene,
        scores,
        addScore,
        archetype,
        finishQuiz,
        nextScene,
        prevScene,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
