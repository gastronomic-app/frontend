<template>
  <div class="container jumbotron container-image" style="margin-top: 1em">
    <div v-if="!isReadyQuery">
      <div v-if="exitsDelivery === false">
        <h3>
          <strong> No tienes entregas por realizar.</strong>
          <not-found></not-found>
        </h3>
      </div>
      <div v-else>
        <LoadingGraphql />
      </div>
    </div>

    <div v-else v-show="exitsDelivery">
      <h3><b>Entrega pendiente</b></h3>
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
          <b>
          Establecimiento: </b>{{ delivery.enterprise }}
        </h5>
        <h5>
           <b>
          Destinatario:</b>
         
            {{ delivery.orderUser.name }} {{ delivery.orderUser.lastname }}
          
        </h5>
        <h5>
          <b>
          Ubicación:</b>  {{ delivery.orderUser.location }}
        </h5>
        <h5>
          <b>
          Método de pago: </b>{{ delivery.payType }}
        </h5>
        <h5> <b>
          Costo Total: ${{ delivery.cost }}</b>
        </h5>
        <h5>
          <b>
          Estado: <span style="color:var(--orange)">{{ delivery.status }}</span></b>
        </h5>
      </div>
      <div class="container-button">
        <button type="button" class="btn btn-black" @click="deliver">
          Entregar
        </button>
      </div>
      <br />
    </div>
    <div v-show="delivered">
      <h3></h3>
      <div v-if="exitsDelivery">
        <LoadingGraphql />
      </div>
      <h3 v-else>
        <strong> No tienes entregas por realizar.</strong>
        <not-found></not-found>
      </h3>
    </div>
  </div>
</template>
<script>
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import NotFound from "@/components/common/NotFound.vue";
export default {
  components: {
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
      delivery: {},
      exitsDelivery: true,
      isReadyQuery: false,
      delivered: false,
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
          this.tansformQuery(response.data.allOrders.edges).then((value) => {
            if (value && this.delivery != undefined) {
              this.isReadyQuery = true;
              this.exitsDelivery = true;
            } else {
              this.exitsDelivery = false;
            }

            //
          });
        });
    },
    async tansformQuery(data) {
      let delivery = data.filter((user) => {
        if (user.node.courier !== null) {
          if (user.node.courier.email === this.courier.email) {
            return true;
          }
        }
      });

      if (delivery.lenght>0) {
        if (delivery[0].node.status == "DESPACHADO") {
          let newDelivery = {
            orderID: delivery[0].node.id,
            deliveryTime: delivery[0].node.estimatedTime,
            products: [],
            enterprise: "",
            payType: "Efectivo",
            cost: 0,
            status: delivery[0].node.status,
            selected: false,
            orderUser: {},
            courierStatus: false,
          };
          await this.getOrderUser(delivery[0].node.client.email).then(
            (value) => {
              newDelivery.orderUser = value;
              for (let product of delivery[0].node.details.edges) {
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
              this.delivery = newDelivery;
            }
          );
          return true;
        }
        return false;
      } else {
        return false;
      }
    },
    async getOrderUser(userEmail) {
      let user = {};
      await this.$apollo
        .query({
          query: require("@/graphql/user/userByEmail.gql"),
          variables: {
            email: userEmail,
          },
        })
        .then((response) => {
          user.lastname =
            response.data.allUsers.edges[0].node.contact.edges[0].node.lastnames;
          user.name =
            response.data.allUsers.edges[0].node.contact.edges[0].node.names;
          user.location =
            response.data.allUsers.edges[0].node.contact.edges[0].node.location;
          user.telephone =
            response.data.allUsers.edges[0].node.contact.edges[0].node.telephone;
        });
      return user;
    },
    deliver() {
      this.updateStatusOrder(this.delivery);
      this.updateStatusCourier(true);

      this.delivered = true;
      setTimeout(() => {
        this.makeToast("success", "", "Pedido entregado.", 5000);
        this.exitsDelivery = false;
      }, 2000);
    },
    /*Actualizar el estado del mensajero*/
    updateStatusCourier(status) {
      this.courier.courierStatus = status;
      this.$apollo
        .mutate({
          mutation: require("@/graphql/deliveries/updateCourier.gql"),
          variables: {
            id: this.courier.id,
            isAvailable: status,
          },
        })
        .then((response) => {
          console.log("actualización de courier:", response.data);
        });
    },

    /*Actualizar el estado de la orden*/
    updateStatusOrder() {
      this.$apollo
        .mutate({
          mutation: require("@/graphql/deliveries/updateOrderByID.gql"),
          variables: {
            id: this.delivery.orderID,
            status: "entregado",
          },
          refetchQueries: [
            { query: require("@/graphql/couriers/couriersDeliveries.gql") },
          ],
        })
        .then((response) => {
          console.log("actualización de order:", response.data);
        });
    },
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },
  },
};
</script>
//General Component styles 
<style scope>
.container-image {
  background: linear-gradient(
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    url("https://delivery-food-frontend.herokuapp.com/img/logo.d205f58e.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  border-style: solid;
  width: 60vw;
}
.container-button {
  display: flex;
  justify-content: flex-end;
  margin-right: 2em;
}
.btn-black {
  background-color: var(--orange);
  color: var(--black);
}
.btn-black:hover {
  background-color: var(--orange-x);
  color: var(--black);
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
