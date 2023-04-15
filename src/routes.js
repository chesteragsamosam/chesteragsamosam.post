import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: async () => await import('./Pages/Home.vue') },
  { path: '/posts', component: async () => await import('./Pages/Posts.vue') },
]

export const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})
