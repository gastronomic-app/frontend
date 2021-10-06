<template>
  <li id="counting" class="nav-item" v-show="ok">
    <a class="nav-link text-light font-weight-bold" v-on:click="order">
      <b-icon icon="cart4" class="icon-cart"></b-icon>
      <h6 id="counting" class="count" v-if="$store.getters.getCount != 0">
        {{ $store.getters.getCount }}
      </h6>
    </a>
  </li>
</template>

<script>
export default {
  name: "CountCar",
  components: {},
  data() {
    return {
      ok: "",
      total: 0,
    };
  },
  mounted() {
    if (localStorage.getItem("existUser")) {
      this.ok = localStorage.getItem("existUser");
    } else {
      this.$store.dispatch("setStorageCountAction", 0);
    }
    if (localStorage.getItem("car")) {
      this.total = parseInt(localStorage.getItem("car"));
      this.$store.dispatch("setStorageCountAction", this.total);
    }
  },
  methods: {
    order() {
      if (localStorage.getItem("existUser")) {
        var current_url = window.location.href;
        var page = current_url.split("/");
        page = page[page.length - 1];
        if (page != "products-order") {
          if (page != "" && this.$store.getters.getCount == 0) {
            this.$router.push({
              name: "catalogSearch",
            });
          } else {
            this.$router.push({
              name: "ProductListOrder",
              params: {
                id: localStorage.getItem("idEnterprise"),
                name: localStorage.getItem("enterpriseName"),
              },
            });
          }
        }
      } else {
        this.$router.push({ name: "Login" });
      }
    },
  },
  created() {
    this.ok = localStorage.getItem("existUser");
  },
};
</script>

<style scoped>
.espace {
  width: 20%;
}
.icon-cart {
  color: var(--orange-x);
  width: 50;
  height: 50;
  float: left;
}
.icon-cart:hover {
  color: var(--orange-x-hover);
  width: 26;
  height: 26;
}
.count {
  text-align: center;
  width: 30px;
  font-size: 80%;
  float: left;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  padding: 0px 2px 0px 2px;
  border: 2px solid var(--orange-x);
  color: var(--orange-x);
}
.count:hover {
  font-size: 80%;
  float: right;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  padding: 0px 2px 0px 2px;
  border: 2px solid var(--orange-x-hover);
  color: var(--orange-x-hover);
}

@media only screen and (max-width: 985px) {
  .count {
    font-size: 60%;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    padding: 1px 2px 1px 2px;
    border: 2px solid var(--orange-x);
    color: var(--orange-x);
    display: inline;
  }
}
</style>
