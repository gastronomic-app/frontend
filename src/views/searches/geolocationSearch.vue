<template>
  <div>
    <nav class="navbar navbar-light bg-light">
      <form class="form-inline">
        <h1 class="text-center">Busqueda por geolocalización</h1>
      </form>
    </nav>

    <div v-if="$apollo.loading">
      <LoadingGraphql />
    </div>
    <div v-else-if="error" class="d-flex justify-content-center">
      <ConnectionErrorGraphql />
    </div>

    <div class="row">
      <div class="col">
        <div>
          <section id="map" class="containder map"></section>
        </div>

        <br />
      </div>
      <div v-if="enterprise != null" class="col-sm-4">
        <template>
          <EnterpriseCard :enterprise="enterprise" :key="enterprise.id" />
        </template>
        <br />
      </div>
    </div>
  </div>
</template>
<script src="https://maps.googleapis.com/maps/api/js?&libraries=places&key=AIzaSyAYFB5yvCJzaZy09_qPCONtoT6-pPmCkns"></script>
<script>
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";
import EnterpriseCard from "@/components/cards/EnterpriseCard.vue";

export default {
  name: "geolocationSearch",
  components: {
    LoadingGraphql,
    ConnectionErrorGraphql,
    EnterpriseCard,
  },
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allEnterprises: Object,
      // Variable que recibe el error de la consulta
      error: null,
      address: "",
      error: "",
      map: Object,
      enterprise: null,
    };
  },
  props: ["showinput", "showmap"],
  /**
   * Consulta simple que debe definir el mismo nombre en la sección data
   */
  async mounted() {
    if (
      null === localStorage.getItem("existUser") ||
      false === localStorage.getItem("existUser")
    ) {
      this.$router.push({ name: "catalogSearch" });
    } else {
      let user = JSON.parse(localStorage.getItem("user"));
      let location = user.location;
      await this.$apollo
        .query({
          // Consulta
          query: require("@/graphql/enterprise/allEnterprises.gql"),
        })
        .then((response) => {
          this.allEnterprises = response.data.allEnterprises.edges;
        });
      this.getCompleteAddress(location).then((value) => {
        this.showUserLocation(value.lat, value.lng);
      });
    }
  },
  created() {
    let vm = this;
    window.showAllEnterpise = function (enterprise) {
      vm.showAllEnterpise(enterprise);
      vm.enterprise = enterprise;
    };
  },
  methods: {
    MarkEnterprise() {
      this.allEnterprises.forEach((enterprise) => {
        if (enterprise.node.status) {
          this.getCompleteAddress(enterprise.node.location).then((value) => {
            this.showEnterpriseLocation(value.lat, value.lng, enterprise.node);
          });
        }
      });
    },
    async getCompleteAddress(address) {
      const geocoder = new google.maps.Geocoder();
      var completeAddress = {
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
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            let latitud = position.coords.latitude;
            let longitud = position.coords.longitude;
            this.getAddressFrom(latitud, longitud);
            this.showUserLocation(latitud, longitud);
          },
          (error) => {
            this.error = error.message;
          }
        );
      } else {
        console.log("Su navegador no soporta geolocation API");
      }
    },
    getAddressFrom(lat, lng) {
      const latlng = {
        lat: lat,
        lng: lng,
      };
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }, (response, status) => {
        if (status === "OK") {
          this.address = response[0].formatted_address;
          this.$emit("value", this.address);
        } else {
          console.log(status);
        }
      });
    },
    showAllEnterpise(enterprise) {
      this.enterprise = enterprise;
    },
    showEnterpriseLocation(lat, lon, enterprise) {
      const image = {
        url: "https://img.icons8.com/fluency/48/000000/restaurant-.png",
        size: new google.maps.Size(50, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32),
      };

      window.enterprise = enterprise;
      const contentString =
        `<center><font size='+2' color='#FF5733'>` +
        enterprise.name.toUpperCase() +
        `</font></center>
        <center><input type='submit' id='butSubmit' value='Ver negocio' onclick='showAllEnterpise(` +
        JSON.stringify(enterprise) +
        `)'></center>
        <div id='bar'></div>`;
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: this.map,
        icon: image,
      });
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      marker.addListener("click", () => {
        infowindow.open(marker.get("map"), marker);
      });
    },

    showUserLocation(lat, lon) {
      var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(lat, lon),
      });
      new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map,
      });
      this.map = map;
      this.MarkEnterprise();
    },
  },
};
</script>

<style>
.map {
  /* position:absolute; */
  background: whitesmoke;
  width: 300;
  height: 30em;
}
</style>
