<template>
  <div>
    <div
      class="input-group mb-3 input-container"
      :style="{ width: input_width }"
    >
      <div class="input-group-prepend">
        <button
          class="input-group-text btn btn-dark"
          type="button"
          @click="getUserLocation"
        >
          <b-icon icon="geo-alt-fill"></b-icon>
        </button>
      </div>
      <input
        :disabled="disable_input"
        ref="autocomplete"
        type="text"
        class="form-control"
        :placeholder="placeholder"
        v-model="address"
      />
    </div>
    <div v-show="showmap" :style="{ width: map_width, height: map_height }">
      <section ref="map" class="containder map"></section>
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
      address: "", //variable donde se guardará la dirección formateada
      error: "",
      map: Object, //Objeto de google maps para el mapa
      city: "",
    };
  },
  props: {
    showinput: { type: Boolean, default: true },
    showmap: { default: false },
    placeholder: { type: String, default: "Ingrese su dirección" },
    map_height: {},
    map_width: {},
    input_width: {},
    disable_input: { type: Boolean, default: false },
  }, //Showinput: Muestra un elemento input html- showmap: true para mostrar el mapa; false de lo contrario
  mounted() {
    this.showUserLocation(2.45, -76.6167);
    const autocomplete = new google.maps.places.Autocomplete(
      this.$refs.autocomplete,
      {
        componentRestrictions: { country: ["co"] }, // Limitar solo Colombia
        bounds: google.maps.LatLngBounds(
          new google.maps.LatLng(2.45, -76.6167)
        ),
      }
    );
    const input = this.$refs.autocomplete;
    input.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
        event.preventDefault();
        return false;
      }
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      this.address = place.formatted_address;
      this.returnValue();
      this.getAddressFrom(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      this.showUserLocation(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    });
    input.addEventListener("input", () => {
      this.returnValue();
    });
  },
  methods: {
    //Se captura la ubicación (lat y lng) del usuario solo si el mismo permite acceder a la unicación
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
      //Objeto con la dirección formateada calculada a partir de una lat y una lng
      const geocoder = new google.maps.Geocoder();
      //Se obtiene la dirección formateada y se almmacena en "address"
      geocoder.geocode({ location: latlng }, (response, status) => {
        if (status === "OK") {
          this.address = response[0].formatted_address;
          if (response[0].address_components.length != 1) {
            let localityObject = response[0].address_components.filter((obj) => {
            return obj.types.includes('administrative_area_level_2');})[0];
          if (!localityObject?.long_name) {
            localityObject = response[0].address_components.filter((obj) => {
            return obj.types.includes('administrative_area_level_1');})[0];
          }
          this.city = localityObject.long_name;
          }else{
            this.city = false;
          }
          //Se emite el evento con la inforación de la dirección formateada
          this.returnValue();
        } else {
          console.log(status);
        }
      });
    },
    showUserLocation(lat, lon) {
      //Creación del objeto map
      this.map = new google.maps.Map(this.$refs.map, {
        zoom: 15,
        center: new google.maps.LatLng(lat, lon),
      });
      //Marcador que se dibujara al obtener la ubicacion o dar click sobre un lugar del mapa
      let marker = new google.maps.Marker({
        componentRestrictions: { country: ["co"] }, // Limitar solo Colombia
        position: new google.maps.LatLng(lat, lon),
        map: this.map,
      });
      //Evento para dar click en una region del mapa
      this.map.addListener("click", (event) => {
        marker.setPosition(event.latLng);
        let direction = this.getAddressFrom(
          event.latLng.lat(),
          event.latLng.lng()
        );
        if (direction != undefined) {
          //Se muestra la direccion obtenida en el input
          this.$refs.autocomplete.value = direction;
        }
      });
    },
    returnValue() {
      this.$emit("value", [this.address, this.city]);
    },
  },
};
</script>
<style>
.map {
  /* position:absolute; */
  background: whitesmoke;
  width: 100%;
  height: 20em;
}
.input-container {
  margin-top: 1rem;
}
</style>
