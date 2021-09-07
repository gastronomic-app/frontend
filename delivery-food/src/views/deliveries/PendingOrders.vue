<template>
  <div>
    <br />
    <div class="div-width">
      <h2><b>DOM BURGUER</b></h2>
      <h4>Pedidos por despachar</h4>

      <!--SELECCIONAR TODOS-->
      <div class="d-flex justify-content-end">
        <label class="form-check-label">
          Seleccionar todos
          <input type="checkbox" v-on:click="selectAll()" />
        </label>
      </div>

      <!--ERROR DE CONEXIÓN & LOADING-->
      <div v-if="$apollo.loading">
        <LoadingGraphql />
      </div>
      <div v-else-if="error" class="d-flex justify-content-center">
        <ConnectionErrorGraphql />
      </div>

      <!--PAGINACIÓN-->
      <paginate name="orders" :list="orders" :per="5">
        <template v-for="(order, index) in paginated('orders')">
          <!--LISTADO DE PEDIDOS-->
          <accordion
            :key="order.id"
            :item="order"
            :id="index"
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
          </accordion>
        </template>
      </paginate>

      <div class="div-paginate">
        <paginate-links
          for="orders"
          :classes="{ ul: 'pagination' }"
          :show-step-links="true"
        ></paginate-links>
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
</template>

<script>
import Accordion from "@/components/common/Accordion.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";

export default {
  name: "PendingOrders",
  components: {
    Accordion,
    LoadingGraphql,
    ConnectionErrorGraphql,
  },
  data() {
    return {
      currentPage: 1,
      checked_all: false,
      allOrders: Object, //Todas las ordenes de un establecimiento
      enterprise: Object, //Mensajeros adjuntos a un establecimiento
      error: null,
      orders: [], //Para guardar las órdenes realizadas a un establecimiento transformadas
      paginate: ["orders"],
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
      }
    },

    /*Obtener los mensajeros disponibles*/
    getAvailableCouriers() {
      return this.enterprise.couriers.edges.filter(
        (courier) => courier.node.isAvailable
      );
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
      for (let order of result.edges) {
        let productsOrder = this.transformProducts(order.node.details);
        if (productsOrder.belongs) {
          this.orders.push({
            id: order.node.id,
            status: order.node.status,
            location: order.node.location,
            products: productsOrder.names,
            price: productsOrder.price,
            selected: false,
          });
        }
      }
    },

    /**Transformar el formato de los productos provenientes de la BD */
    transformProducts(details) {
      let detailsOrder = details.edges.filter(
        (detail) => detail.node.product.enterprise.name === "dom burguer"
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
        `<i class='bx bx-error' ></i>`,
        7000,
        "top-right"
      );
    },

    /**Construye el toast para despacho exitoso*/
    toastDispatchSuccessful(id, name, lastname) {
      this.makeNotification(
        "¡Pedido despachado exitosamente!",
        "La orden #" +
          id +
          " ha sido asignada al mensajero " +
          name +
          " " +
          lastname,
        "dark",
        `<i class='bx bx-select-multiple' ></i>`,
        7000,
        "top-right"
      );
    },

    /*Actualizar el estado del mensajero*/
    updateStatusCourier(courierId, status) {
      this.$apollo
        .mutate({
          mutation: require("@/graphql/deliveries/updateCourier.gql"),
          variables: {
            id: courierId,
            isAvailable: status,
          },
          refetchQueries: [
            { query: require("@/graphql/deliveries/couriersEnterprise.gql") },
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

    notificationNewOrder() {
      this.makeNotification(
        "¡Nuevo pedido registrado!",
        "Un nuevo pedido ha sido registrado",
        "dark",
        `<i class='bx bx-bell' ></i>`,
        9000,
        "top-left"
      );
    },

    makeNotification(title, text, color, icon, duration, position) {
      this.$vs.notification({
        icon: icon,
        color: color,
        position: position,
        duration: duration,
        progress: "auto",
        title: title,
        text: text,
      });
    },

    queryOrders() {
      this.$apollo
        .query({
          // Establece la consulta para traer las ordenes
          query: require("@/graphql/deliveries/pendingOrders.gql"),
        })
        .then((response) => {
          // Se transforma la respuesta para ajustarla a lo necesario
          this.transform(response.data.allOrders);
        });
    },
  },

  mounted() {
    this.queryOrders();
  },

  apollo: {
    enterprise: {
      query: require("@/graphql/deliveries/couriersEnterprise.gql"),
      error(error) {
        this.error = JSON.stringify(error.message);
      },
    },
    allOrders: {
      query: require("@/graphql/deliveries/pendingOrders.gql"),
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
