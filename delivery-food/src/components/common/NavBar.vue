<template>
  <div>
    <nav class="navbar navbar-expand-lg nav-bar fixed-top static-top navbar-bg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img class="logo" src="@/assets/logo.png" alt="" />
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <b-icon icon="three-dots-vertical"></b-icon>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
          
            <li class="nav-item mr-3">
              <a class="nav-link font-gray" href="#"
                >Inicio
                <span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item mr-3">
              <a class="nav-link font-gray" href="#">Nosotros</a>
            </li>
            <li class="nav-item mr-3">
              <a class="nav-link font-gray" href="#">Servicios</a>
            </li>
            <li class="nav-item mr-3">
              <span class="nav-link separator" href="#">|</span>
            </li>

            <li class="nav-item">
              <a class="nav-link navbar-orange-text font-weight-bold login" href="#"
                ><strong>Iniciar Sesión</strong></a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link text-light font-weight-bold" href="#"
                ><strong>Registrarse</strong></a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
   
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
a { color: var(--grey); }

a:hover {
    color: var(--grey-hover);
    text-decoration: none;
}
a:link,
a:visited,
a:active {
  text-decoration: none;
}
.login:hover{
  color:var(--primary-x);
}

.logo {
  width: 30%;
  height: 80%;
}
.separator{
  color:var(--grey);
}
.navbar-bg{
    background-color: var(--dark-x);
}

.navbar-orange-text{
    color:var(--orange)
}
.navbar{
  min-height: var(--height-navbar);
}

</style>
