<template>
  <div>
    <br />
    <div class="div-width">
      <h3><b>Pedidos por despachar</b></h3>
      <h5>Vista del administrador</h5>

      <div class="d-flex justify-content-end">
        <label class="form-check-label">
          Seleccionar todos
          <input type="checkbox" v-on:click="selectAll()" />
        </label>
      </div>

      <div v-if="$apollo.loading">
        <LoadingGraphql />
      </div>
      <div v-else-if="error" class="d-flex justify-content-center">
        <ConnectionErrorGraphql />
      </div>

      <template v-for="(order, index) in orders">
        <accordion
          :key="order.id"
          :item="order"
          :id="index"
          :checkbox_use="true"
          v-if="order.status"
        >
          <div class="card-body">
            <strong>Detalles del pedido</strong><br />
            Productos: {{order.products[0].node.name}} <br /> <!--TODO:Iterar, Mejorar-->
            Total: {{order.price}} <br />
            Ubicación: {{order.location}} <br />
          </div>
        </accordion>
      </template>

      <br />

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
  props: ["selected"],
  components: {
    Accordion,
    LoadingGraphql,
    ConnectionErrorGraphql,
  },
  data() {
    return {
      checked_all: false,
      allOrders: Object, //Todos los pedidos de un establecimiento
      enterprise: Object, //Mensajeros adjuntos a un establecimiento
      error: null,
      orders: [],
      couriers: [
        {
          name: "Martin Santome",
          status: true,
        },
        {
          name: "Edward Elric",
          status: true,
        },
        {
          name: "Ernest Hemingway",
          status: true,
        },
      ],
    };
  },
  methods: {
    dispatch() {
      for (let index in this.orders) {
        if (this.orders[index].selected) {
          this.asignCourier(index);
          this.orders[index].selected = false;
        }
      }
    },
    asignCourier(index) {
      if (this.availableCouriers() == 0) {
        alert("Lo sentimos no hay mensajeros disponibles en el momento");
      } else {
        for (let i in this.couriers) {
          if (this.couriers[i].status) {
            this.orders[index].status = false; //Despachado
            this.couriers[i].status = false; //No disponible
            console.log("Pedido asignado al mensajero: " + this.couries[i]);
            break;
          }
        }
        //TODO: Do it with the data got from the database
        /*for (let i = 0; i < this.enterprise.couriers.edges.length; i++) {
          if (this.enterprise.couriers.edges[i].node.status) { //TODO
            order[index].status = false; //Despachado
            courier.status = false; //No disponible
            console.log(
              "Pedido asignado al mensajero: " + courier.names + " " + courier.lastsnames
            );
            break;
          }
        }*/
      }
    },
    availableCouriers() {
      return this.couriers.filter((courier) => courier.status).length;
    },
    selectAll() {
      this.checkedAll = !this.checkedAll;
      this.orders.forEach((order) => {
        if (order.status) order.selected = this.checkedAll;
      });
    },
    transform(result) {
      for (let order of result.edges) {
        let productsOrder = order.node.products.edges.filter(
          (product) => product.node.enterprise.id == "RW50ZXJwcmlzZU5vZGU6Mw=="
        );
        if (productsOrder.length > 0) {
          this.orders.push({
            status: order.node.status,
            location: order.node.location,
            products: productsOrder,
            price: 0,
            selected: false,
          });
        }
      }
      console.log("orders:", this.orders);
    },
  },
  mounted() {
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
  apollo: {
    enterprise: {
      query: require("@/graphql/deliveries/couriersEnterprise.gql"),
      error(error) {
        this.error = JSON.stringify(error.message);
      },
    },
  },
};
</script>

<style scoped>
.btn-color {
  background-color: black;
  color: whitesmoke;
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
