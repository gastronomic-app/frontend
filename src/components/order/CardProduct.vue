<template>
  <div class="content card">
    <img
      :src="
        product.images.edges[0].node.url.substring(0, 5) === 'https'
          ? product.images.edges[0].node.url
          : 'https://res.cloudinary.com/dcbzwrn30/image/upload/v1/' +
            product.images.edges[0].node.url
      "
      class="card-img-top img"
      :alt="'Imagen de ' + product.name"
    />
    <div class="card-body footer_descripcion pb-1">
      <h6 class="card-title name">
        <b style="color: #f2ae30">{{ product.name | capitalize }}</b>
      </h6>
      <span class="card-text">Precio: ${{ product.price | capitalize }}</span>
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
  padding-left: 0px;
  color: var(--light);
}
img {
  height: 100%;
  width: 100%;
}
.name {
  height: 4rem;
}
@media only screen and (max-width: 768px) {
  .img {
    height: 100%;
    width: 100%;
  }
}
@media only screen and (max-width: 1200px) {
  .img {
    height: 200px;
    object-fit: cover;
  }
}
@media only screen and (min-width: 1200px) {
  img {
    height: 200px;
    width: 186px;
    object-fit: cover;
  }
}
</style>
