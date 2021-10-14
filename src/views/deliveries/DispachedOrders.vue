<template>
  <div>
    <br />
    <div class="jumbotron">
      <div class="div-width">
        <h2>
          <b>{{ enterpriseName }}</b>
        </h2>
        <h4>Pedidos Despachados</h4>

        <!--ERROR DE CONEXIÓN & LOADING-->
        <div v-if="$apollo.loading">
          <LoadingGraphql />
        </div>
        <div v-else-if="error" class="d-flex justify-content-center">
          <ConnectionErrorGraphql />
        </div>

        <!--NO HAY PEDIDOS-->
        <div v-if="!existsOrders">
          <br />
          <h5><b>No tienes pedidos por despachar :c</b></h5>
          <not-found></not-found>
        </div>

        <div v-if="existsOrders">
          <!--SELECCIONAR TODOS-->
          <div class="accordion" id="accordion">
            <!--PAGINACIÓN-->
            <paginate ref="paginator" name="orders" :list="orders" :per="5">
              <template v-for="order in paginated('orders')">
                <!--LISTADO DE PEDIDOS-->
                <collapsible-card
                  :key="order.id"
                  :item="order"
                  :id="order.idx"
                  v-if="order.status"
                  header="Pedido despachado #"
                >
                  <div class="card-body">
                    <h5><b>Resumen del pedido</b></h5>
                    <p></p>
                    <h6><b>Productos: </b>{{ order.products }}</h6>
                    <h6><b>Precio total: </b> ${{ order.price }}</h6>
                    <h6><b>Lugar de entrega: </b>{{ order.location }}</h6>
                  </div>
                </collapsible-card>
              </template>
            </paginate>
          </div>
          <div class="div-paginate">
            <paginate-links
              for="orders"
              :classes="{ ul: 'pagination' }"
              :show-step-links="true"
            ></paginate-links>
          </div>

          <div class="div-paginate">
            <span v-if="$refs.paginator">
              Viendo {{ $refs.paginator.pageItemsCount }} resultados
            </span>
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CollapsibleCard from "@/components/common/CollapsibleCard.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";
import NotFound from "@/components/common/NotFound.vue";

export default {
  name: "DispachedOrders",
  components: {
    CollapsibleCard,
    LoadingGraphql,
    ConnectionErrorGraphql,
    NotFound,
  },
  data() {
    return {
      enterpriseId: String,
      enterpriseName: String,
      allOrders: Object, //Todas las ordenes de un establecimiento
      enterprise: Object, //Mensajeros adjuntos a un establecimiento
      couriers: [],
      error: null,
      orders: [], //Para guardar las órdenes realizadas a un establecimiento transformadas
      paginate: ["orders"],
      existsOrders: true,
    };
  },

  methods: {  
    /**Transformar el formato las órdenes que vienen de la base de datos */
    transform(result) {
      let count = 0;
      for (let order of result.edges) {
        let productsOrder = this.transformProducts(order.node.details);
        if (productsOrder.belongs) {
          this.orders.push({
            idx: count,
            id: order.node.id,
            status: order.node.status,
            location: order.node.location,
            products: productsOrder.names,
            price: productsOrder.price,
            delivery: "4000",
            email: order.node.client.email,
            client:{names:""},
            courier:{},
            date: order.node.date,
          });
          count++;
        }
      }
      return this.orders.length > 0;
    },

    /**Transformar el formato de los productos provenientes de la BD */
    transformProducts(details) {
      let detailsOrder = details.edges.filter(
        (detail) => detail.node.product.enterprise.id === this.enterpriseId
      );
      let prodNames = "",
        prodTotal = 0,
        belong = false;

      if (detailsOrder.length > 0) {
        belong = true;
        detailsOrder.forEach((detail) => {
          prodNames +=
            detail.node.quantity + " " + detail.node.product.name + ", ";
          prodTotal += detail.node.quantity * detail.node.product.price;
        });
      }
      return {
        belongs: belong,
        names: prodNames.substring(0, prodNames.length - 2),
        price: prodTotal,
      };
    },

   
    async getUserId(order) {
      let id = "";
      await this.$apollo
        .query({
          query: require("@/graphql/user/userByEmail.gql"),
          variables: {
            email: order.userEmail,
          },
        })
        .then((response) => {
          id = response.data.allUsers.edges[0].node.id;
          order.client.names=response.data.allUsers.edges.node.names + " "+ response.data.allUsers.edges.node.lastnames
          
        });
      return id;
    },

    

    queryOrders() {
      this.$apollo
        .query({
          // Establece la consulta para traer las ordenes
          query: require("@/graphql/deliveries/canceledOrders.gql"),
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          // Se transforma la respuesta para ajustarla a lo necesario
          this.existsOrders = this.transform(response.data.allOrders);
        });
    },

    async queryCouriers() {
      await this.$apollo
        .query({
          query: require("@/graphql/deliveries/couriersEnterprise.gql"),
          variables: {
            id: this.enterpriseId,
          },
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          this.couriers = response.data.enterprise.couriers.edges;
        });
    },
  },

  mounted() {
    this.queryCouriers();
    this.queryOrders();
  },

  created() {
    let entId = localStorage.getItem("entID");
    if (entId === "") {
      this.enterpriseId = this.$route.params.id;
      this.enterpriseName = this.$route.params.name;
    } else {
      this.enterpriseId = localStorage.getItem("entID");
      this.enterpriseName = localStorage.getItem("entName");
    }
  },
};
</script>

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
.jumbotron {
  background-color: whitesmoke;
  box-shadow: 1em 1em 4em 1em rgba(13, 13, 13, 0.2);
  border-radius: 1em;
}

</style>
