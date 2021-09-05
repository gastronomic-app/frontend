<template>
  <div>
    <h3>Mis Pedidos</h3>

      <div v-if="$apollo.loading">
        <LoadingGraphql />
      </div>
      <div v-else-if="error" class="d-flex justify-content-center">
        <ConnectionErrorGraphql />
      </div>
    <template v-for="(order, idx) in orders">
      <accordion :key="order.id" :item="order" :checkbox_use="true" :id="idx">
        <div class="card-body">
          <h4>Resumen de pedido <br /></h4>
          <h5>Productos: {{ order.products }}</h5>
          <h5>Establecimiento: {{ order.enterprise }}</h5>
          <h5>Lugar de entrega: {{ order.location }}</h5>
          <h5>Costo: {{ order.cost }}</h5>
        </div>
      </accordion>
    </template>
    <br />

    <span class="container d-flex justify-content-end">
      <button type="button" class="btn btn-black" @click="trackOrder">
        Seguir Pedido
      </button>
    </span>
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
export default {
  components: { Accordion, LoadingGraphql,ConnectionErrorGraphql },
  name: "OrdersPlaced",

  mounted() {
    this.$apollo
      .query({
        query: require("@/graphql/deliveries/ordersPlaced.gql"),
      })
      .then((response) => {
        this.tansformQuery(response.data.allUsers.edges);
      });
  },
  data() {
    return {
      user: {
        id: "VXNlck5vZGU6Mg==",
      },
      showmap: false,
      routes: [],
      orders: [
        {
          id: "1",
          products: "",
          enterprise: "",
          cost: "$",
          selected: false,
          duration: "",
          distance: "",
          origin: {
            address: "Popayán,Cauca",
            lat: 2.4574702,
            lng: -76.6349537,
          },
          destination: {
            address: "Cra. 1d Este ## 16 - 52, El Bordo, Patía, Cauca",
            lat: 2.1087322,
            lng: -76.9855849,
          },
        },
      ],
      error:null
    };
  },
  methods: {
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
    getDataLocal() {
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
    //TODO: Tomar cada latitud y longitud y pasarla a Places API para obtener el address exacto
    async getAddressFrom(lat, lon) {
      const URL =
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat +
        "," +
        lon +
        "&key=AIzaSyCkQNpJPrbKgjmDPbJCZjTEXw2rJ4bwyS0";
      await fetch(URL)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            console.log(data);
          } else {
            console.log("No fue posible obtener el lugar");
          }
        })
        .catch((error) => {
          this.error = error.message;
          console.log(error.message);
        });
    },

    async getDurationDistance(route) {
      const distanceMatrix = new google.maps.DistanceMatrixService();
      distanceMatrix.getDistanceMatrix(
        {
          origins: [{ lat: route.origin.lat, lng: route.origin.lng }],
          destinations: [
            { lat: route.destination.lat, lng: route.destination.lng },
          ],
          travelMode: 'DRIVING',
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
          destination:  { lat: route.destination.lat, lng: route.destination.lng },
          travelMode: 'DRIVING',
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
      this.getDataLocal();
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
      let allOrders = data.filter((userId) => userId.node.id === this.user.id);
      allOrders[0].node.orders.edges.forEach((order) => {
        //console.log(order);
      });
    },
    getCurrentUser() {},
  },
};
</script>

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
  background-color:whitesmoke;
}


</style>
<style >
.gm-style-iw button{
  display: none !important;
}

</style>