<template>
  <div class="container-fluid">
    <div class="row mt-3">
      <div class="col-6">
        <div class="row">
          <div class="col-lg-3">
            <img
              src="@/assets/enterprise.jpg"
              class="card-img-top"
              alt="logo establecimiento"
            />
          </div>
          <div class="col-sm-autor mt-3">
            <h3>Nombre del restaurante</h3>
          </div>
        </div>
      </div>
      <div class="col-6" style="text-align: right">
        <button
          type="submit"
          class="boton_pedido btn btn-outline-dark btn-sm"
          style="width: 140px"
        >
          Opiniones (10)
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-7 mt-2">
        <h4>Completa tu dirección de entrega</h4>
        <br />
        <b-row>
          <b-col sm="">
            <label for="formGroupExampleInput">Dirección</label>
          </b-col>
          <b-col>
            <select class="form-control form-control-sm" v-model="selected">
              <option disabled value="">Seleccione dirección</option>
              <option>Dirección del perfil</option>
              <option>Añadir dirección</option>
            </select>
          </b-col>
        </b-row>
        <br />
        <template v-if="selected === 'Añadir dirección'">
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
        <div class="container text-center">
          <button
            class="rounded-pill btn btn-sm btn-outline-dark"
            v-on:click="confirmOrder()"
          >
            Enviar pedido
          </button>
        </div>
        <br />
      </div>

      <div class="col-5 mt-4">
        <div class="card border-dark color_carro">
          <div class="row">
            <div class="col mt-3 container text-center">
              <span style="font-weight: bold">Mi pedido</span>
              <hr />
            </div>
          </div>
          <!--Items-->
          <div v-for="(item, indice) of this.items" v-bind:key="item.id">
            <div class="row ml-1 mt-1 ml-5" v-if="indice != 0">
              {{ items[indice].counter }}

              <div class="col" style="padding-right: 1%">
                {{ items[indice].recoveredProduct.name }}
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
          <hr />
          <div class="row ml-1 container text-center">
            <div class="col">
              <p style="text-align: left; margin-left: 2%">
                Envio <br />Sub-Total <br />
                <span style="font-weight: bold">Total</span>
              </p>
            </div>
            <div class="col">
              <p>
                $ {{ new Intl.NumberFormat().format(4000) }} <br />
                $ {{ new Intl.NumberFormat().format(this.total) }} <br />
                <span style="font-weight: bold"
                  >$
                  {{ new Intl.NumberFormat().format(this.total + 4000) }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Geolocation from "@/components/geolocation/Geolocation.vue";
export default {
  name: "OrderConfirmation",
  components: {
    Geolocation,
  },
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allProducts: Object,
      // Variable que recibe el error de la consulta
      items: [{ recoveredProduct: Object, counter: null }],
      ok: localStorage.getItem("existUser"),
      emailUser: "",
      nameClient: "",
      estimatedTime: 0,
      selected: "",
      location: "",
      clientId: "",
      quantity: 0,
      productId: "",
      orderId: "",
      total: 0,
      error: null,
    };
  },

  methods: {
    getLocation(value) {
      this.location = value;
    },
    update() {
      console.log("creacion");
      this.ok = localStorage.getItem("existUser");
      if (this.ok) {
        let user = JSON.parse(localStorage.getItem("user"));
        this.emailUser = user.email;
        this.location = user.location;
        this.nameClient = user.names;

        console.log("Datos:  ", user);
      }
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
      console.log(id);
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
    calculateEstimatedTime() {
      console.log("ingresando al metodo");
      var sumatoria = 0;
      for (var index = 1; index < this.items.length; index++) {
        sumatoria =
          sumatoria + this.items[index].recoveredProduct.estimatedTime;
      }
      this.estimatedTime = sumatoria;
    },
    confirmOrder() {
      this.calculateEstimatedTime();
      this.ok = localStorage.getItem("existUser");
      if (this.ok) {
        let user = JSON.parse(localStorage.getItem("user"));
        this.clientId = user.id;
        this.nameClient = user.names;
        this.emailUser = user.email;
        this.location = user.location;
      }
      console.log("Pasando por confirmando pedido");
      console.log("My location: ", this.location);

      this.$apollo
        .mutate({
          // Establece la mutación de crear
          mutation: require("@/graphql/order/createOrder.gql"),
          // Define las variables
          variables: {
            estimatedTime: this.estimatedTime,
            location: this.location,
            clientId: this.clientId,
          },
        })
        .then((response) => {
          this.orderId = response.data.createOrder.order.id;
          console.log("creación de detalle:", response.data);
          for (var index = 1; index < this.items.length; index++) {
            this.productId = this.items[index].recoveredProduct.id;
            this.quantity = this.items[index].counter;
            console.log("idorden", this.orderId);
            console.log("cantidad", this.quantity);
            console.log("idproducto", this.productId);

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
        });

      this.$router.push({ name: "ProductList" });
      localStorage.removeItem("items");
    },
  },
  mounted() {
    if (localStorage.getItem("items")) {
      try {
        this.items = JSON.parse(localStorage.getItem("items"));
      } catch (error) {
        localStorage.removeItem("items");
      }
    }
  },
  saveItems() {
    localStorage.setItem("items", JSON.stringify(this.items));
  },
  created() {
    this.items = this.$route.params.listado;
    //console.log("obtener id por url:", this.id);
  },
};
</script>
