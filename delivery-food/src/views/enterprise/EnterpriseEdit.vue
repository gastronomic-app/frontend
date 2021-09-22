<template>
  <div>
    <h1 class="text-center">Modificar establecimiento</h1>
    <EnterpriseForm :id="id" />
  </div>
</template>

<script>
import EnterpriseForm from "@/components/forms/EnterpriseForm.vue";

export default {
  name: "EnterpriseEdit",
  components: {
    EnterpriseForm,
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
