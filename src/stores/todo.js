import axios from "axios";
import { defineStore } from "pinia";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    isLoading: false,
  }),
  getters: {
    todo: (state) => state.todos,
  },
  actions: {
    async getList() {
      this.isLoading = true;
      await axios
        .get("http://127.0.0.1:8000/api/todo")
        .then((response) => {
          this.todos = response.data.data.data;
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
