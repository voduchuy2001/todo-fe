import axios from "axios";
import { defineStore } from "pinia";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    isLoading: false,
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    from: 0,
    to: 0,
  }),
  getters: {
    todoList: (state) => state.todos,
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
  },
  actions: {
    async fetchData() {
      this.isLoading = true;
      await axios
        .get("http://127.0.0.1:8000/api/todo", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            page: this.currentPage,
            per_page: this.perPage,
          },
        })
        .then((response) => {
          this.todos = response.data.data.data;
          this.currentPage = response.data.data.current_page;
          this.perPage = response.data.data.per_page;
          this.totalItems = response.data.data.total;
          this.from = response.data.data.from;
          this.to = response.data.data.to;
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchData();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchData();
      }
    },
  },
});
