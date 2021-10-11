<template>
  <div>
    <h1 class="text-center">Editar producto</h1>
    <ProductForm :id="id" />
  </div>
</template>

<script>
import ProductForm from "@/components/forms/ProductForm.vue";

export default {
  name: "ProductEdit",
  components: {
    ProductForm,
  },
  data() {
    return {
      id: String,
    };
  },
  /**
   * Ciclo de vida del componente
   * donde obtiene el parametro id pasado por la url
   */
  created() {
    this.id = this.$route.params.id;    
  },
};
</script>



