<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">
        <img
          class="logo"
          alt="logo"
          src="@/assets/logo.png"
          width="80"
          height="40"
        />
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
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">
              <router-link to="/">Establecimientos</router-link>
              <span class="sr-only">(current)</span>
            </a>
          </li>
        </ul>
        <span class="navbar-text">
          <a class="nav-link" href="#">
            <router-link to="/example-list">CRUD</router-link>
          </a>
        </span>
        <span class="navbar-text">
          <a
            class="nav-link"
            href="https://getbootstrap.com/docs/4.6/getting-started/introduction/"
            target="_blank"
          >
            Docs Bootstrap
          </a>
        </span>
        <span class="navbar-text">
          <a class="nav-link" href="#">
            <router-link to="/docs-vue">Docs Vue</router-link>
          </a>
        </span>
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
a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}
</style>
