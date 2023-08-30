<script setup>
import { Field, Form } from "vee-validate";
import * as Yup from "yup";
import AppLayout from "../../layouts/AppLayout.vue";
import { useTodoStore } from "../../stores/todo";
import { onMounted, ref, watch } from "vue";

const todoStore = useTodoStore();
const showPagination = ref(false);
const queryString = ref("");
const showModal = ref(false);
const confirmDelete = ref({});
const schema = Yup.object().shape({
  name: Yup.string().required().max(250),
  content: Yup.string().required(),
});

onMounted(async () => {
  await fetchTodoData();
});

const fetchTodoData = async () => {
  await todoStore.fetchData(queryString.value);
  showPagination.value =
    todoStore.totalItems > todoStore.perPage && todoStore.todos.length > 0;
};

watch(queryString, () => {
  fetchTodoData();
});

const handleCreate = (values, { resetForm }) => {
  const { name, content } = values;
  showModal.value = false;
  resetForm();
  return todoStore.create(name, content);
};

const confirm = (todoId) => {
  confirmDelete.value[todoId] = true;
};

const cancel = (todoId) => {
  confirmDelete.value[todoId] = false;
};

const handleDelete = (todoId) => {
  return todoStore.delete(todoId);
};
</script>

<template>
  <AppLayout>
    <div
      v-if="todoStore.isLoading"
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-white opacity-75 flex flex-col items-center justify-center"
    >
      <svg
        aria-hidden="true"
        class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
      <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      <p class="w-1/3 text-center text-white">
        This may take a few seconds, please don't close this page.
      </p>
    </div>

    <section class="px-4 py-4">
      <div class="mb-4">
        <button
          @click="showModal = !showModal"
          type="button"
          class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          <svg
            aria-hidden="true"
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            ></path>
          </svg>
          Create
        </button>
        <div
          class="fixed inset-0 flex items-center justify-center z-50 px-3"
          v-show="showModal"
        >
          <div class="fixed inset-0 bg-black opacity-50"></div>

          <div class="relative w-full max-w-2xl max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                @click="showModal = false"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
              <div class="px-6 py-6 lg:px-8">
                <h3
                  class="mb-4 text-xl font-medium text-gray-900 dark:text-white"
                >
                  New Todo
                </h3>
                <Form
                  @submit="handleCreate"
                  class="space-y-6"
                  :validation-schema="schema"
                  v-slot="{ errors, isSubmitting }"
                >
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Title</label
                    >
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Enter your title"
                      required
                    />
                    <div class="text-red-700">{{ errors.name }}</div>
                  </div>
                  <div>
                    <label
                      for="password"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Content</label
                    >
                    <Field
                      as="textarea"
                      type="text"
                      name="content"
                      id="content"
                      placeholder="Enter your content"
                      rows="7"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                    <div class="text-red-700">{{ errors.content }}</div>
                  </div>
                  <button
                    :disabled="isSubmitting"
                    type="submit"
                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <svg
                      v-show="isSubmitting"
                      aria-hidden="true"
                      role="status"
                      class="inline w-4 h-4 mr-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Create New
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div class="py-4 px-4 bg-white dark:bg-gray-900">
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              v-model="queryString"
              type="text"
              id="table-search"
              class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for items"
            />
          </div>
        </div>
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="p-4">Id</th>
              <th scope="col" class="px-6 py-3">Title</th>
              <th scope="col" class="px-6 py-3">Content</th>
              <th scope="col" class="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(todo, index) in todoStore.todos"
              :key="todo.id"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td class="w-4 p-4">
                <div class="flex items-center">
                  <label>{{ index + 1 }}</label>
                </div>
              </td>
              <td class="px-6 py-4">{{ todo?.name }}</td>
              <td class="px-6 py-4">{{ todo?.content }}</td>
              <td class="px-6 py-4 space-x-4">
                <template v-if="!confirmDelete[todo.id]">
                  <button
                    @click="confirm(todo.id)"
                    class="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="handleDelete(todo.id)"
                    class="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Yes
                  </button>

                  <button
                    @click="cancel(todo.id)"
                    class="font-medium text-yellow-600 dark:text-yellow-500 hover:underline"
                  >
                    Cancel
                  </button>
                </template>
              </td>
            </tr>

            <tr
              v-if="todoStore.todoList.length === 0"
              class="bg-white border-b"
            >
              <td colspan="100%">
                <div class="text-center py-6">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      vector-effect="non-scaling-stroke"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p
                    class="mt-3 text-base font-semibold text-gray-900 text-uppercase"
                  >
                    There's no data available
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <div v-if="showPagination" class="flex flex-col items-center mb-6">
      <span class="text-sm text-gray-700 dark:text-gray-400">
        Showing
        <span class="font-semibold text-gray-900 dark:text-white">{{
          todoStore.from
        }}</span>
        to
        <span class="font-semibold text-gray-900 dark:text-white">{{
          todoStore.to
        }}</span>
        of
        <span class="font-semibold text-gray-900 dark:text-white">{{
          todoStore.totalItems
        }}</span>
        Entries
      </span>
      <div class="inline-flex mt-2 xs:mt-0">
        <button
          @click="todoStore.previousPage"
          class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <svg
            class="w-3.5 h-3.5 mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
          Prev
        </button>
        <button
          @click="todoStore.nextPage"
          class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Next
          <svg
            class="w-3.5 h-3.5 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  </AppLayout>
</template>
