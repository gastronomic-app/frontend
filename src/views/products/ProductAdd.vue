<template>
  <div>
    <h1 class="text-center">Crear producto</h1>
    <ProductForm />
  </div>
</template>

<script>
import ProductForm from "@/components/forms/ProductForm.vue";

export default {
  name: "ProductAdd",
  components: {
    ProductForm,
  },
};
</script>

<style scoped>
  h1 { color:black; font-family: 'Trocchi', serif; font-size: 45px; font-weight: normal; line-height: 48px; margin: 4; }
</style>
