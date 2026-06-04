"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface QuizContextValue {
  isOpen: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <QuizContext.Provider value={{ isOpen, openQuiz: () => setIsOpen(true), closeQuiz: () => setIsOpen(false) }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}
