import { writable } from "svelte/store";
import type { ToastData } from "../types";

export const toastData = writable<ToastData | null>(null);

export const toast = (data?: ToastData | null) => {
  console.log("useToastData", data);
  if (data) {
    toastData.set(data);
    setTimeout(() => {
      toastData.set(null);
    }, 3000);
  }
};
