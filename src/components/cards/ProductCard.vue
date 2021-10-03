<template>
  <div class="card bg-cart color-black">
    <img
      :src="image.url"
      class="card-img-top img-fluid"
      :alt="'Imagen de ' + product.name"
      style="width: 18rem; height: 18rem"
    />

    <div class="card-body container-md">
      <h5 class="card-title orange font-weight-bold">
        {{ product.name | capitalize }}
      </h5>
      <p class="card-text">Precio: ${{ product.price | capitalize }}</p>
      <p class="card-text">Ingredientes: {{ product.ingredients }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: Object,
    image: Object,
  },
};
</script>

<style scoped>
.name-app {
  color: var(--primary-x);
}
.bg-cart {
  background-color: var(--dark-x);
}
.navbar-orange-text {
  color: var(--orange);
}
.color-black {
  color: white;
}
.orange {
  color: orange;
}
</style>
