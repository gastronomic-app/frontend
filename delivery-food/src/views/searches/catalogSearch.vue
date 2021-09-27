<template>
  <div>
    <center>
      <nav class="navbar navbar-light bg-light">
        <form class="form-inline" v-on:submit.prevent="findEnterprise()">
          <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="Buscar..."
            aria-label="Search"
            v-model="searchString"
          />
          <button
            class="btn btn-outline-success my-2 my-sm-0 ion-ios-search"
            type="submit"
          >
            Buscar
          </button>
        </form>
      </nav>
    </center>
    <div class="mt-3">
      <div v-if="$apollo.loading">
        <LoadingGraphql />
      </div>
      <div v-else-if="error" class="d-flex justify-content-center">
        <ConnectionErrorGraphql />
      </div>
      <!--PAGINACIÓN-->
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
              <br />
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
  name: "catalogSearch",
  components: {
    EnterpriseCard,
    LoadingGraphql,
    ConnectionErrorGraphql,
  },
  data() {
    return {
      searchString: "",
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allEnterprises: Object,
      allProducts: Object,
      currentPage: 1,
      page: 1,
      perpage: 3,
      Enterprises: [],
      Products: [],
      paginate: ["Enterprises","Products"],
      // Variable que recibe el error de la consulta
      error: null,
    };
  },
  async created() {
    await this.$apollo
      .query({
        // Consulta
        query: require("@/graphql/enterprise/allEnterprises.gql"),
      })
      .then((response) => {
        this.Enterprises = response.data.allEnterprises.edges;
        this.allEnterprises = response.data.allEnterprises.edges;
        //this.pages = response.data.allEnterprises.edges.length;
      });
  },

  methods: {
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },

    findEnterprise() {
      this.$apollo
        .query({
          // Establece la consulta para recuperar la empresa
          query: require("@/graphql/enterprise/findEnterprises.gql"),
          // Define las variables
          variables: {
            name_Icontains: this.searchString,
          },
        })
        // El método query devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          this.Enterprises = response.data.allEnterprises.edges;
          var productsFind = this.allProducts.edges.filter((element) =>
                element.node.name.includes(this.searchString.toLowerCase()));
          for (let index = 0; index < productsFind.length; index++) {
            var id =  productsFind[index].node.enterprise.id;
            var result = 1;
            //result =
            result = (this.Enterprises.find((element) =>
                element.node.id == id ));
            if (result == 1 || result == undefined) {
              var enterprise = this.allEnterprises.find((element) =>
                element.node.id == id);
              this.Enterprises.push(enterprise)
            }
          }
          //this.pages = response.data.allEnterprises.edges.length;
          if (response.data.allEnterprises.edges[0] == null) {
            this.makeToast(
              "danger",
              "Sin coincidencia",
              "No se han encontrado negocios",
              3000
            );
          }
          this.searchString = "";
        });
    },
  },
  apollo: {
    allProducts: {
      // Consulta
      query: require("@/graphql/product/allProducts.gql"),
      // Asigna el error a la variable definida en data
      error(error) {
        this.error = JSON.stringify(error.message);
      },
    },
  },
};
</script>

<style>
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

.pager {
  margin-left: 0;
  margin-bottom: 18px;
  list-style: none;
  text-align: center;
  color: var(--orange);
  *zoom: 1;
}

.pager:before,
.pager:after {
  display: table;
  content: "";
}

.pager:after {
  clear: both;
}

.pager li {
  display: inline;
  color: var(--orange);
}

.pager a {
  display: inline-block;
  padding: 5px 14px;
  color: var(--orange);
  background-color: #fff;
  border: 1px solid #ddd;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;
}

.pager a:hover {
  text-decoration: none;
  background-color: #f5f5f5;
}

.pager .next a {
  float: right;
}

.pager .previous a {
  float: left;
}

.pager .disabled a,
.pager .disabled a:hover {
  color: #999999;
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
