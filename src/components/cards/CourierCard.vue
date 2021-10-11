<template>
  <div class="card bg-cart color-black">
    <img
      src=" /img/logo.d205f58e.png"
      class="card-img-top img-fluid"
      alt="'Imagen de mensajero '"
      style="width: 7rem; height: 7rem"
    />

    <div class="card-body container-md">
      <h5 class="card-title orange font-weight-bold">
        {{ courierInfo.names }} {{ courierInfo.last }}
      </h5>
      <p class="card-text">Email: {{ courierInfo.email }}</p>
      <p class="card-text">Teléfono: {{ courierInfo.tel }}</p>

      <p class="card-text">Ubicación: {{ courierInfo.location }}</p>
      <p class="card-text">
        Estado:
        <span style="color: var(--orange)" v-show="$refs.courierInfo.id">
          {{ courierInfo.isAvailable }}
        </span>
        <span style="color: red" v-show="!courierInfo.isActive">
          Mensajero inactivo
        </span>
      </p>
    </div>
    <div class="container">
      <select
      :ref="courierInfo.id"
        class="btn btn-success"
        @change="fn(courierInfo.id, courierInfo.isActive)"
      >
        <option v-if="courierInfo.isActive" selected="">Activo</option>
        <option v-else selected="">Inactivo</option>
        <option v-if="courierInfo.isActive">Inactivo</option>
        <option v-else>Activo</option>
      </select>

      <div class="dropdown-menu"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CourierCard",
  props: {
    fn: {
      type: Function,
    },
    courierInfo: {
      type: Object,
      default: () => {
        return {
          id: "12345",
          names: "Elza ",
          last: "Pato",
          email: "elza@courier.com",
          isActive: "Activo",
          isAvailable: "Disponible",
          tel: "315",
          location: "Ni de acá ni de allá",
          image: " /img/logo.d205f58e.png",
        };
      },
    },
  },

  data() {
    return {
      id: this.courierInfo.isActive,
    };
  },
  computed: {},
  methods: {},
};
</script>

<style scoped>
.card {
  margin: 1em auto;
  width: 20em;
  min-width: 15em;
  min-height: 28em;
  border-radius: 0.7em;
}
img {
  margin: 1.5em auto 0;
}
.container {
  display: flex;
  justify-content: space-around;
  margin: 1em auto;
}
.name-app {
  color: var(--primary-x);
}
.bg-cart {
  background-color: var(--dark-x);
}
.navbar-orange-text {
  color: var(--orange);
}
.color-black {
  color: white;
}
.orange {
  color: orange;
}
</style>
