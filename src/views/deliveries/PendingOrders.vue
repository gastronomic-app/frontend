<template>
  <div>
    <br />

    <div class="div-width">
      <h2>
        <b>{{ enterpriseName }}</b>
      </h2>
      <h4>Pedidos por despachar</h4>

      <!--ERROR DE CONEXIÓN & LOADING-->
      <div v-if="$apollo.loading">
        <LoadingGraphql />
      </div>
      <div v-else-if="error" class="d-flex justify-content-center">
        <ConnectionErrorGraphql />
      </div>

      <!--NO HAY PEDIDOS-->
      <div v-if="!existsOrders">
        <h4>Tus clientes aún no realizan pedidos <b></b></h4>
        <not-found></not-found>
      </div>

      <div v-if="existsOrders">
        <!--SELECCIONAR TODOS-->
        <div class="d-flex justify-content-end">
          <label class="form-check-label">
            Seleccionar todos
            <input type="checkbox" v-on:click="selectAll()" />
          </label>
        </div>

        <div class="accordion" id="accordion">
          <!--PAGINACIÓN-->
          <paginate ref="paginator" name="orders" :list="orders" :per="5">
            <template v-for="order in paginated('orders')">
              <!--LISTADO DE PEDIDOS-->
              <collapsible-card
                :key="order.id"
                :item="order"
                :id="order.idx"
                :checkbox_use="true"
                v-if="order.status"
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

        <!--BOTON DESPACHAR PEDIDOS-->
        <span class="d-flex justify-content-end">
          <button type="button" class="btn btn-color" v-on:click="dispatch()">
            Despachar Pedidos
          </button>
        </span>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import CollapsibleCard from "@/components/common/CollapsibleCard.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";

export default {
  name: "PendingOrders",
  components: {
    CollapsibleCard,
    LoadingGraphql,
    ConnectionErrorGraphql,
  },
  data() {
    return {
      enterpriseId: String,
      enterpriseName: String,
      checked_all: false,
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
    /*Despachar los pedidos seleccionados*/
    dispatch() {
      let selectedOrders = this.orders.filter((order) => order.selected);
      selectedOrders.forEach((order) => {
        this.asignCourier(order.id);
      });
    },

    /*Asignar un mensajero disponible a la orden y cambiar estado del pedido*/
    asignCourier(orderId) {
      let availableCouriers = this.getAvailableCouriers();
      if (availableCouriers.length === 0) {
        this.toastDispatchFailed();
      } else {
        let courier = availableCouriers[0].node;
        this.updateStatusCourier(courier.id, false);
        this.updateStatusOrder(orderId, "despachado");
        this.toastDispatchSuccessful(
          orderId,
          courier.contact.edges[0].node.names,
          courier.contact.edges[0].node.lastnames
        );
        //this.emitNotificationCostumer(orderId, courier);
      }
    },

    /*Obtener los mensajeros disponibles*/
    getAvailableCouriers() {
      this.queryCouriers();
      return this.couriers.filter((courier) => courier.node.isAvailable);
    },

    /*Seleccionar todos */
    selectAll() {
      this.checkedAll = !this.checkedAll;
      this.orders.forEach((order) => {
        if (order.status) order.selected = this.checkedAll;
      });
    },

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
            selected: false,
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

    /**Construye el toast para error de despacho*/
    toastDispatchFailed() {
      this.makeNotification(
        "¡No se pudo despachar el pedido!",
        "Lo sentimos, no hay mensajeros disponibles para despachar la orden :c",
        "danger",
        null,
        7000,
        "top-right"
      );
    },

    /**Construye el toast para despacho exitoso*/
    toastDispatchSuccessful(id, name, lastname) {
      let text = `La orden #${id} ha sido asignada al mensajero ${name} ${lastname}`;
      this.makeNotification(
        "¡El pedido ha sido despachado!",
        text,
        "#222222",
        null,
        7000,
        "top-right"
      );
    },

    /*Actualizar el estado del mensajero*/
    updateStatusCourier(courierId, status) {
      let idx = this.couriers.findIndex(
        (courier) => courier.node.id === courierId
      );
      this.couriers[idx].node.isAvailable = status;
      this.$apollo
        .mutate({
          mutation: require("@/graphql/deliveries/updateCourier.gql"),
          variables: {
            id: courierId,
            isAvailable: status,
          },
          refetchQueries: [
            {
              query: require("@/graphql/deliveries/couriersEnterprise.gql"),
              variables: {
                id: this.enterpriseId,
              },
            },
          ],
        })
        .then((response) => {
          console.log("actualización de courier:", response.data);
        });
    },

    /*Actualizar el estado de la orden*/
    updateStatusOrder(orderId, orderStatus) {
      this.$apollo
        .mutate({
          mutation: require("@/graphql/deliveries/updateOrder.gql"),
          variables: {
            id: orderId,
            status: orderStatus,
          },
          refetchQueries: [
            { query: require("@/graphql/deliveries/pendingOrders.gql") },
          ],
        })
        .then((response) => {
          console.log("actualización de order:", response.data);
        });

      let idx = this.orders.findIndex((order) => order.id === orderId);
      this.orders.splice(idx, 1);
    },

    /**Notification with vuesax */
    makeNotification(titleN, textN, colorN, iconN, durationN, positionN) {
      this.$vs.notification({
        icon: iconN,
        color: colorN,
        position: positionN,
        duration: durationN,
        progress: "auto",
        title: titleN,
        text: textN,
      });
    },

    queryOrders() {
      this.$apollo
        .query({
          // Establece la consulta para traer las ordenes
          query: require("@/graphql/deliveries/pendingOrders.gql"),
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          // Se transforma la respuesta para ajustarla a lo necesario
          this.existsOrders = this.transform(response.data.allOrders);
        });
    },

    queryCouriers() {
      this.$apollo
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
    this.enterpriseId = this.$route.params.id;
    this.enterpriseName = this.$route.params.name;
    console.log("obtener id por url:", this.enterpriseId);
  },

  apollo: {
    /*enterprise: {
      query: require("@/graphql/deliveries/couriersEnterprise.gql"),
      variables: {
        id: this.enterpriseId
      },
      error(error) {
        this.error = JSON.stringify(error.message);
      },
    },
    allOrders: {
      query: require("@/graphql/deliveries/pendingOrders.gql"),
      error(error) {
        this.error = JSON.stringify(error.message);
      },
    },*/
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
</style>
