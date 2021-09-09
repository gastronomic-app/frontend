<template>
  <footer class="bg-dark-x py-5 border-top bg-footer footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <p class="mb-0">
            <a href="#" class="font-weight-bold name-app">Delivery Food</a>.
            <small class="font-white">Derechos reservados 2021</small>
          </p>
        </div>
        <div class="col-lg-6 text-right font-white">
          <ul class="list-inline mb-0">
            <li class="list-inline-item mr-3"><small>Síguenos en:</small></li>
            <li class="list-inline-item mr-3">
              <i class="icon ion-logo-instagram lead"></i>
            </li>
            <li class="list-inline-item mr-3">
              <i class="icon ion-logo-linkedin lead"></i>
            </li>
            <li class="list-inline-item">
              <i class="icon ion-logo-facebook lead"></i>
            </li>
          </ul>
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
<style scoped>
.name-app{
  color:var(--primary-x)
}
.bg-footer {
  background-color: var(--dark-xx);
}
.footer{ 
  max-height: var(--height-footer);

}
</style>
