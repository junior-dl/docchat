"use client";
import { create } from "zustand";
import type { Message } from "./types";
interface ChatState { messages: Message[]; pending: boolean; add: (m: Message) => void; setPending: (p: boolean) => void; clear: () => void }
export const useChatStore = create<ChatState>((set) => ({
  messages: [], pending: false,
  add: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setPending: (pending) => set({ pending }),
  clear: () => set({ messages: [] }),
}));
