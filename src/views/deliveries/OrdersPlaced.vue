<template>
  <div class="container jumbotron" style="margin-top: 1em">
    <h2 style="margin: 0 0 1.5em"><b>Mis Pedidos</b></h2>

    <div v-if="!isReady">
      <div v-if="!exitsOrders">
        <h4>
          No has realizado ningún pedido, <b>¡animate a comprar!</b>
          <not-found></not-found>
        </h4>
      </div>
      <div v-else>
        <LoadingGraphql />
      </div>
    </div>

    <div v-else ref="accordionList" class="accordion" id="accordion">
      <paginate ref="paginator" name="orders" :list="orders" :per="5">
        <template v-for="(order, idx) in paginated('orders')">
          <collapsible-card
            :key="order.id"
            :item="order"
            :id="idx"
            :header="'Pediste a ' + order.enterprise"
          >
            <div class="card-body">
              <h5 class="order-summary"><b>Resumen de pedido </b><br /></h5>

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
                    <tr v-for="product in order.products" :key="product.id">
                      <td>{{ product.name }}</td>
                      <td>{{ product.quantity }}</td>
                      <td>{{ product.cost }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h6><b> Establecimiento: </b>{{ order.enterprise }}</h6>
              <h6><b>Lugar de entrega: </b>{{ order.route.destination }}</h6>
              <h6>
                <b> Tiempo estimado de preparation: </b>
                {{ order.preparationTime }} minutos.
              </h6>
              <h6>
                <b> Estado del pedido: </b
                ><b style="color: var(--orange)">{{ order.status }}.</b>
              </h6>
              <h6>
                <b> Tu pedido llegara en: </b>

                <b style="color: var(--orange)"
                  ><countdown
                    :id="order.id"
                    :hours="order.estimatedTime.hours"
                    :min="order.estimatedTime.min"
                    :sec="order.estimatedTime.sec"
                    v-if="order.status !== 'CANCELADO'"
                  >
                    <div>
                      <b-button
                        class="btn-black"
                        @click="$bvModal.show(order.id)"
                        >Reportar</b-button
                      >
                      <b-modal
                        :id="order.id"
                        centered
                        title="Realizar un reporte de pedido"
                      >
                        <p class="my-4">
                          Hola, {{ user.names }} ¿ocurrió algo con tu pedido?
                        </p>
                        <template #modal-footer="{ cancel }">
                          <b-button
                            size="sm"
                            class="btn-color"
                            @click="redirect(order.id)"
                          >
                            Reportar</b-button
                          >
                          <b-button class="btn-black" size="sm" @click="cancel">
                            Cancelar</b-button
                          >
                        </template>
                      </b-modal>
                    </div>
                  </countdown>
                </b>
              </h6>
              <h6><b> Costo Total: </b>${{ order.cost }}</h6>
              <div v-if="order.route.status" class="track-order-container">
                <button
                  :ref="order.id"
                  type="button "
                  class="btn btn-color"
                  :class="{
                    deactive:
                      order.status === 'CANCELADO' ||
                      order.status === 'ENTREGADO',
                  }"
                  @click="trackOrder(order.id)"
                >
                  {{ btnValue }}
                </button>
                <div>
                  <b-button
                    class="btn-black"
                    :class="{
                      deactive:
                        order.status === 'CANCELADO' ||
                        order.status === 'ENTREGADO',
                    }"
                    @click="$bvModal.show(order.id)"
                    >Cancelar</b-button
                  >
                  <b-modal
                    :id="order.id"
                    centered
                    title="Realizar reporte de pedido"
                  >
                    <p class="my-4">
                      Hola, {{ user.names }}. Vamos a envíar tu petición al
                      administrador de {{order.enterprise}} para que se comunique
                      contigo e iniciar a evaluar tu caso.
                    </p>
                    <template #modal-footer="{ cancel }">
                      <b-button
                        size="sm"
                        class="btn-color"
                        @click="[cancelOrder(order.id), cancel()]"
                       
                      >
                        Reportar</b-button
                      >
                      <b-button class="btn-black" size="sm" @click="cancel()">
                        Cancelar</b-button
                      >
                    </template>
                  </b-modal>
                </div>
               
              </div>
              <div v-else class="no-track-order">
                <span
                  >La opción de seguir pedido no está disponible para la
                  ubicación que colocaste.</span
                >
              </div>
            </div>
          </collapsible-card>
        </template>
      </paginate>
      <section v-if="orders.length > 5">
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
      </section>

      <br />
      <div v-show="showmap" class="map-container">
        <div class="map" ref="map"></div>
      </div>
    </div>
  </div>
</template>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkQNpJPrbKgjmDPbJCZjTEXw2rJ4bwyS0"></script>
<script>
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";
import NotFound from "@/components/common/NotFound.vue";
import Countdown from "@/views/deliveries/Countdown.vue";
import SimpleModal from "../../components/common/SimpleModal.vue";
import CollapsibleCard from "../../components/common/CollapsibleCard.vue";

export default {
  components: {
    LoadingGraphql,
    ConnectionErrorGraphql,
    NotFound,
    SimpleModal,
    Countdown,
    CollapsibleCard,
  },
  name: "OrdersPlaced",
  created() {
    let elements = JSON.parse(localStorage.getItem("deliveryTimes"));
    try {
      if (elements.deliveryTimes.length > 0) {
        this.localTimes = elements;
        this.updateTimes();
        this.existsTimes = true;
      }
    } catch (error) {
      ///
    }
    window.addEventListener("beforeunload", this.leaving);
  },
  ready: function () {
    window.beforeunload = this.leaving;
    window.onblur = this.leaving;
  },
  mounted() {
    this.getCurrentUser();
    this.queryOrders();
  },

  destroyed() {
    this.leaving();
  },
  data() {
    return {
      exitsOrders: true,
      existsTimes: false,
      isReady: false,
      user: {},
      showmap: false,
      orders: [],
      localTimes: {},
      btnValue: "Ver Ruta",
      //Paginator
      currentPage: 1,
      paginate: ["orders"],
    };
  },
  methods: {
    leaving() {
      if (this.$store.state.deliveryTimesLocal.deliveryTimes.length > 0) {
        this.$store.dispatch("setDeliveryTimesAction");
      }
      for (const order of this.$store.state.deliveryTimesLocal.deliveryTimes) {
        const time = JSON.stringify({
          h: order.hours,
          m: order.min,
          s: order.sec,
        });
        console.log(time);
        this.updateEstimatedTime(order.id, time);
      }
    },
    async queryOrders() {
      await this.$apollo
        .query({
          query: require("@/graphql/deliveries/ordersPlaced.gql"),
        })
        .then((response) => {
          this.tansformQuery(response.data.allOrders.edges).then((value) => {
            if (value) {
              this.getDurationDistance(this.orders);
              setTimeout(() => {
                this.getEstimatedTime();
              }, 2000);
            } else {
              this.exitsOrders = false;
            }
          });
        });
    },
    async getCompleteAddress(address) {
      const geocoder = new google.maps.Geocoder();
      let completeAddress = {
        address: "",
        lat: "",
        lng: "",
      };

      await geocoder.geocode(
        {
          address: address,
        },
        async (response, status) => {
          if (status === "OK") {
            (completeAddress.address = await response[0].formatted_address),
              (completeAddress.lat = await response[0].geometry.location.lat()),
              (completeAddress.lng = await response[0].geometry.location.lng());
          }
        }
      );
      return completeAddress;
    },
    getOriginsDestinations() {
      let origins = [];
      let destinations = [];
      let objRoutes = [];
      let orders = this.orders;

      for (const order of orders) {
        if (
          typeof order.route.origin === "string" &&
          typeof order.route.destination === "string"
        ) {
          origins.push(order.route.origin);
          destinations.push(order.route.destination);
          if (origins.length === 9) {
            objRoutes.push({ origins: origins, destinations: destinations });
            origins = [];
            destinations = [];
          }
        } else {
          order.route.origin =
            typeof order.route.origin === "string" ? order.route.origin : "";
          order.route.destination =
            typeof order.route.destination === "string"
              ? order.route.destination
              : "";
          origins.push(order.route.origin);
          destinations.push(order.route.destination);
        }
      }
      objRoutes.push({ origins: origins, destinations: destinations });
      return objRoutes;
    },
    async getDurationDistance(orders) {
      let idx = 0;
      const objRoutes = this.getOriginsDestinations();

      for await (const routes of objRoutes) {
        const distanceMatrix = new google.maps.DistanceMatrixService();
        await distanceMatrix.getDistanceMatrix(
          {
            origins: routes.origins,
            destinations: routes.destinations,
            travelMode: "DRIVING",
          },
          async (response) => {
            for (let j = 0; j < response.rows.length; j++) {
              if (response.rows[j].elements[j].status === "OK") {
                let elements = await response.rows[j].elements[j];
                orders[idx].route.distance = await elements.distance.text;
                orders[idx].route.duration.durationFormatted = await elements
                  .duration.text;
                orders[idx].route.duration.durationInSec = await elements
                  .duration.value;
                orders[idx].route.status = true;
              } else {
                orders[idx].route.distance = 0;
                orders[idx].route.duration.durationFormatted = 0;
                orders[idx].route.duration.durationInSec = 0;
                orders[idx].route.status = false;
              }
              idx++;
            }
          }
        );
      }
    },
    showRoute(routes) {
      const directionsService = new google.maps.DirectionsService();
      const map = new google.maps.Map(this.$refs["map"], {
        center: new google.maps.LatLng(2.45, -76.6167),
        zoom: 18,
        mapTyeId: google.maps.MapTypeId.ROADMAP,
      });
      routes.forEach((route) => {
        directionsService.route(
          {
            origin: route.origin,
            destination: route.destination,
            travelMode: "DRIVING",
          },
          (response, status) => {
            if (status === "OK") {
              const directionsRenderer = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                polylineOptions: { strokeColor: "rgba(255, 68, 0, 0.877)" },
              });

              this.getCompleteAddress(route.origin).then((value) => {
                const originLabel = new google.maps.InfoWindow({
                  content: `<i class ="bi-geo-alt-fill alternate icon"></i> ${route.origin}`,
                  position: new google.maps.LatLng(value.lat, value.lng),
                });

                originLabel.open(map, null);
              });

              this.getCompleteAddress(route.destination).then((value) => {
                const destinationLabel = new google.maps.InfoWindow({
                  content: `<i class ="bi-flag-fill checkered icon"> </i> ${route.destination}`,
                  position: new google.maps.LatLng(value.lat, value.lng),
                });

                destinationLabel.open(map, null);
              });

              const overviewPath = response.routes[0].overview_path;
              const middleIndex = parseInt(overviewPath.length / 2);

              const middleLoc = overviewPath[middleIndex];
              const distanceDurationLabel = new google.maps.InfoWindow({
                content: `<i class ="bi-alarm-fill icon"></i> ${route.duration.durationFormatted}`,
                position: new google.maps.LatLng(
                  middleLoc.lat(),
                  middleLoc.lng()
                ),
              });
              distanceDurationLabel.open(map, null);
              directionsRenderer.setDirections(response);
              directionsRenderer.setMap(map);
            } else {
              console.log("No se ha logrado obtener la duración");
            }
          }
        );
      });
    },
    trackOrder(orderID) {
      const order = this.orders.find((order) => order.id === orderID);
      this.showmap = !this.showmap;
      this.btnValue = !this.showmap ? "Ver ruta" : "Ocultar mapa";
      this.showRoute([order.route]);
    },
    async tansformQuery(data) {
      let allOrders = data.filter((user) => {
        if (user.node.client.email === this.user.email) {
          return true;
        }
      }, this.user);
      if (allOrders.length > 0) {
        for (let order of allOrders) {
          let newOrder = {
            id: order.node.id,
            date: order.node.date,
            products: [],
            enterprise: "",
            cost: 0,
            estimatedTime: { hours: 0, min: 0, sec: 0 },
            estimatedTimeMin:
              order.node.estimatedTime !== "0" ? order.node.estimatedTime : "0",
            preparationTime: 0,
            status: order.node.status,
            route: {
              origin: {},
              destination: {},
              duration: { durationFormatted: "", durationInSec: "" },
              distance: "",
              status: false,
            },
          };
          for (let product of order.node.details.edges) {
            newOrder.products.push({
              id: product.node.product.id,
              name: product.node.product.name,
              quantity: product.node.quantity,
              cost: product.node.product.price,
            });
            newOrder.cost += parseInt(
              product.node.product.price * product.node.quantity
            );
            newOrder.preparationTime += parseInt(
              product.node.product.estimatedTime
            );

            newOrder.enterprise = product.node.product.enterprise.name;
            newOrder.route.origin = product.node.product.enterprise.location;
          }
          newOrder.route.destination = order.node.location;
          this.orders.push(newOrder);
        }
        return true;
      } else {
        return false;
      }
    },
    secondsToString(seconds) {
      let hours = Math.floor(seconds / 3600);
      let minute = Math.floor((seconds / 60) % 60);
      let second = seconds % 60;
      return { hours: hours, min: minute, sec: second };
    },
    getCurrentUser() {
      let user =
        typeof JSON.parse(localStorage.getItem("user")) === "object"
          ? JSON.parse(localStorage.getItem("user"))
          : null;

      if (user !== null) {
        if (user.type === "CLIENT") {
          this.user = user;
        } else {
          this.$destroy();
          this.$router.push({ path: "/" });
        }
      } else {
        this.$destroy();
        this.$router.push({ path: "/" });
      }
    },
    getEstimatedTime() {
      let idx = -1;
      for (const order of this.orders) {
        if (order.status !== "ENTREGADO" && order.status !== "CANCELADO") {
          if (this.existsTimes) {
            idx = this.localTimes.deliveryTimes.findIndex(
              (time) => time.id === order.id
            );
          }

          if (idx >= 0) {
            order.estimatedTime = {
              hours: this.localTimes.deliveryTimes[idx].hours,
              min: this.localTimes.deliveryTimes[idx].min,
              sec: this.localTimes.deliveryTimes[idx].sec,
            };

            idx = -1;
          } else {
            let preparation =
              order.preparationTime > 0
                ? order.preparationTime * 60
                : order.preparationTime;

            let time = this.secondsToString(
              order.route.duration.durationInSec + preparation
            );
            order.estimatedTime = time;
          }
        }
      }
      this.exitsOrders = true;
      this.isReady = true;
    },
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },
    updateTimes() {
      const date = new Date();
      const elapsedMilisec = date - new Date(this.localTimes.lastActiveTime);
      const elapsed = this.secondsToString(elapsedMilisec / 1000);
      this.localTimes.deliveryTimes.forEach((time) => {
        time.hours =
          time.hours - elapsed.hours > 0
            ? time.hours - parseInt(elapsed.hours)
            : 0;
        time.min =
          time.min - elapsed.min > 0 ? time.min - parseInt(elapsed.min) : 0;
        time.sec =
          time.sec - elapsed.sec > 0 ? time.sec - parseInt(elapsed.sec) : 0;
      });
    },
    updateEstimatedTime(orderID, time) {
      this.$apollo.mutate({
        mutation: require("@/graphql/deliveries/updateEstimatedTime.gql"),
        variables: {
          id: orderID,
          estimatedTime: time,
        },
      });
    },
    redirect(orderID) {
      const order = this.orders.find((order) => order.id === orderID);
      if (order !== undefined) {
        this.$router.push({
          name: "Report",
          params: { deliveryId: order.id, enterprise: order.enterprise },
        });
      }
    },
    /*Actualizar el estado de la orden*/
    updateStatusOrder(orderID, status) {
      this.$apollo.mutate({
        mutation: require("@/graphql/deliveries/updateOrderByID.gql"),
        variables: {
          id: orderID,
          status: status,
        },
        refetchQueries: [
          { query: require("@/graphql/couriers/couriersDeliveries.gql") },
        ],
      });
    },
    cancelOrder(orderID) {
      this.updateStatusOrder(orderID, "cancelado");
      setTimeout(() => {
        this.makeToast("success", "", "Orden Cancelada", 5000);
        this.exitsDelivery = false;
      }, 2000);

      let idx = this.orders.findIndex((order) => order.id === orderID);
      this.orders[idx].status = "CANCELADO";
    },
  },
};
</script>

//General Component styles
<style scoped>
div.accordion {
  margin: 0;
  padding: 0;
  right: 5em;
}
.container {
  width: 80%;
  margin: auto;
  padding: auto;
}
.jumbotron {
  background-color: whitesmoke;
  box-shadow: 1em 1em 4em 1em rgba(13, 13, 13, 0.2);
  border-radius: 1em;
}
.table-bordered {
  border-top-right-radius: 1em;
  border-top-left-radius: 1em;
  text-align: center;
}
.thead {
  background-color: var(--dark);
  color: var(--light);
  border-top-right-radius: 1em;
  border-top-left-radius: 1em;
}
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

.track-order-container {
  display: flex;
  justify-content: center;
  gap: 2em;
  margin-top: 1em;
}
.track-order {
  margin: auto;
  background-color: var(--orange);
  color: var(--black);
}
.track-order:hover {
  background-color: var(--orange-x-hover);
  color: var(--black);
}
.no-track-order {
  text-align: center;
  font-size: 0.7em;
  color: red;
}
.card-header:hover {
  background-color: var(--grey);
  color: var(--black);
}
.content-black {
  background-color: var(--white);
  color: var(--black);
}

.map-container {
  margin: auto;
}
.order-summary {
  display: flex;
  justify-content: center;
}
.map {
  height: 25em;
  top: 0;
  bottom: 0;
  background-color: var(--light);
}
.deactive {
  display: none;
}
</style>
//Clouds over map
<style >
.gm-style-iw button {
  display: none !important;
}
</style>



