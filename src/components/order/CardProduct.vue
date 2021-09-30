<template>
  <div class="content card">
    <img
      :src="product.images.edges[0].node.url"
      class="card-img-top"
      :alt="'Imagen de ' + product.name"
    />
    <div class="card-body footer_descripcion pb-1">
      <h5 class="card-title">{{ product.name | capitalize }}</h5>
      <span class="card-text">Precio: ${{ product.price | capitalize }}</span>
      <br />
      <!--<span class="card-text">Ingredientes: {{ product.ingredients }}</span>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "CardItem",
  props: {
    /**
     * Objeto establecimiento enviado
     * como prop desde una vista
     */
    product: Object,
    //image: Object,
  },
};
</script>

<style scoped>
.content {
  background-color: var(--dark);
  margin-bottom: 0;
  padding-bottom: 0;
  color: var(--light);
}
</style>
