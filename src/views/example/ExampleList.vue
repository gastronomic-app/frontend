<template>
  <div>
    <h1 class="text-center">Lista de establecimientos</h1>
    <br />
    <button
      type="button"
      class="btn btn-primary btn-lg btn-block"
      @click="redirectExampleAdd"
    >
      Crear establecimiento
    </button>
    <br />
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
          <ExampleCard :enterprise="enterprise.node" />
          <br />
          <button
            type="button"
            class="btn btn-success btn-sm mr-4"
            @click="redirectExampleEdit(enterprise.node.id)"
          >
            Editar
          </button>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="removeEnteprise(enterprise.node.id)"
          >
            Eliminar
          </button>
          <hr />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ExampleCard from "@/components/cards/ExampleCard.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";

export default {
  name: "ExampleList",
  components: {
    ExampleCard,
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
    redirectExampleEdit(idEnterprise) {
      console.log("enviar id por url", idEnterprise);

      this.$router.push({
        name: "ExampleEdit",
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
