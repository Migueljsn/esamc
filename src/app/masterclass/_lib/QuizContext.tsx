"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface QuizContextValue {
  isOpen: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;
}

const MasterclassQuizContext = createContext<QuizContextValue | null>(null);

export function MasterclassQuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MasterclassQuizContext.Provider value={{ isOpen, openQuiz: () => setIsOpen(true), closeQuiz: () => setIsOpen(false) }}>
      {children}
    </MasterclassQuizContext.Provider>
  );
}

export function useMasterclassQuiz() {
  const ctx = useContext(MasterclassQuizContext);
  if (!ctx) throw new Error("useMasterclassQuiz must be used inside MasterclassQuizProvider");
  return ctx;
}
