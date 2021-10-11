<template>
  <section>
    <nav class="navbar navbar-expand-lg nav-bar fixed-top static-top navbar-bg">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img class="logo" src="@/assets/logo.png" alt="" />
        </a>

        <button
          class="navbar-toggler custom-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item mr-3">
              <a class="nav-link text-light font-weight-bold" href="/"
                >Busqueda Catalogo
                <span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item mr-3" v-show="ok">
              <a
                class="nav-link text-light font-weight-bold"
                href="/geolocation-search"
                >Busqueda geolocalización</a
              >
            </li>
            <Count></Count>
            <!-- <Notification /> -->
            <li class="nav-item mr-3">
              <span class="nav-link separator">|</span>
            </li>

            <li class="nav-item">

              <a
                v-if="update()"
                class="nav-link text-white font-orange "
                data-toggle="dropdown"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
                ><img class="img-avatar" src="https://cdn-icons-png.flaticon.com/512/149/149071.png"/></a
              >
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item " style="color: var(--light)" >Usuario: {{names}}</a>
                  <a class="dropdown-item " style="color: var(--light)" >Rol: {{role}}</a>
                  <a class="dropdown-item " style="color: var(--light)" >Email: {{email}}</a>
                  <a class="dropdown-item btn" style="color: var(--light)" v-if="role=='CLIENT'" href="/orders">Mis pedidos</a>
                  <a class="dropdown-item btn" style="color: var(--light)" v-if="role!='MANAGER'" @click="redirectEdit()">Editar usuario</a>
                  <a class="dropdown-item btn" style="color: var(--light)" v-if="role=='CLIENT'" @click="removeClient()">Darme de baja</a>
                  <a class="dropdown-item log-out">
                   <GoogleLogin
                    class="btn"
                    style="color: var(--light)"
                    :params="params"
                    :onSuccess="onSuccess"
                    :logoutButton="true"
                    >Cerrar sesión</GoogleLogin
                  >
                  </a>
                </div>
            </li>
            <li v-show="!ok" class="nav-item">
              <a
                class="nav-link navbar-orange-text font-weight-bold login"
                href="/login"
                ><strong>Iniciar Sesión</strong></a
              >
            </li>
            <li v-show="!ok" class="nav-item">
              <a class="nav-link text-light font-weight-bold" href="/Register"
                ><strong>Registrarse</strong></a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <section class="container container-general">
      <router-view />
    </section>
  </section>
</template>
<script>
/**
 * Barra de navegación común
 */
import GoogleLogin from "vue-google-login";
import Count from "@/views/shopping-car/Count.vue";
// import Notification from "@/views/deliveries/Notification.vue";

export default {
  name: "NavBar",
  components: {
    GoogleLogin,
    Count,
    // Notification,
  },

  data: () => ({
    ok: localStorage.getItem("existUser"),
    names: "",
    role: "",
    email: "",
    id: "",
    count: 0,
    params: {},
    // only needed if you want to render the button with the google ui
  }),
  methods: {
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },
    redirectEdit() {
      this.$router.push({
        name: "Edit",
        params: { id: this.id },
      });
    },
    update() {
      this.ok = localStorage.getItem("existUser");
      if (this.ok) {
        let user = JSON.parse(localStorage.getItem("user"));
        this.id = user.id;
        this.email = user.email;
        this.names = user.names;
        this.role = user.type;
        this.$store.dispatch(
          "setStorageCountAction",
          this.$store.getters.getCount
        );
        return true;
      }
      return false;
    },
    client() {
      this.ok = localStorage.getItem("existUser");
      if (this.ok) {
        let user = JSON.parse(localStorage.getItem("user"));
        this.role = user.type;
        if (this.role == "CLIENT") {
          return true;
        }
        return false;
      }
      return false;
    },
    onSuccess() {
      this.ok = false;
      localStorage.clear();
      this.$router.push({ name: "catalogSearch" });
      this.$store.dispatch("setStorageCountAction", 0);
      localStorage.removeItem("idEnterprise");
      localStorage.getItem("enterpriseName");
    },
    removeClient() {
      if (confirm("¿Seguro que desea darse de baja?", false)) {
        this.$apollo
          .mutate({
            // Establece la mutación de editar
            mutation: require("@/graphql/client/deactivateClient.gql"),
            // Define las variables
            variables: {
              id: this.id,
              is_active: false,
            },
          })
          // El método mutate devuelve una promesa
          // que puede usarse para agregar más logica
          .then((response) => {
            console.log(
              "Desactivado",
              response.data.updateClient.client.isActive
            );
            this.makeToast(
              "danger",
              "Desactivado",
              "Usuario: " + this.names + " ha sido desactivado",
              3000
            );
            this.ok = false;
            localStorage.clear();
            this.$router.push({ name: "catalogSearch" });
          });
      }
    },
  },
};
</script>
<style scoped>
a {
  color: var(--grey);
}

a:hover {
  color: var(--grey-hover);
  text-decoration: none;
}
a:link,
a:visited,
a:active {
  text-decoration: none;
}
.login:hover {
  color: var(--primary-x);
}

.logo {
  width: 30%;
  height: 80%;
}
.separator {
  color: var(--grey);
}
.navbar-bg {
  background-color: var(--dark-x);
}

.navbar-orange-text {
  color: var(--orange);
}
.navbar {
  min-height: var(--height-navbar);
}
.custom-toggler.navbar-toggler {
  border-color: rgb(255, 68, 0, 0.877);
}
.custom-toggler .navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255, 68, 0, 0.877)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
}
.container-general {
  min-height: calc(100vh - var(--height-navbar) - var(--height-footer));
}
.dropdown-menu{
  box-sizing: content-box;
  min-width: 15vw;
  background: var(--dark-x);
  color: var(--orange) !important;
}
.dropdown-menu>.dropdown-item:hover{
  background: var(--orange-x);
}
.log-out{
  display:flex;
  justify-content: center;
}
.img-avatar {
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 14.4px;
}
</style>
