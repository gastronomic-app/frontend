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
        aria-label="Username"
        aria-describedby="basic-addon1"
        v-model="address"
      />
    </div>

    <section id="map" class="containder map"></section>
    <br />
  </div>
</template>
<script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCkQNpJPrbKgjmDPbJCZjTEXw2rJ4bwyS0"></script>
<script>
export default {
  name: "Geolocation",

  data() {
    return {
      address: "",
      error: "",
    };
  },
  props: ["showinput", "showmap"],

  mounted() {
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        bounds: google.maps.LatLngBounds(
          new google.maps.LatLng(2.45, -76.6167)
        ),
      }
    );
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      console.log(place);
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
    getAddressFrom(lat, lon) {
      fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          lat +
          "," +
          lon +
          "&key=AIzaSyCkQNpJPrbKgjmDPbJCZjTEXw2rJ4bwyS0"
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            this.address = data.results[0].formatted_address;
            console.log(data.results[0].formatted_address);
          } else {
            console.log("Error");
          }
        })
        .catch((error) => {
          this.error = error.message;
          console.log(error.message);
        });
    },

    showUserLocation(lat, lon) {
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(lat, lon),
      });

      new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map,
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