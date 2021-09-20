<template>
  <div class="col-6">
    <div class="row">
      <div class="col-lg-4 pl-0">
        <img :src="image" class="card-img-top" :alt="'logo ' + name" />
      </div>
      <div class="col-sm-autor mt-4">
        <h3>{{ name | capitalize }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Enterprise",
  props: {
    name: String,
    image: String,
  },
  methods: {
    ver() {
      console.log("Ruta recibida: " + this.image);
    },
  },
};
</script>
