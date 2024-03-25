import { createRouter, createWebHistory } from "vue-router";
import { useGeneralStore } from "@/stores/GeneralStore.js";

const userLevelAccess = {
  user: 0,
  admin: 1,
};
const routes = [
  // Ruta catch-all para redirigir a la página de inicio
  {
    path: "/:catchAll(.*)",
    redirect: "/home",
  },
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/register",
    name: "Registrar",
    component: () => import("@/views/RegisterView.vue"),
    meta: { requiresAuth: true, allowedLevels: [userLevelAccess.admin] },
  },
  {
    path: "/login",
    name: "Iniciar Sesion",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/entrada-salida",
    name: "Entrada Salida",
    component: () => import("@/views/EntradaSalidaView.vue"),
    meta: {
      requiresAuth: true,
      allowedLevels: [userLevelAccess.admin, userLevelAccess.user],
    },
  },
  {
    path: "/subir-video",
    name: "Subir Videos",
    component: () => import("@/views/UploadVideos.vue"),
    meta: {
      requiresAuth: true,
      allowedLevels: [userLevelAccess.admin],
    },
  },
  {
    path: "/reportes",
    name: "Reportes",
    component: () => import("@/views/ReportsView.vue"),
    meta: {
      requiresAuth: true,
      allowedLevels: [userLevelAccess.admin],
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = useGeneralStore().AUTH;
  const allowedLevels = to.meta.allowedLevels;

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next("/login");
  } else if (
    allowedLevels &&
    !allowedLevels.includes(useGeneralStore().userData.user.id_level)
  ) {
    next("/home");
  } else {
    next();
  }
});

export default router;
