<template>
  <div class="container-fluid">
    <Enterprise
      :name="enterpriseName"
      :enterprise="enterpriseNode"
      section="Completa tu dirección de entrega"
    ></Enterprise>

    <div class="row">
      <div class="col-lg-7 col-sm-12 mt-2">
        <div class="form-group row mb-0">
          <label class="col-sm-auto col-form-labe">Dirección</label>
          <div class="col-sm">
            <select
              class="form-control form-control-sm"
              name="locationOption"
              v-model="selected"
            >
              <option disabled value="">Seleccione dirección</option>
              <option>Dirección del perfil</option>
              <option>Añadir dirección</option>
            </select>
          </div>
        </div>
        <br />
        <template>
          <template v-if="selected === 'Añadir dirección'">
            {{ resetLocation() }}
            <Geolocation v-on:value="getLocation" showmap="True"></Geolocation>
          </template>
          <template v-if="selected === 'Dirección del perfil'">
            {{ update() }}
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <button class="input-group-text btn btn-dark">
                  <b-icon icon="geo-alt-fill"></b-icon>
                </button>
              </div>
              <input
                id="autocomplete"
                type="text"
                class="form-control"
                placeholder="Direccion perfil"
                readonly="true"
                v-model="location"
              />
            </div>
          </template>
        </template>
        <div class="container text-center">
          <button class="btn btn_order btn-sm" v-on:click="confirmOrder()">
            Enviar pedido
          </button>
        </div>
        <br />
      </div>

      <div class="col-lg-5 col-xs-12">
        <div class="card border-dark mb-2 car">
          <div class="row">
            <div class="col mt-3 container text-center">
              <span style="font-weight: bold">Mi pedido</span>
              <hr style="background-color: var(--orange)" />
            </div>
          </div>
          <!--Items-->
          <div v-for="(item, indice) of this.items" v-bind:key="item.id">
            <div class="row ml-1 mt-1 ml-5" v-if="indice != 0">
              {{ items[indice].counter }}

              <div class="col" style="padding-right: 1%">
                {{ items[indice].recoveredProduct.name | capitalize }}
              </div>
              <div class="col">
                {{ updateTotal(indice) }}
                {{
                  new Intl.NumberFormat().format(
                    items[indice].recoveredProduct.price * items[indice].counter
                  )
                }}
              </div>
            </div>
          </div>
          <!--costos-->
          <hr style="background-color: var(--orange)" />
          <TotalOrder :total="this.total"></TotalOrder>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Geolocation from "@/components/geolocation/Geolocation.vue";
import TotalOrder from "@/components/order/TotalOrder.vue";
import Enterprise from "@/components/order/Enterprise.vue";
export default {
  name: "OrderConfirmation",
  components: {
    Geolocation,
    TotalOrder,
    Enterprise,
  },
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allProducts: Object,
      // Variable que recibe el error de la consulta
      enterpriseNode: Object,
      items: [{ recoveredProduct: Object, counter: null }],
      ok: localStorage.getItem("existUser"),
      enterpriseName: "",
      emailUser: "",
      nameClient: "",
      selected: "",
      location: "",
      clientId: "",
      quantity: 0,
      productId: "",
      orderId: "",
      total: 0,
      envio: 3000,
      error: null,
    };
  },
  mounted() {
    if (localStorage.getItem("idEnterprise")) {
      this.idRecovered = localStorage.idEnterprise;
    }
    if (localStorage.getItem("enterpriseName")) {
      this.enterpriseName = localStorage.enterpriseName;
    }
    if (localStorage.getItem("items")) {
      try {
        this.items = JSON.parse(localStorage.getItem("items"));
      } catch (error) {
        localStorage.removeItem("items");
      }
    }
  },
  methods: {
    getLocation(value) {
      if (this.validateAddress(value)) {
        this.location = value[0];
      } else {
        this.makeToast(
          "danger",
          "Error",
          "Lo sentimos. No tenemos cobertura para tu zona",
          4000
        );
      }
    },
    validateAddress(value) {
      if (this.enterpriseNode.city == value[1]) {
        return true;
      }
      return false;
    },
    update() {
      this.ok = localStorage.getItem("existUser");
      if (this.ok) {
        let user = JSON.parse(localStorage.getItem("user"));
        this.emailUser = user.email;
        this.location = user.location;
        this.nameClient = user.names;
      }
    },
    validateAddressProfile() {
      if (this.location.split(",")[1] == this.enterpriseNode.city) {
        return true;
      }
      this.makeToast(
        "danger",
        "Error",
        "Lo sentimos. No tenemos cobertura para tu zona",
        3000
      );
      return false;
    },
    updateTotal() {
      var sumatoria = 0;
      for (var index = 1; index < this.items.length; index++) {
        sumatoria =
          sumatoria +
          this.items[index].recoveredProduct.price * this.items[index].counter;
      }
      this.total = sumatoria;
    },

    deleteItem(id) {
      for (var index = 1; index < this.items.length; index++) {
        if (id == this.items[index].recoveredProduct.id) {
          this.items.splice(index, 1);
        }
      }
      this.saveItems();
    },
    incrementCounter(id) {
      for (var index = 1; index < this.items.length; index++) {
        if (id == this.items[index].recoveredProduct.id) {
          this.items[index].counter++;
        }
      }
      this.saveItems();
    },

    decrementCounter(id) {
      for (var index = 1; index < this.items.length; index++) {
        if (
          id == this.items[index].recoveredProduct.id &&
          this.items[index].counter < 2
        ) {
          this.items.splice(index, 1);
        } else {
          if (
            id == this.items[index].recoveredProduct.id &&
            this.items[index].counter >= 2
          ) {
            this.items[index].counter--;
          }
        }
      }
      this.saveItems();
    },
    deleteCart() {
      if (window.confirm("¿Desea eliminar todos los items?")) {
        this.items.splice(1, this.items.length);
      }
      this.saveItems();
    },

    validate() {
      if (this.selected === "") {
        this.makeToast("danger", "Error", "Seleccione un tipo de dirección", 3000);
        return false;
      }
      if (this.selected == "Dirección del perfil") {
        return this.validateAddressProfile();
      }
      if (this.selected == "Dirección del perfil") {
        return this.validateAddress();
      }
      if (this.location.length == 0) {
        this.makeToast(
          "danger",
          "Error",
          "Ingrese una dirección o seleccione una en el mapa",
          3000
        );
        return false;
      }
      return true;
    },
    resetLocation() {
      this.location = "";
    },
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },
    confirmOrder() {
      this.$store.dispatch(
        "setStorageCountAction",
        parseInt(localStorage.getItem("car"))
      );

      if (this.validate()) {
        this.$store.dispatch("setStorageCountAction", 0);
        this.ok = localStorage.getItem("existUser");
        if (this.ok) {
          let user = JSON.parse(localStorage.getItem("user"));
          this.clientId = user.id;
          this.nameClient = user.names;
          this.emailUser = user.email;
        }

        this.$apollo
          .mutate({
            // Establece la mutación de crear
            mutation: require("@/graphql/order/createOrder.gql"),
            // Define las variables
            variables: {
              estimatedTime: "0",
              location: this.location,
              clientId: this.clientId,
            },
          })
          .then((response) => {
            this.orderId = response.data.createOrder.order.id;
            for (var index = 1; index < this.items.length; index++) {
              this.productId = this.items[index].recoveredProduct.id;
              this.quantity = this.items[index].counter;

              this.$apollo
                .mutate({
                  // Establece la mutación de crear
                  mutation: require("@/graphql/detail/createDetail.gql"),
                  // Define las variables
                  variables: {
                    quantity: this.quantity,
                    productId: this.productId,
                    orderId: this.orderId,
                  },
                })
                .then((response) => {
                  console.log("creación de detalle:", response.data);
                  //agrega aquí más lógica si es necesaria"
                });
            }
            this.makeToast(
              "success",
              "Éxito",
              "¡Su pedido fue tomado exitosamente!",
              3500
            );
          });

        this.$router.push({ name: "catalogSearch" });
        localStorage.removeItem("items");
        localStorage.removeItem("envio");
        localStorage.removeItem("total");
        localStorage.removeItem("enterpriseName");
        localStorage.removeItem("idEnterprise");
        localStorage.removeItem("car");
      }
    },
  },

  saveItems() {
    localStorage.setItem("items", JSON.stringify(this.items));
  },
  async created() {
    this.items = this.$route.params.listado;
    this.enterpriseName = this.$route.params.enterpriseName;
    if (this.$route.params.enterpriseNode == undefined) {
      await this.$apollo
        .query({
          // Consulta
          query: require("@/graphql/enterprise/allEnterprises.gql"),
        })
        .then((response) => {
          this.Enterprises = response.data.allEnterprises.edges;
        });

      this.Enterprises.forEach((element) => {
        if (element.node.name == localStorage.getItem("enterpriseName")) {
          this.enterpriseNode = element.node;
        }
      });
    } else {
      this.enterpriseNode = this.$route.params.enterpriseNode;
    }
  },
};
</script>
<style scoped>
.car {
  background-color: var(--dark);
  color: var(--light);
}
.btn_order {
  background-color: var(--orange-x);
  color: var(--dark);
}
.btn_order:hover {
  background: var(--orange-x-hover);
  color: var(--dark);
}
.btn_order:focus {
  box-shadow: 0 0 0 2px var(--orange-x-focus), 0 0 0 0px var(--orange-x-hover);
}
</style>
