<template>
  <div style="margin-top: 1em">
    <h3><b>Mis Pedidos</b></h3>

    <div v-if="$apollo.loading">
      <LoadingGraphql />
    </div>
    <div v-else-if="error" class="d-flex justify-content-center">
      <ConnectionErrorGraphql />
    </div>
    <paginate name="orders" :list="orders" :per="5">
      <template v-for="(order, idx) in paginated('orders')">
        <accordion :key="order.id" :item="order" :checkbox_use="true" :id="idx">
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
            <h5>Costo Total: ${{ order.cost }}</h5>
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

    <span v-if="orders.length > 0" class="container d-flex justify-content-end">
      <button type="button" class="btn btn-black" @click="trackOrder">
        Seguir Pedido
      </button>
    </span>
    <h4 v-else>
      No has realizado ningún pedido, <b>¡animate a comprar!</b>
      <not-found></not-found>
    </h4>
    <br />
    <div>
      <div class="container map" ref="map" v-show="showmap"></div>
    </div>
  </div>
</template>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkQNpJPrbKgjmDPbJCZjTEXw2rJ4bwyS0"></script>
<script>
import Accordion from "@/components/common/Accordion.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";
import NotFound from "@/components/common/NotFound.vue";
export default {
  components: { Accordion, LoadingGraphql, ConnectionErrorGraphql, NotFound },
  name: "OrdersPlaced",

  mounted() {
    this.queryOrders();
  },
  data() {
    return {
      user: {
        id: "Q2xpZW50Tm9kZToy", //"Q2xpZW50Tm9kZTo2",
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
        };
        route.origin = order.origin;
        route.destination = order.destination;

        this.getDurationDistance(route);

        this.routes.push(route);
      });
    },
    //TODO: agregar info necesaría a los obj orders a renderizar
    getCompleteAddress(address) {
      const geocoder = new google.maps.Geocoder();
      let completeAddress={}
      geocoder.geocode(
        {
          address: address,
        },
        (response, status) => {
           
          if (status === "OK") {

          completeAddress.address=response[0].formatted_address,
          completeAddress.lat=response[0].geometry.location.lat(),
          completeAddress.lng=response[0].geometry.location.lng()
          }
          
          }
      );
      return completeAddress
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
                content: `<i class ="bi-alarm-fill icon"></i> ${route.distance}-${route.duration}`,
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
    tansformQuery(data) {
      let allOrders = data.filter(
        (userId) => userId.node.client.id === this.user.id
      );

      allOrders.forEach((order) => {
        let newOrder = {
          id: order.node.id,
          date: order.node.date,
          products: [],
          enterprise: "",
          cost: "",
          selected: false,
          estimatedTime: order.node.estimatedTime,
          origin: {
            address: "Popayán,Cauca",
            lat: 2.4574702,
            lng: -76.6349537,
          },
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
          cost += parseInt(product.node.product.price * product.node.quantity);
          newOrder.enterprise = product.node.product.enterprise.name;
          newOrder.origin=this.getCompleteAddress(product.node.product.enterprise.location)
        });
        newOrder.cost = cost;
        
        newOrder.destination=this.getCompleteAddress(order.node.location)
      console.log(newOrder.destination.address )
        this.orders.push(newOrder);
      });
     
    },

    getCurrentUser() {},
  },
};
</script>

//General Component styles 
<style scope>
.centered {
  margin: auto;
  background-color: rgb(0, 66, 128);
  margin-left: 45%;
  margin-top: 3%;
}
.btn-black {
  background-color: black;
  color: whitesmoke;
}
.btn-black:hover {
  background-color: rgba(255, 102, 0, 0.521);
  color: black;
}
.color-text-tar {
  color: black;
}
.color-text-tar:hover {
  text-decoration: none;
  color: black;
}

.card-header:hover {
  background-color: rgba(235, 231, 228, 0.521);
  color: black;
}
.content-black {
  background-color: rgb(241, 238, 238);
  color: rgb(0, 0, 0);
}
.map {
  height: 25em;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: whitesmoke;
}
</style>
//Clouds over map
<style >
.gm-style-iw button {
  display: none !important;
}
</style>

//Pagination styles
<style >
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

