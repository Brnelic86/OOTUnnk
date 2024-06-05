const routes = [
  {
    path: "/login",
    component: () => import("pages/PrijavaPage.vue")
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", redirect: "/login" },
      { path: "kviz", component: () => import("pages/KvizPage.vue") },
      { path: "kviz1", component: () => import("pages/KvizPage1.vue") },
      { path: "kviz2", component: () => import("pages/KvizPage2.vue") },
      { path: "kviz3", component: () => import("pages/KvizPage3.vue") },
      { path: "kviz4", component: () => import("pages/KvizPage4.vue") },
      { path: "kviz5", component: () => import("pages/KvizPage5.vue") },
      { path: "erasmus", component: () => import("pages/Erasmus.vue") },
      { path: "usavrsavanje", component: () => import("pages/StrucnoUsavrsavanje.vue") },
      { path: "radovi", component: () => import("pages/Radovi.vue") },
      { path: "vrsteMobilnosti", component: () => import("src/pages/IndexPage.vue") },
      { path: "profesoriPage", component: () => import("pages/Profesori.vue") }
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
