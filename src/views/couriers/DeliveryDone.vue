<template>
  <div class="container" style="margin-top: 1em">
    <div v-if="!isReadyQuery">
      <div v-if="!exitsDeliveries">
        <h4>
          No tienes entregas por realizar.
          <not-found></not-found>
        </h4>
      </div>
      <div v-else>
        <LoadingGraphql />
      </div>
    </div>

    <div v-else>
      <h3><b>Pedidos en proceso de entrega</b></h3>
      <div class="accordion">
      <paginate name="deliveries" :list="deliveries" :per="5">
        <template v-for="(delivery, idx) in paginated('deliveries')">
          <collapsible-card
            :key="delivery.deliveryID"
            :item="delivery"
            :checkbox_use="true"
            :id="idx"
            :reference="delivery.deliveryID"
            header="Entrega #"
          >
            <div class="card-body">
              <h4>Resumen de pedido <br /></h4>
              <div>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Productos</th>
                      <th>Cantidad</th>
                      <th>Valor Unitario</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in delivery.products" :key="product.id">
                      <td>{{ product.name }}</td>
                      <td>{{ product.quantity }}</td>
                      <td>{{ product.cost }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5>
                Establecimiento: <b>{{ delivery.enterprise }}</b>
              </h5>
              <h5>
                Método de pago: <b>{{ delivery.payType }}</b>
              </h5>
              <h5>
                Costo Total: <b>${{ delivery.cost }}</b>
              </h5>
              <h5>
                Estado: <b>${{ delivery.status }}</b>
              </h5>
            </div>
          </collapsible-card>
        </template>
      </paginate>
      </div>
      <div v-if="deliveries.length === 5" class="div-paginate">
        <paginate-links
          for="orders"
          :classes="{ ul: 'pagination' }"
          :show-step-links="true"
        ></paginate-links>
      </div>
      <div
        v-if="deliveries.length > 0"
        class="container d-flex justify-content-end"
      >
        <button type="button" class="btn btn-black" @click="deliver">
          Entregar
        </button>
      </div>
      <div v-else>
        No tienes entregas por realizar.
        <not-found></not-found>
      </div>
      <br />
    </div>
  </div>
</template>
<script>
import CollapsibleCard from "@/components/common/CollapsibleCard.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import NotFound from "@/components/common/NotFound.vue";
export default {
  components: {
    CollapsibleCard,
    LoadingGraphql,
    NotFound,
  },
  name: "DeliveryDone",
  beforeMount() {
    this.getCurrentUser();
    this.quieryCouriers();
  },
  data() {
    return {
      courier: Object,
      deliveries: [],
      exitsDeliveries: true,
      isReadyQuery: false,
      //Paginator
      currentPage: 1,
      currentTimes: [],
      paginate: ["deliveries"],
      reload: false,
    };
  },
  methods: {
    getCurrentUser() {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user.type === "COURIER") {
        this.courier = user;
      } else {
        this.$destroy();
        this.$router.push({ path: "/" });
      }
    },
    quieryCouriers() {
      this.$apollo
        .query({
          query: require("@/graphql/couriers/couriersDeliveries.gql"),
        })
        .then((response) => {
          this.tansformQuery(response.data.allDeliveries.edges).then(
            (value) => {
              if (value && this.deliveries.length > 0) {
                this.isReadyQuery = true;
                this.exitsDeliveries = true;
              } else {
                this.exitsDeliveries = false;
              }

              //
            }
          );
        });
    },
    async tansformQuery(data) {
      let allDeliveries = data.filter(
        (user) => user.node.courier.email === this.courier.email
      );

      if (allDeliveries.length > 0) {
        for (let delivery of allDeliveries) {
          if (delivery.node.order.status == "DESPACHADO") {
            let newDelivery = {
              deliveryID: delivery.node.id,
              orderID: delivery.node.order.id,
              deliveryTime: delivery.node.deliveryTime,
              products: [],
              enterprise: "",
              payType: "Efectivo",
              cost: 0,
              status: delivery.node.order.status,
              selected: false,
            };
            for (let product of delivery.node.order.details.edges) {
              newDelivery.products.push({
                name: product.node.product.name,
                quantity: product.node.quantity,
                cost: product.node.product.price,
              });
              newDelivery.cost +=
                parseInt(product.node.product.price) *
                parseInt(product.node.quantity);
              newDelivery.enterprise = product.node.product.enterprise.name;
            }
            this.deliveries.push(newDelivery);
          }
        }
        return true;
      } else {
        return false;
      }
    },
    deliver() {
      let flag = false;
      for (let idx in this.deliveries) {
        if (this.deliveries[idx].selected) {
          this.updateStatusOrder(this.deliveries[idx]);
          flag = true;
        }
      }
      if (!flag) {
        alert("Seleccione un pedido para ver la ruta y el tiempo estimado");
      }
    },
    /*Actualizar el estado de la orden*/
    updateStatusOrder(delivery) {
      this.$apollo
        .mutate({
          mutation: require("@/graphql/deliveries/updateOrder.gql"),
          variables: {
            id: delivery.orderID,
            status: "entregado",
          },
          refetchQueries: [
            { query: require("@/graphql/couriers/couriersDeliveries.gql") },
          ],
        })
        .then((response) => {
          console.log("actualización de order:", response.data);
        });
      let idx = this.deliveries.findIndex(
        (delivery) => delivery.deliveryID === delivery.deliveryID
      );
      this.deliveries.splice(idx, 1);
      if (this.deliveries.length == 0) {
        this.exitsDeliveries = false;
      }
    },
  },
};
</script>
//General Component styles 
<style scope>
.btn-black {
  background-color: var(--dark);
  color: var(--white);
}
.btn-black:hover {
  background-color: var(--dark-xx);
  color: var(--light);
}
.color-text-tar {
  color: var(--black);
}
.color-text-tar:hover {
  text-decoration: none;
  color: var(--black);
}

.card-header:hover {
  background-color: var(--grey);
  color: var(--black);
}
.content-black {
  background-color: var(--white);
  color: var(--black);
}
</style>
//Clouds over map
<style >
.gm-style-iw button {
  display: none !important;
}
</style>
