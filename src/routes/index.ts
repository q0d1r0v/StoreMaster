import { createRouter, createWebHistory } from "vue-router";

import NotFoundLayout from "../layouts/not-found.vue";
import AuthLayout from "../layouts/auth.vue";
import AdminLayout from "../layouts/admin.vue";

import LoginPage from "../pages/auth/login.vue";
import NotFoundPage from "../pages/404.vue";
import IndexPage from "../pages/index.vue";
import ProductsPage from "../pages/admin/products.vue";
import SellPage from "../pages/admin/sell.vue";

const routes = [
  {
    path: "/",
    component: NotFoundLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/:pathMatch(.*)*",
        component: NotFoundPage,
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        component: LoginPage,
      },
    ],
  },
  {
    path: "/",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "admin",
        component: IndexPage,
        name: "Admin Dashboard",
      },
      {
        path: "/admin/products",
        component: ProductsPage,
        name: "Mahsulotlar",
      },
      {
        path: "/admin/sell",
        component: SellPage,
        name: "Savdo",
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const isAuthRequired = to.meta.requiresAuth;
  const accessToken = localStorage.getItem("access_token");

  if (isAuthRequired && !accessToken) {
    next("/auth/login");
  } else {
    next();
  }
});
