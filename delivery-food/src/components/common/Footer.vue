<template>
  <footer class="bg-dark-x py-5 border-top">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <p class="mb-0">
            <a href="#" class="text-primary font-weight-bold">Delivery Food</a>.
            <small>Derechos reservados 2021</small>
          </p>
          <div>
              <a
                class="nav-link"
                href="https://getbootstrap.com/docs/4.6/getting-started/introduction/"
                target="_blank"
              >
                Docs Bootstrap
              </a>
              <a class="nav-link" href="#">
                <router-link to="/docs-vue">Docs Vue</router-link>
              </a>
            </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>
