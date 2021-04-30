<template>
  <div>
    <h3>Mis Pedidos</h3>
    <template v-for="(pedido, idx) in pedidos">
      <accordion :key="pedido.id" :item="pedido" :checkbox_use="true" :id="idx">
        <div class="card-body">
          <strong> Detalles de pedido</strong>
          <b> Productos:</b> <br />
          {{ pedido.productos }}<br />
          <b> Establecimiento: </b> <br />
          {{ pedido.establecimiento }} <br />
          <b> Costo: </b> <br />
          {{ pedido.costo }}
        </div>
      </accordion>
    </template>
    <br>

    <span class="container d-flex justify-content-end">
      <button type="button" class="btn btn-black  " @click="trackOrder">
        Seguir Pedido
      </button>
    </span>
    <br>
    <div class="container map" ref="map" v-show="showmap"></div>
  </div>
</template>
<script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCkQNpJPrbKgjmDPbJCZjTEXw2rJ4bwyS0"></script>

<script>
import Accordion from "@/components/common/Accordion.vue";

export default {
  components: { Accordion },
  name: "OrdersPlaced",

  mounted() {
    this.getUserPosition();
  },
  data() {
    return {
      showmap: false,
      duration: "",
      distance: "",

      routes: [],
      destination: {
        address: "Cra. 1d Este ## 16 - 52, El Bordo, Patía, Cauca",
          lat: 2.1087322,
          lng: -76.9855849,
      },
      pedidos: [
        {
          id: "1",
          productos: "Alitas BBQ, Gaseosa 1.5 litros",
          establecimiento: "Delicias",
          costo: "$24.000",
          selected: false,
          origin: {
             address: "Popayán,Cauca",
             lat: 2.4574702,
             lng: -76.6349537,
           },
        },
        // {
        //   id: "2",
        //   productos: "Sancocho de gallina",
        //   establecimiento: "Doña Pepa",
        //   costo: "$18.000",
        //   selected: false,
        //   origin: {
        //     address: "Popayán,Cauca",
        //     lat: 2.4574702,
        //     lng: -76.6349537,
        //   },
        // },

        // {
        //   id: "3",
        //   productos: "Arepas de choclo, Queso cuajada bien caliente",
        //   establecimiento: "Queseria de mì",
        //   costo: "$8000",
        //   selected: false,
        //   origin: {
        //     address: "Cra. 1d Este ## 16 - 52, El Bordo, Patía, Cauca",
        //     lat: 2.1087322,
        //     lng: -76.9855849,
        //   },
        // },
      ],
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
      this.pedidos.forEach((pedido) => {
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
        route.origin = pedido.origin;
        route.destination = this.destination;
        this.getDurationDistance(route);

        route.duration = this.duration;
        route.distance = this.distance;
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
      const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=${route.origin.lat},${route.origin.lng}&destinations=${route.destination.lat},${route.destination.lng}&key=AIzaSyCkQNpJPrbKgjmDPbJCZjTEXw2rJ4bwyS0`;
      await fetch(URL)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            let elements = data.rows[0].elements[0];

            route.distance = elements.distance.text;
            route.duration = elements.duration.text;
          } else {
            this.error = "No results found";
          }
        })
        .catch((error) => {
          console.log(error.message);
          this.error = error.message;
        });
    },
    showRoute(routes) {
      const directionsService = new google.maps.DirectionsService();
      const map = new google.maps.Map(this.$refs["map"], {
        center: new google.maps.LatLng(2.45, -76.6167),
        zoom: 18,
        mapTyeId: google.maps.MapTypeId.ROADMAP,
      });
      routes.forEach((route) => {
        console.log(route.duration);
        console.log(route.distance);
        directionsService.route(
          {
            origin: route.origin.address,
            destination: route.destination.address,
            travelMode: "DRIVING",
          },
          (response, status) => {
            if (status === "OK") {
              const directionsRenderer = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
              });

              const originLabel = new google.maps.InfoWindow({
                content: `<i class ="marker alternate icon"></i> ${route.origin.address}`,
                position: new google.maps.LatLng(
                  route.origin.lat,
                  route.origin.lng
                ),
              });

              originLabel.open(map, null);
              const destinationLabel = new google.maps.InfoWindow({
                content: `<i class ="flag checkered icon"></i> ${route.destination.address}`,
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
                content: `<i class ="car icon"></i> ${route.distance}-${route.duration}`,
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
      for (let idx in this.pedidos) {
        if (this.pedidos[idx].selected) {
          this.showmap = true;
          this.showRoute([this.routes[idx]]);
          flag = true;
        }
      }
      if (!flag) {
        alert("Seleccione un pedido para ver la ruta y el tiempo estimado");
      }
      
    },
  },
};
</script>

<style scoped>
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
  background-color: teal;
}
</style>