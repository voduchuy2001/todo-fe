import axios from "axios";
import { defineStore } from "pinia";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    isLoading: false,
  }),
  getters: {
    todoList: (state) => state.todos,
  },
  actions: {
    async fetchData() {
      this.isLoading = true;
      await axios
        .get("http://127.0.0.1:8000/api/todo", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
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
