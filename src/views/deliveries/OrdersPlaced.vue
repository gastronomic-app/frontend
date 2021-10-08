<template>
  <div
    class="container justify-content-center align-items-center"
    style="margin-top: 1em"
  >
    <h3><b>Mis Pedidos</b></h3>

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

    <div v-else id="accordionList">
      <paginate name="orders" :list="orders" :per="5">
        <template v-for="(order, idx) in paginated('orders')">
          <accordion :key="order.id" :item="order" :id="idx">
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
                    <tr v-for="product in order.products" :key="product.id">
                      <td>{{ product.name }}</td>
                      <td>{{ product.quantity }}</td>
                      <td>{{ product.cost }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5>
                Establecimiento: <b>{{ order.enterprise }}</b>
              </h5>
              <h5>Lugar de entrega: {{ order.route.destination }}</h5>
              <h5>
                Tiempo estimado de preparation:
                {{ order.preparationTime }} minutos.
              </h5>
              <h5>
                Tu pedido llegara en:
                <b style="color: var(--orange)"
                  ><countdown
                    :id="order.id"
                    :hours="order.estimatedTime.hours"
                    :min="order.estimatedTime.min"
                    :sec="order.estimatedTime.sec"
                  >
                    <!-- Button trigger modal -->
                    <button
                      type="button"
                      class="btn btn-black"
                      data-toggle="modal"
                      :data-target="'#simpleModal' + order.id"
                    >
                      Generar Reporte
                    </button>
                    <simple-modal
                      :modalRef="order.id"
                      :modalCentered="true"
                      :body="
                        'Hola, ' +
                        user.names +
                        ', ¿quieres reportar una queja a ' +
                        order.enterprise +
                        '? '
                      "
                      buttonPrimaryTitle="Reportar"
                      :buttonPrimaryAction="redirect"
                    ></simple-modal> </countdown
                ></b>
              </h5>
              <h5>
                Costo Total: <b>${{ order.cost }}</b>
              </h5>
              <div class="track-order-container">
                <button
                  :ref="order.id"
                  type="button "
                  class="btn btn-black track-order"
                  @click="trackOrder(order.id)"
                >
                  Seguir Pedido
                </button>
              </div>
            </div>
          </accordion>
        </template>
      </paginate>
      <div v-if="orders.length === 5" class="div-paginate">
        <paginate-links
          for="orders"
          :classes="{ ul: 'pagination' }"
          :show-step-links="true"
        ></paginate-links>
      </div>
      <br />
      <div v-show="showmap" class="map-container">
        <div class="map" ref="map"></div>
      </div>
    </div>
  </div>
</template>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkQNpJPrbKgjmDPbJCZjTEXw2rJ4bwyS0"></script>
<script>
import Accordion from "@/components/common/Accordion.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";
import NotFound from "@/components/common/NotFound.vue";
import Countdown from "@/views/deliveries/Countdown.vue";
import SimpleModal from "../../components/common/SimpleModal.vue";

export default {
  components: {
    Accordion,
    LoadingGraphql,
    ConnectionErrorGraphql,
    NotFound,
    SimpleModal,
    Countdown,
  },
  name: "OrdersPlaced",
  created() {
    let elements = JSON.parse(localStorage.getItem("deliveryTimes"));
    try {
      if (elements.deliveryTimes.length > 0) {
        this.localTimes = elements;
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
    },
    queryOrders() {
      this.$apollo
        .query({
          query: require("@/graphql/deliveries/ordersPlaced.gql"),
        })
        .then((response) => {
          this.tansformQuery(response.data.allOrders.edges).then((value) => {
            if (value) {
              this.getDurationDistance(this.orders);
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
      for (const order of this.orders) {
        origins.push(order.route.origin);
        destinations.push(order.route.destination);
      }
      return { origins: origins, destinations: destinations };
    },
    async getDurationDistance(orders) {
      const objRoute = this.getOriginsDestinations();

      const distanceMatrix = new google.maps.DistanceMatrixService();
      distanceMatrix.getDistanceMatrix(
        {
          origins: objRoute.origins,
          destinations: objRoute.destinations,
          travelMode: "DRIVING",
        },
        async (response) => {
          for (let i = 0; i < response.rows.length; i++) {
            if (response.rows[0].elements[0].status === "OK") {
              let elements = await response.rows[i].elements[i];

              orders[i].route.distance = await elements.distance.text;
              orders[i].route.duration.durationFormatted = await elements
                .duration.text;
              orders[i].route.duration.durationInSec = await elements.duration
                .value;
            } else {
              orders[i].route.distance = 0;
              orders[i].route.duration.durationFormatted = 0;
              orders[i].route.duration.durationInSec = 0;
            }
          }
          this.getEstimatedTime();
        }
      );
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
      this.showmap = true;
      this.showRoute([order.route]);
    },
    async tansformQuery(data) {
      let allOrders = data.filter(
        (user) => user.node.client.email === this.user.email
      );
      if (allOrders.length > 0) {
        for (let order of allOrders) {
          let newOrder = {
            id: order.node.id,
            date: order.node.date,
            products: [],
            enterprise: "",
            cost: 0,
            estimatedTime: { hours: 0, min: 0, sec: 0 },
            preparationTime: "",
            route: {
              origin: {},
              destination: {},
              duration: { durationFormatted: "", durationInSec: "" },
              distance: "",
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
            newOrder.enterprise = product.node.product.enterprise.name;
            newOrder.route.origin = product.node.product.enterprise.location;
          }
          newOrder.preparationTime = order.node.estimatedTime;
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
      let localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser.type === "CLIENT") {
        this.user = localUser;
      } else {
        this.$destroy();
        this.$router.push({ path: "/" });
      }
    },
    getEstimatedTime() {
      if (this.existsTimes) {
        this.updateTimes();
      }
      for (const order of this.orders) {
        const idx = this.localTimes.deliveryTimes.findIndex(
          (time) => time.id === order.id
        );
        if (idx >= 0) {
          order.estimatedTime = {
            hours: this.localTimes.deliveryTimes[idx].hours,
            min: this.localTimes.deliveryTimes[idx].min,
            sec: this.localTimes.deliveryTimes[idx].sec,
          };
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
      this.exitsOrders = true;
      this.isReady = true;
    },
    updateTimes() {
      const date = new Date();
      const currenttime = {
        hours: date.getHours(),
        min: date.getMinutes(),
        sec: date.getSeconds(),
      };
      let hours = currenttime.hours - this.localTimes.lastActiveTime.hours;
      let min = currenttime.min - this.localTimes.lastActiveTime.min;
      let sec = currenttime.sec - this.localTimes.lastActiveTime.sec;
      this.localTimes.deliveryTimes.forEach((time) => {
        time.hours = time.hours - hours > 0 ? time.hours - hours : 0;
        time.min = time.min - min > 0 ? time.min - min : 0;
        time.sec = time.sec - sec > 0 ? time.sec - sec : 0;
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

.track-order-container {
  display: flex;
  justify-content: center;
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

.card-header:hover {
  background-color: var(--grey);
  color: var(--black);
}
.content-black {
  background-color: var(--white);
  color: var(--black);
}
.map-container {
  padding-left: 2.5em;
  margin: auto;
}
.map {
  height: 25em;
  top: 0;
  bottom: 0;
  background-color: var(--light);
}
</style>
//Clouds over map
<style >
.gm-style-iw button {
  display: none !important;
}
</style>



