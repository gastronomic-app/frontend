<template>
  <div>
    <div v-if="$apollo.loading">
      <LoadingGraphql />
    </div>
    <div v-else-if="error" class="d-flex justify-content-center">
      <ConnectionErrorGraphql />
    </div>
    <div class="row">
      <div
        class="col-xl-4 col-md-6 col-sm-12"
        v-for="enterprise in allEnterprises.edges"
        :key="enterprise.node.id"
      >
        <template v-if="enterprise.node.status">
          <EnterpriseCard :enterprise="enterprise.node" />
          <div class="dropdown">
            <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Administrar Establecimiento
            </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" @click="redirectEnterpriseEdit(enterprise.node.id)">Modificar Informacion basica</a>
            <!--<a class="dropdown-item" @click="removeEnteprise(enterprise.node.id)">Eliminar Establecimiento</a>-->
            <a class="dropdown-item" href="/products-list">Gestionar productos</a>
            <a class="dropdown-item" href="#">Gestionar mensajeros</a>
            <a class="dropdown-item" href="#">Gestionar pedidos</a>
            <a class="dropdown-item" href="#">Obtener informes</a>
          </div>

          </div>
          <hr />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import EnterpriseCard from "@/components/cards/EnterpriseCard.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";

export default {
  name: "EnterpriseList",
  components: {
    EnterpriseCard,
    LoadingGraphql,
    ConnectionErrorGraphql,
  },
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allEnterprises: Object,
      // Variable que recibe el error de la consulta
      error: null,
    };
  },
  methods: {
    redirectExampleAdd() {
      this.$router.push({ name: "ExampleAdd" });
    },
    /**
     * Redirige a la vista de editar empresa
     * pasando el id de la empresa por parametro en la url
     */
    redirectEnterpriseEdit(idEnterprise) {
      console.log("enviar id por url", idEnterprise);

      this.$router.push({
        name: "EnterpriseEdit",
        params: { id: idEnterprise },
      });
    },
    /**
     * Elimina una empresa y actualiza el cache con refetchQueries
     */
    async removeEnteprise(idEnterprise) {
      await this.$apollo.mutate({
        // Establece la consulta a realizar
        mutation: require("@/graphql/enterprise/deleteEnterprise.gql"),
        // Define la variable
        variables: {
          id: idEnterprise,
        },
        // Actualiza el cache de GraphQL para visualizar la eliminación
        // al momento de cargar la vista
        refetchQueries: [
          { query: require("@/graphql/enterprise/allEnterprises.gql") },
        ],
      });
    },
  },
  /**
   * Consulta simple que debe definir el mismo nombre en la sección data
   */
  apollo: {
    allEnterprises: {
      // Consulta
      query: require("@/graphql/enterprise/allEnterprises.gql"),
      // Asigna el error a la variable definida en data
      error(error) {
        this.error = JSON.stringify(error.message);
      },
    },
  },
};
</script>

<style scoped>
.dropdown {
  width: 250%;
}
</style>
