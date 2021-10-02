<template>
  <div class="container" style="margin-top: 1em">
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

    <div v-else>
      <paginate name="orders" :list="orders" :per="5">
        <template v-for="(order, idx) in paginated('orders')">
          <accordion
            :key="order.id"
            :item="order"
            :checkbox_use="true"
            :id="idx"
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
              <h5>Lugar de entrega: {{ order.route.destination.address }}</h5>
              <h5>
                Tu pedido llegara en:
                <b style="color: var(--orange)"
                  ><Countdown
                    :id="order.id"
                    :currentTime="getCurrentTime"
                    :hours="order.estimatedTime.hours"
                    :min="order.estimatedTime.min"
                    :sec="order.estimatedTime.sec"
                /></b>
              </h5>
              <h5>
                Costo Total: <b>${{ order.cost }}</b>
              </h5>
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
      <div
        v-if="orders.length > 0"
        class="container d-flex justify-content-end"
      >
        <button type="button" class="btn btn-black" @click="trackOrder">
          Seguir Pedido
        </button>
      </div>
      <br />
      <div v-show="showmap">
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

export default {
  components: {
    Accordion,
    LoadingGraphql,
    ConnectionErrorGraphql,
    NotFound,
    Countdown,
  },
  name: "OrdersPlaced",
  created() {
    let elements = JSON.parse(localStorage.getItem("times"));
    try {
      if (elements.length > 0) {
        this.currentTimes = elements;
        this.existsTimes = true;
      }
    } catch (error) {
      ///
    }
  },
  mounted() {
    this.getCurrentUser();

    this.queryOrders();
  },

  destroyed() {
    if (this.currentTimes.length > 0) {
      localStorage.setItem("times", JSON.stringify(this.currentTimes));
    }
  },
  data() {
    return {
      exitsOrders: false,
      existsTimes: false,
      isReady: false,
      user: {},
      showmap: false,
      orders: [],
      error: null,
      //Paginator
      currentPage: 1,
      currentTimes: [],
      paginate: ["orders"],
    };
  },
  methods: {
    queryOrders() {
      this.$apollo
        .query({
          query: require("@/graphql/deliveries/ordersPlaced.gql"),
        })
        .then((response) => {
    
          this.tansformQuery(response.data.allOrders.edges).then((value) => {
          
            if (value) {
              // this.getCompleteAddress();
              this.getDurationDistance().then(() => {
                this.isReady = true;
              });
            }
            else{
              this.exitsOrders=false;
            }

            //
          });
        });
    },
    getUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.destination.lat = position.coords.latitude;
          this.destination.lng = position.coords.longitude;
        });
      } else {
        console.log("No se ha podido acceder su ubicación");
      }
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
    async getDurationDistance() {
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
            if (response.rows[i].elements[i].status === "OK") {
              let elements = await response.rows[i].elements[i];
              this.orders[i].route.distance = elements.distance.text;
              this.orders[i].route.duration.durationFormatted =
                elements.duration.text;
              this.orders[i].route.duration.durationInSec =
                elements.duration.value;
            } else {
              this.error = "No results found";
            }
          }
        }
      );
      this.getEstimatedTime();
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

    trackOrder() {
      let flag = false;
      for (let idx in this.orders) {
        if (this.orders[idx].selected) {
          this.showmap = true;

          this.showRoute([this.orders[idx].route]);
          flag = true;
        }
      }
      if (!flag) {
        alert("Seleccione un pedido para ver la ruta y el tiempo estimado");
      }
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
            cost: "",
            selected: false,
            estimatedTime: { hours: "", min: "", sec: "" },
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
      hours = hours < 10 ? "0" + hours : hours;
      let minute = Math.floor((seconds / 60) % 60);
      minute = minute < 10 ? "0" + minute : minute;
      let second = seconds % 60;
      second = second < 10 ? "0" + second : second;
      return { hours: hours, min: minute, sec: second };
    },
    getCurrentUser() {
      this.user = JSON.parse(localStorage.getItem("user"));
    },
    getEstimatedTime() {
      for (const order of this.orders) {
        if (this.existsTimes) {
          order.estimatedTime = this.currentTimes.find(
            ({ id }) => id === order.id
          );
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
    },
    getCurrentTime(time) {
      let idx = this.currentTimes.findIndex((element, idx) => {
        if (element.id === time.id) {
          return true;
        }
      });
      if (idx >= 0) {
        this.currentTimes[idx] = time;
      } else {
        this.currentTimes.push(time);
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
.map {
  height: 25em;
  top: 0;
  right: 0;
  left: 0;
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



