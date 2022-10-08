import { writable } from "svelte/store";
import type { ToastData } from "../types";

export const toastData = writable<ToastData | null>(null);

export const toast = (data?: ToastData | null) => {
  if (data) {
    toastData.set({
      message: data.message.substring(0, 100),
      type: data.type,
    });
    setTimeout(() => {
      toastData.set(null);
    }, 3000);
  }
};
