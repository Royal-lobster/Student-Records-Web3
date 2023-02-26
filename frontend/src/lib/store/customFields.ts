import { writable } from "svelte/store";

export type CustomField = {
  id: number;
  name: string;
  type: string;
};

export const customFieldsStore = writable<CustomField[]>([
  {
    id: 0,
    name: "",
    type: "text",
  },
]);
