"use client";
import { create } from "zustand";
import type { DocumentItem } from "./types";
interface DocsState { items: DocumentItem[]; uploading: string | null; set: (d: DocumentItem[]) => void; setUploading: (n: string | null) => void }
export const useDocumentsStore = create<DocsState>((set) => ({
  items: [], uploading: null,
  set: (items) => set({ items }),
  setUploading: (uploading) => set({ uploading }),
}));
