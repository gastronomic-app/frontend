<template>
  <div class="container" style="margin-top: 1em">
    <h3><b>Mis Pedidos</b></h3>

    <div v-if="$apollo.loading">
      <LoadingGraphql />
    </div>
    <div v-else-if="error" class="d-flex justify-content-center">
      <ConnectionErrorGraphql />
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
              <h5>Lugar de entrega: {{ order.destination.address }}</h5>
              <h5 >
                Tu pedido llegara en: <b style="color: var(--orange)"><Countdown sec="10" min="0" hour="0" /></b>
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
      <h4 v-show="exitsOrders">
        No has realizado ningún pedido, <b>¡animate a comprar!</b>
        <not-found></not-found>
      </h4>
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

  mounted() {
    this.queryOrders();
     
  },
  data() {
    return {
      exitsOrders: false,

      user: {
        id: "Q2xpZW50Tm9kZToxOQ==", //"Q2xpZW50Tm9kZToy", //"Q2xpZW50Tm9kZTo2",
      },
      showmap: false,
      routes: [],
      orders: [],
      error: null,
      //Pagination
      currentPage: 1,
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
          this.tansformQuery(response.data.allOrders.edges);
          
        });
    },
    getUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.destination.lat = position.coords.latitude;
          this.destination.lng = position.coords.longitude;
          //this.getAddressFrom(this.destination.lat, this.destination.lng);
          this.getDataLocal();
        });
      } else {
        console.log("No se ha podido acceder su ubicación");
      }
    },
    getRoutes() {
      this.orders.forEach((order) => {
        let route = {
          origin: {
            address: "",
            lat: 0,
            lng: 0,
          },
          destination: {
            address: "",
            lat: 0,
            lng: 0,
          },

          distance: "",
          duration: "",
          durationInSec: "",
        };
        route.origin = order.origin;
        route.destination = order.destination;

      this.getDurationDistance(route);
        this.routes.push(route);
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
        (response, status) => {
          if (status === "OK") {
            (completeAddress.address = response[0].formatted_address),
              (completeAddress.lat = response[0].geometry.location.lat()),
              (completeAddress.lng = response[0].geometry.location.lng());
          }
        }
      );

      return completeAddress;
    },

    getDurationDistance(route) {
      const distanceMatrix = new google.maps.DistanceMatrixService();
      distanceMatrix.getDistanceMatrix(
        {
          origins: [{ lat: route.origin.lat, lng: route.origin.lng }],
          destinations: [
            { lat: route.destination.lat, lng: route.destination.lng },
          ],
          travelMode: "DRIVING",
        },
        (response) => {
          if (response.rows[0].elements[0].status === "OK") {
            let elements = response.rows[0].elements[0];
            route.distance = elements.distance.text;
            route.duration = elements.duration.text;
            route.durationInSec = elements.duration.value;
          } else {
            this.error = "No results found";
          }
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
            origin: { lat: route.origin.lat, lng: route.origin.lng },
            destination: {
              lat: route.destination.lat,
              lng: route.destination.lng,
            },
            travelMode: "DRIVING",
          },
          (response, status) => {
            if (status === "OK") {
              const directionsRenderer = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
              });

              const originLabel = new google.maps.InfoWindow({
                content: `<i class ="bi-geo-alt-fill alternate icon"></i> ${route.origin.address}`,
                position: new google.maps.LatLng(
                  route.origin.lat,
                  route.origin.lng
                ),
              });

              originLabel.open(map, null);
              const destinationLabel = new google.maps.InfoWindow({
                content: `<i class ="bi-flag-fill checkered icon"> </i> ${route.destination.address}`,
                position: new google.maps.LatLng(
                  route.destination.lat,
                  route.destination.lng
                ),
              });

              destinationLabel.open(map, null);

              const overviewPath = response.routes[0].overview_path;
              const middleIndex = parseInt(overviewPath.length / 2);

              const middleLoc = overviewPath[middleIndex];
              const distanceDurationLabel = new google.maps.InfoWindow({
                content: `<i class ="bi-alarm-fill icon"></i> ${route.duration}`,
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
      this.getRoutes();
      let flag = false;
      for (let idx in this.orders) {
        if (this.orders[idx].selected) {
          this.showmap = true;
          this.showRoute([this.routes[idx]]);
          flag = true;
        }
      }
      if (!flag) {
        alert("Seleccione un pedido para ver la ruta y el tiempo estimado");
      }
    },
    async tansformQuery(data) {
      let allOrders = data.filter(
        (userId) => userId.node.client.id === this.user.id
      );
      if (allOrders.length > 0) {
        allOrders.forEach((order) => {
          let newOrder = {
            id: order.node.id,
            date: order.node.date,
            products: [],
            enterprise: "",
            cost: "",
            selected: false,
            estimatedTime: {},
            duration: "",
            origin: {},
            destination: {},
          };

          let cost = 0;
          order.node.details.edges.forEach((product) => {
            newOrder.products.push({
              id: product.node.product.id,
              name: product.node.product.name,
              quantity: product.node.quantity,
              cost: product.node.product.price,
            });
            cost += parseInt(
              product.node.product.price * product.node.quantity
            );
            newOrder.enterprise = product.node.product.enterprise.name;
            this.getCompleteAddress(
              product.node.product.enterprise.location
            ).then((value) => {
              newOrder.origin = value;
            });
          });
          newOrder.cost = cost;

          this.getCompleteAddress(order.node.location).then((value) => {
            newOrder.destination = value;
            this.orders.push(newOrder);
          });
        });
       
        //this.countDown()
      } else {
        this.exitsOrders = false;
      }
    },
    //Return the estimated time for any order in hours, minutes and seconds
    getEstimatedTime(preparation, delivery) {
      let secTotal =( preparation * 60 )+ delivery;
      console.log(secTotal)
    },
    secondsToString(seconds) {
      var hour = Math.floor(seconds / 3600);
      hour = hour < 10 ? "0" + hour : hour;
      var minute = Math.floor((seconds / 60) % 60);
      minute = minute < 10 ? "0" + minute : minute;
      var second = seconds % 60;
      second = second < 10 ? "0" + second : second;
      return { hour:hour, min: minute,sec: second}
    },

    getCurrentUser() {},
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



