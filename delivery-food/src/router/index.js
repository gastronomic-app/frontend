import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/user/Login.vue"),
  },
  {
    path: "/docs-vue",
    name: "Documentation",
    component: () => import("@/views/docs/Documentation.vue"),
  },
  {
    path: "/example-list",
    name: "ExampleList",
    component: () => import("@/views/example/ExampleList.vue"),
  },
  {
    path: "/example-add",
    name: "ExampleAdd",
    component: () => import("@/views/example/ExampleAdd.vue"),
  },
  {
    path: "/example-edit/:id",
    name: "ExampleEdit",
    component: () => import("@/views/example/ExampleEdit.vue"),
  },
  {
    path: "/edit/:id",
    name: "Edit",
    component: () => import("@/views/user/Edit.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/user/Register.vue"),
  },
  {
    path: "/geolocation",
    name: "Geolocation",
    component: () => import("@/components/geolocation/Geolocation.vue"),
  },
  {
    path: "/orders",
    name: "OrdersPlaced",
    component: () => import("@/views/deliveries/OrdersPlaced.vue"),
  },
  {
    path: "/pending-orders",
    name: "PendingOrders",
    component: () => import("@/views/deliveries/PendingOrders.vue"),
  },
  {
    path: "/report",
    name: "Report",
    component: () => import("@/views/deliveries/Report.vue"),
  },
  {
    path: "/countdown",
    name: "Countdown",
    component: () => import("@/views/deliveries/Countdown.vue"),
  },
  {
    path: "/password",
    name: "Password",
    component: () => import("@/views/user/Password.vue"),
  },
  {
    path: "/password/reset/:id",
    name: "Reset",
    component: () => import("@/views/user/Reset.vue")
  },
  {
    path: "/RegisterPassword",
    name: "RegisterPassword",
    component: () => import("@/views/user/RegisterPassword.vue"),
  },
  {
    path: "/products-list",
    name: "ProductsList",
    component: () => import("@/views/products/ProductList.vue"),
  },
  {
    path: "/product-add",
    name: "ProductAdd",
    component: () => import("@/views/products/ProductAdd.vue"),
  },
  {
    path: "/product-edit/:id",
    name: "ProductEdit",
    component: () => import("@/views/products/ProductEdit.vue"),
  },
  {
    path: "/products-order",
    name: "ProductListOrder",
    component: () => import("@/views/shopping-car/ProductListOrder.vue"),
  },
  {
    path: "/order-confirmation",
    name: "OrderConfirmation",
    component: () => import("@/views/shopping-car/OrderConfirmation.vue"),
  },
  {
    path: "/comments-list",
    name: "CommentsList",
    component: () => import("@/views/ratings-comments/CommentsList.vue"),
  },
  {
    path: "/add-Rating",
    name: "AddRating",
    component: () =>
        import("@/views/ratings-comments/AddRating.vue"),
},
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
