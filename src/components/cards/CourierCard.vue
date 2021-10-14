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
      <p class="card-text"><b>Email: </b>{{ courierInfo.email }}</p>
      <p class="card-text"><b> Teléfono: </b>{{ courierInfo.tel }}</p>

      <p class="card-text"><b> Ubicación: </b>{{ courierInfo.location }}</p>
      <p class="card-text">
        <b>Estado: </b>
        <span style="color: var(--orange)" v-show="courierInfo.isActive">
          {{ courierInfo.isAvailable }}
        </span>
        <span style="color: red" v-show="!courierInfo.isActive">
          Mensajero inactivo
        </span>
      </p>
    </div>
    <div class="container">
      <select
        class="btn btn-color"
        :class="{ btnred: !courierInfo.isActive }"
        @change="fn(id, courierInfo.isActive)"
      >
        <option :selected="courierInfo.isActive">Activo</option>
        <option :selected="!courierInfo.isActive">Inactivo</option>
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
  computed: {},

  data() {
    return {
      id: this.courierInfo.id,
      active: this.courierInfo.isActive,
    };
  },
  methods: {
    changeState() {
      this.active = !this.active;
    },
  },
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
  transition: width 1s;
  transition: height 1s;
}
.color-black:hover {
  box-shadow: 1em 1em 5em 1em gray;
  width: 20.7em;
  height: 28.5em;
}
.orange {
  color: orange;
}
select option:checked {
  background-color: var(--orange-x);
  margin: auto;
  padding: 0;
}
.btnred {
  background: rgb(163, 1, 1);
  color: white;
}
</style>
