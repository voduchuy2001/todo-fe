import axios from "axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    isLoading: false,
    currentPage: 1,
    perPage: 0,
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
    async fetchData(query) {
      this.isLoading = true;
      const params = {
        page: this.currentPage,
      };

      if (query) {
        params.query = query;
      }

      await axios
        .get("http://127.0.0.1:8000/api/todo", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: params,
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
    async create(name, content) {
      await axios
        .post(
          "http://127.0.0.1:8000/api/todo",
          {
            name: name,
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          const newTodo = response.data.data;
          this.todos = [newTodo, ...this.todos];
          toast.success("Create success");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async delete(id) {
      await axios
        .delete(`http://127.0.0.1:8000/api/todo/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.todos = this.todos.filter((todo) => todo.id !== id);
          toast.success("Delete success");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
