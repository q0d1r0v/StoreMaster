import { defineStore } from "pinia";

export const useCounterStore = defineStore("index", {
  state: () => ({
    count: 0,
  }),

  actions: {
    increment() {
      this.count++;
    },
  },
});
