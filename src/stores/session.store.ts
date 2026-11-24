"use client";
import { create } from "zustand";
interface SessionState { expiresAt: string | null; setExpiresAt: (v: string | null) => void }
export const useSessionStore = create<SessionState>((set) => ({ expiresAt: null, setExpiresAt: (expiresAt) => set({ expiresAt }) }));
