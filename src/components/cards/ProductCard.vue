<template>
  <div class="card">
    <img
      :src="image.url"
      class="card-img-top img-fluid"
      :alt="'Imagen de ' + product.name"
      style="width: 18rem; height: 18rem"
    />

    <div class="card-body">
      <h5 class="card-title">{{ product.name | capitalize }}</h5>
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
