<template>
  <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button class="input-group-text btn btn-dark" @click="getUserLocation">
          <b-icon icon="geo-alt-fill"></b-icon>
        </button>
      </div>
      <input
        id="autocomplete"
        type="text"
        class="form-control"
        placeholder="Ingrese su dirección"
        v-model="address"
      />
    </div>
    <div v-show="showmap">
       <section id="map" class="containder map" ></section>

    </div>
   
    <br />
  </div>
</template>
<script src="https://maps.googleapis.com/maps/api/js?&libraries=places&key=AIzaSyAYFB5yvCJzaZy09_qPCONtoT6-pPmCkns"></script>
<script>
export default {
  name: "Geolocation",

  data() {
    return {
      address: "",
      error: "",
      map: Object,
    };
  },
  props: ["showinput", "showmap"],

  mounted() {
    this.showUserLocation(2.45, -76.6167);
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        bounds: google.maps.LatLngBounds(
          new google.maps.LatLng(2.45, -76.6167)
        ),
      }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      this.showUserLocation(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    });
  },
  methods: {
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
          this.$emit ('value',this.address)
        } else {
          console.log(status);
        }
      });
    },

    showUserLocation(lat, lon) {
      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(lat, lon),
      });
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: this.map,
      });

      this.map.addListener("click", (event) => {
        marker.setPosition(event.latLng);
        let direction = this.getAddressFrom(
          event.latLng.lat(),
          event.latLng.lng()
        );
        
        if (direction != undefined) {
          document.getElementById("autocomplete").value = direction;
        }
      });
      
    },
  },
};
</script>
<style>
.map {
  /* position:absolute; */
  background: whitesmoke;
  width: 100;
  height: 20em;
}
</style>