<template>
  <div>
    <h1 class="text-center">Editar establecimiento</h1>
    <ExampleForm :id="id" />
  </div>
</template>

<script>
import ExampleForm from "@/components/forms/ExampleForm.vue";

export default {
  name: "ExampleEdit",
  components: {
    ExampleForm,
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
    console.log("obtener id por url:", this.id);
  },
};
</script>
