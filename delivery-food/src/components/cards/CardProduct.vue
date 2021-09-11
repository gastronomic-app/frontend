<template>
  <div class="card">
    <img
      src="@/assets/enterprise.jpg"
      class="card-img-top"
      alt="logo establecimiento"
    />
    <div class="card-body footer_descripcion">
      <h5 class="card-title">{{ product.name | capitalize }}</h5>
      <small class="text-muted">{{ product.preparation }}</small>
      <p class="card-text">{{ product.price | capitalize }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardItem",
  data() {
    return {
      contador: 0,
    };
  },
  props: {
    /**
     * Objeto establecimiento enviado
     * como prop desde una vista
     */
    product: Object,
  },
};
</script>
