<template>
  <div>
    <div class="mt-3">
    <div v-if="$apollo.loading">
      <LoadingGraphql />
    </div>
    <div v-else-if="error" class="d-flex justify-content-center">
      <ConnectionErrorGraphql />
    </div>
    <!--PAGINACION-->
    <paginate ref="paginator" name="Enterprises" :list="Enterprises" :per="3">
    <div class="row">
      <div
            class="col-xl-4 col-md-6 col-sm-12"
            v-for="(enterprise, id) in paginated('Enterprises')"
            :key="enterprise.id"
            :item="enterprise"
            :id="id"
            :checkbox_use="true"
            v-show="enterprise.node.status"
      >
        <template>
          <EnterpriseCard :enterprise="enterprise.node" :key="enterprise.node.id"/>
          <div class="dropdown" >
            <button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Administrar Establecimiento
            </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <!--Redireccion de componentes-->
            <a class="dropdown-item puntero"  @click= redirectEnterpriseEdit(enterprise.node.id)>Modificar Informacion basica</a>
            <a class="dropdown-item" href="#">Gestionar productos</a>
            <a class="dropdown-item" href="#">Gestionar mensajeros</a>
            <a class="dropdown-item puntero" @click= "redirectPendingOrders(enterprise.node.id, enterprise.node.name)">Gestionar pedidos</a>
            <a class="dropdown-item puntero" @click= redirectEnterpriseReport(enterprise.node.id)>Obtener informes</a>
          </div>
          </div>
        </template>
      </div>
    </div>
    </paginate>
    </div>
    <div class="div-paginate">
      <paginate-links
        for="Enterprises"
        :classes="{ ul: 'pagination' }"
        :show-step-links="true"
      ></paginate-links>
    </div>
    <div class="div-paginate">
      <span v-if="$refs.paginator">
        Viendo {{ $refs.paginator.pageItemsCount }} resultados
      </span>
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
      currentPage: 1,
      page: 1,
      perpage: 3,
      Enterprises: [],
      paginate: ["Enterprises"],
      // Variable que recibe el error de la consulta
      error: null,
    };
  },
  async created() {
    await this.$apollo
      .query({
        // Consulta
        query: require("@/graphql/enterprise/allEnterprises.gql"),
        fetchPolicy: "no-cache",
      })
      .then((response) => {
        this.Enterprises = response.data.allEnterprises.edges;
        this.allEnterprises = response.data.allEnterprises.edges;
        //this.pages = response.data.allEnterprises.edges.length;
      });
  },
  methods: {
    redirectExampleAdd() {
      this.$router.push({ name: "ExampleAdd" });
    },
    redirectEnterpriseReport(idEnterprise){
      console.log("enviar id por url", idEnterprise);

      this.$router.push({
        name: "reportEnterprise",
        params: { id: idEnterprise },
      });
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
     * Redirige a la vista de órdenes pendientes para
     * gestionar los pedidos por despachar.
     */
    redirectPendingOrders(idEnterprise, enterpriseName){
      this.$router.push({
        name: "PendingOrders",
        params: { id: idEnterprise, name: enterpriseName}
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
          {
            query: require("@/graphql/enterprise/allEnterprises.gql") },
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

<style>
.dropdown {
  width: 250%;
}
a.puntero  { Cursor : pointer;}
.pagination {
  height: 36px;
  margin: 18px 0;
  color: #6c58bf;
}

.pagination ul {
  display: inline-block;
  *display: inline;
  /* IE7 inline-block hack */
  *zoom: 1;
  margin-left: 0;
  color: #ffffff;
  margin-bottom: 0;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.pagination li {
  display: inline;
  color: var(--orange);
}

.pagination a {
  float: left;
  padding: 0 14px;
  line-height: 34px;
  color: var(--orange);
  text-decoration: none;
  border: 1px solid #ddd;
  border-left-width: 0;
}

.pagination a:hover,
.pagination .active a {
  background-color: var(--primary-x);
  color: #ffffff;
}

.pagination a:focus {
  background-color: var(--primary-x);
  color: #ffffff;
}

.pagination .active a {
  color: #ffffff;
  cursor: default;
}

.pagination .disabled span,
.pagination .disabled a,
.pagination .disabled a:hover {
  color: #999999;
  background-color: transparent;
  cursor: default;
}

.pagination li:first-child a {
  border-left-width: 1px;
  -webkit-border-radius: 3px 0 0 3px;
  -moz-border-radius: 3px 0 0 3px;
  border-radius: 3px 0 0 3px;
}

.pagination li:last-child a {
  -webkit-border-radius: 0 3px 3px 0;
  -moz-border-radius: 0 3px 3px 0;
  border-radius: 0 3px 3px 0;
}

.pagination-centered {
  text-align: center;
}

.pagination-right {
  text-align: right;
}
.pagination > li > a {
  background-color: white;
  color: var(--orange);
}

.pagination > li > a:focus,
.pagination > li > a:hover,
.pagination > li > span:focus,
.pagination > li > span:hover {
  color: #5a5a5a;
  background-color: #eee;
  border-color: #ddd;
}

.pagination > .active > a {
  color: white;
  background-color: var(--orange) !important;
  border: solid 1px var(--orange) !important;
}

.pagination > .active > a:hover {
  background-color: var(--orange) !important;
  border: solid 1px var(--orange);
  color: var(--dark);
}
</style>
<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.btn-color {
  background-color: var(--dark-x);
  color: whitesmoke;
}

.div-paginate {
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
}

.div-width {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
.padding-label {
  padding-bottom: 2px;
}
.div {
  margin-left: 81%;
}
</style>
