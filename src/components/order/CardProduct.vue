<template>
  <div class="content card">
    <img
      :src="product.images.edges[0].node.url"
      class="card-img-top"
      :alt="'Imagen de ' + product.name"
    />
    <div class="card-body footer_descripcion pb-1">
      <h6 class="card-title">
        <b style="color: #f2ae30">{{ product.name | capitalize }}</b>
      </h6>
      <span class="card-text">Precio: ${{ product.price | capitalize }}</span>
      <br />
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
  background-color: var(--dark-x);
  /*background-color: #0d0d0d;*/
  margin-bottom: 0;
  padding-bottom: 0;
  color: var(--light);
}
</style>
