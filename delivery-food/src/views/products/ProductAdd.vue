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
