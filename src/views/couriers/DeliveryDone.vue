<template>
  <div class="container-image" style="margin-top: 1em">
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
      <h3 style="color: var(--orange)"><b>Entrega pendiente</b></h3>
      <div class="card-body">
        <h4>Resumen de pedido <br /></h4>
        <div>
          <table class="table table-bordered">
            <thead class="thead">
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
        <h5><b> Establecimiento: </b>{{ delivery.enterprise }}</h5>
        <h5>
          <b> Destinatario:</b>

          {{ delivery.orderUser.name }} {{ delivery.orderUser.lastname }}
        </h5>
        <h5><b> Ubicación:</b> {{ delivery.orderUser.location }}</h5>
        <h5><b> Contacto:</b> {{ delivery.orderUser.telephone }}</h5>
        <h5><b> Método de pago: </b>{{ delivery.payType }}</h5>
        <h5>
          <b> Costo Total: ${{ delivery.cost }}</b>
        </h5>
        <h5>
          <b>
            Estado:
            <span style="color: var(--orange)">Despachada</span></b
          >
        </h5>
      </div>
      <div class="container-button">
        <button type="button" class="btn btn-color" @click="deliver">
          Entregar
        </button>
        <button type="button" class="btn btn-black" @click="toRefuse">
          Rechazar
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
      let user =
        typeof JSON.parse(localStorage.getItem("user")) === "object"
          ? JSON.parse(localStorage.getItem("user"))
          : null;

      if (user !== null) {
        if (user.type === "COURIER") {
          this.courier = user;
        } else {
          this.$destroy();
          this.$router.push({ path: "/" });
        }
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
      let delivery = data.filter((order) => {
        if (order.node.courier.email === this.courier.email) {
          return true;
        }
      }, this.courier);
      if (delivery.length > 0) {
        let newDelivery = {
          orderID: delivery[0].node.id,
          deliveryTime: delivery[0].node.estimatedTime,
          products: [],
          enterprise: "",
          payType: "Efectivo",
          cost: 0,
          orderUser: {},
        };
        await this.getOrderUser(delivery[0].node.client.email).then((value) => {
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
        });
        return true;
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
          user.id =
            response.data.allUsers.edges[0].node.id;
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
      this.updateStatusOrder("entregado");
      this.updateStatusCourier(true);

      this.updatePayment(
        this.delivery.orderID,
        "efectivo",
        this.delivery.cost.toString()
      );

      this.delivered = true;
      setTimeout(() => {
        this.makeToast("success", "", "Pedido entregado.", 5000);
        this.exitsDelivery = false;
      }, 2000);

      this.makeNotificationClient();
    },
    toRefuse() {
      this.updateStatusOrder("nuevo");
      this.updateStatusCourier(true);

      this.delivered = true;
      setTimeout(() => {
        this.makeToast("success", "", "Orden rechazada", 5000);
        this.exitsDelivery = false;
      }, 2000);
    },

    /*Actualizar el estado del mensajero*/
    updateStatusCourier(status) {
      this.$apollo.mutate({
        mutation: require("@/graphql/deliveries/updateCourier.gql"),
        variables: {
          id: this.courier.id,
          isAvailable: status,
        },
      });
    },

    /*Actualizar el estado de la orden*/
    updateStatusOrder(status) {
      this.$apollo.mutate({
        mutation: require("@/graphql/deliveries/updateOrderByID.gql"),
        variables: {
          id: this.delivery.orderID,
          status: status,
        },
        refetchQueries: [
          { query: require("@/graphql/couriers/couriersDeliveries.gql") },
        ],
      });
    },
    updatePayment(orderID, paymenttype, paymentvalue) {
      this.$apollo.mutate({
        mutation: require("@/graphql/payments/createPayment.gql"),
        variables: {
          orderId: orderID,
          paymentType: paymenttype,
          paymentValue: paymentvalue,
        },
        refetchQueries: [
          { query: require("@/graphql/couriers/couriersDeliveries.gql") },
        ],
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

    /**METHODS NEEDED FOR NOTIFICATION */

    makeNotificationClient() {

      console.log(this.delivery);
      let notification = {
          userId: this.delivery.orderUser.id,
          title: "¡Tu pedido fue entregado!",
          message: `El pedido que realizaste a ${this.delivery.enterprise} fue entregado.`,
        };
      this.createNotification(notification);
    },

    createNotification(notification) {
      this.$apollo
        .mutate({
          mutation: require("@/graphql/notifications/createNotification.gql"),
          variables: {
            title: notification.title,
            message: notification.message,
            userId: notification.userId,
          },
        })
        .then((response) => {
          console.log(
            "creada notificación para: ",
            notification.userId,
            " ",
            response
          );
        });
    },
  },
};
</script>
//General Component styles
<style scope>
.container-image {
  background: linear-gradient(
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.9)
    ),
    url("https://delivery-food-frontend.herokuapp.com/img/logo.d205f58e.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  padding: 2.5em;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1em;
  border-radius: 1em;
  box-shadow: 0 -3em 5em 2em rgba(231, 231, 231, 0.93);
}
.table {
  text-align: center;
}
.thead {
  background-color: var(--dark);
  color: var(--light);
}
.container-button {
  display: flex;
  justify-content: flex-end;
  margin-right: 2em;
  gap: 3em;
}
.btn-black {
  background-color: var(--dark);
  color: var(--light);
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
