<template>
  <section>
    <nav class="navbar navbar-expand-lg nav-bar fixed-top static-top navbar-bg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
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
              <a class="nav-link text-light font-weight-bold" href="/geolocationSearch">Busqueda geolocalización</a>
            </li>
            <li class="nav-item mr-3" v-show="ok">
              <a class="nav-link text-light font-weight-bold" href="#">Servicios</a>
            </li>
            <li class="nav-item mr-3">
              <span class="nav-link separator" href="#">|</span>
            </li>

            <li class="nav-item">
              <a
                v-if="update()"
                class="nav-link dropdown-toggle text-white font-orange"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                >Usuario</a
              >
              <div class="dropdown-menu dropdown-menu-right">
                <div class="row-fluid user-infos cyruxx">
                  <div class="span10 offset1">
                    <div class="panel panel-primary">
                      <center>
                        <div class="panel-heading">
                          <h3 class="panel-title">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="28"
                              height="28"
                              fill="currentColor"
                              class="bi bi-person-badge-fill"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm4.5 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5 2.755C12.146 12.825 10.623 12 8 12s-4.146.826-5 1.755V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-.245z"
                              /></svg
                            >Usuario: {{ names }}
                          </h3>
                        </div>
                      </center>
                      <div class="panel-body">
                        <div class="row-fluid">
                          <div class="span3"></div>
                          <div class="span6">
                            <table
                              class="
                                table
                                table-condensed
                                table-responsive
                                table-user-information
                              "
                            >
                              <tbody>
                                <tr>
                                  <td>Rol:</td>
                                  <td>{{ role }}</td>
                                </tr>
                                <tr>
                                  <td>email:</td>
                                  <td>{{ email }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <center class="botones">
                        <span class="float-left">
                          <button
                            class="btn btn-success"
                            type="button"
                            data-toggle="tooltip"
                            @click="redirectEdit()"
                            data-original-title="Editar usuario"
                          >
                            <i class="icon-edit icon-white">Editar usuario</i>
                          </button>
                        </span>
                        <span class="float-right">
                          <button
                            class="btn btn-danger"
                            type="button"
                            data-toggle="tooltip"
                            @click="removeClient()"
                            data-original-title="Darse de baja"
                          >
                            <i class="icon-remove icon-white">Darme de baja</i>
                          </button>
                        </span>
                      </center>
                    </div>
                  </div>
                </div>
                <center>
                  <div class="dropdown-divider"></div>
                  <GoogleLogin
                    class="btn btn-warning"
                    :params="params"
                    :onSuccess="onSuccess"
                    :logoutButton="true"
                    >Cerrar sesión</GoogleLogin
                  >
                </center>
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
export default {
  name: "NavBar",
  components: {
    GoogleLogin,
  },

  data: () => ({
    ok: localStorage.getItem("existUser"),
    names: "",
    role: "",
    email: "",
    id: "",
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
        return true;
      }
      return false;
    },
    onSuccess() {
      this.ok = false;
      localStorage.clear();
      this.$router.push({ name: "catalogSearch" });
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
            },
          })
          // El método mutate devuelve una promesa
          // que puede usarse para agregar más logica
          .then((response) => {
            console.log("Desactivado", response.data.updateClient.client.isActive);
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
</style>
