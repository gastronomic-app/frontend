<template>
  <div>
    <nav
      class="navbar navbar-expand-lg nav-bar fixed-top static-top navbar-bg"
    >
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img class="logo" src="@/assets/logo.png" alt="" />
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"> </span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
              <a href="" class="nav-link">
                <router-link class="navbar-primary-text" to="/"
                  >Establecimientos</router-link
                >
              </a>
            </li>
            <li class="nav-item active">
              <a href="" class="nav-link">
                <router-link class="navbar-primary-text" to="/example-list"
                  >CRUD</router-link
                >
              </a>
            </li>

            <li class="nav-item active">
              <a class="nav-link font-gray" href="#"
                >Inicio
                <span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link font-gray" href="#">Nosotros</a>
            </li>
            <li class="nav-item">
              <a class="nav-link font-gray" href="#">Servicios</a>
            </li>
            <li class="nav-item active">
              <a href="" class="nav-link font-white"> </a>
              <i class="vertical-line justify-content-center"></i>
            </li>

            <li class="nav-item">
              <a class="nav-link navbar-primary-text" href="#"><strong>Iniciar Sesión</strong></a>
            </li>
            <li class="nav-item">
              <a class="nav-link font-white" href="#"><strong>Registrarse</strong></a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
/**
 * Barra de navegación común
 */
export default {
  name: "NavBar",
};
</script>

<style scoped>
a:link,
a:visited,
a:active {
  text-decoration: none;
}

.logo {
  width: 30%;
  height: 80%;
}

.font-white {
  color: rgb(209, 203, 203) !important;
}
.font-gray {
  color: rgba(153, 151, 151, 0.836) !important;
}
.font-orange:hover {
  text-decoration: none;
}
.vertical-line {
  bottom: 20px;
  margin-left: 0.5em;
  padding-bottom: 10px;
  position: absolute;
  z-index: 10;
  width: 2px;
  height: 2em;
  border-left: thick-solid;
  background: grey;
}
</style>
