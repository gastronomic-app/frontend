<template>
  <li id="counting" class="nav-item" v-show="ok">
    <a class="nav-link text-light font-weight-bold" v-on:click="order">
      <!-- <input id="car_2" type="text " :v-model="localStorage.getItem('car')" /> -->
      <h6 id="counting" class="count" v-if="total != 0">
        {{ total }}
      </h6>
      <b-icon
        icon="cart4"
        style="color: #e37b2a; width: 26; height: 26"
      ></b-icon>
    </a>
  </li>
</template>

<script>
export default {
  name: "CountCar",
  components: {},
  // props: {
  //   total: Number,
  // },
  data() {
    return {
      ok: "",
      total: 0,
    };
  },
  mounted() {
    if (localStorage.getItem("car")) {
      this.total = localStorage.getItem("car");
    }
    console.log("# " + this.total);
  },
  methods: {
    order() {
      var current_url = window.location.href;
      // console.log(current_url);
      var page = current_url.split("/");
      page = page[page.length - 1];
      //console.log(page);
      if (
        localStorage.getItem("idEnterprise") &&
        localStorage.getItem("enterpriseName")
      ) {
        //Evitar redigirir al lugar actual
        if (page != "products-order") {
          this.$router.push({
            name: "ProductListOrder",
            params: {
              id: localStorage.getItem("idEnterprise"),
              name: localStorage.getItem("enterpriseName"),
            },
          });
        }
      }
    },
  },
  created() {
    this.ok = localStorage.getItem("existUser");
  },
};
</script>

<style scoped>
.count {
  font-size: 80%;
  float: right;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  padding: 0px 2px 0px 2px;
  border: 2px solid var(--orange);
  color: var(--orange);
}
@media only screen and (max-width: 992px) {
  .count {
    font-size: 60%;
    margin-right: 46.7rem;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    padding: 1px 2px 1px 2px;
    border: 2px solid var(--orange);
    color: var(--orange);
    display: inline;
  }
}
</style>
