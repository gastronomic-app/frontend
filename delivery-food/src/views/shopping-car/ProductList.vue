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
          v-on:click="btnComments()"
        >
          Opiniones (10)
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-7 mt-2">
        <h3>Realizar pedido</h3>

        <div
          class="row mr-1"
          style="background: #eec170; padding-top: 1%; margin-left: 1px"
        >
          <div class="col-sm-auto">
            <p>Nombre del producto</p>
          </div>
          <div class="col" style="padding: 0px">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="Buscar producto"
            />
          </div>

          <div class="col-sm-auto">
            <button
              type="submit"
              class="boton_pedido btn btn-outline-dark btn-sm"
            >
              Buscar
            </button>
          </div>
        </div>
        <!-- Seccion oferta productos-->
        <div class="row mt-2">
          <!--mientras carga-->
          <div class="container">
            <div class="row justify-content-center align-items-center">
              <div v-if="$apollo.loading" class="center">
                <LoadingGraphql />
                <p>Loading...</p>
              </div>
              <!--Cuando sucede un error-->
              <div v-else-if="error" class="d-flex justify-content-center mt-5">
                <ConnectionErrorGraphql />
              </div>
            </div>
          </div>
          <!-- <paginate name="products" :list="products" :per="2"> -->
          <div
            class="col-xl-4 col-md-6 col-sm-12"
            v-for="product in allProducts.edges"
            :key="product.node.id"
          >
            <CardProduct :product="product.node" />
            <div class="row">
              <div class="col">
                <span class="float-right">
                  <button
                    class="boton_pedido btn btn-outline-dark btn-sm mr-2 mt-2"
                    v-on:click="addItem(product)"
                  >
                    Añadir
                  </button>
                </span>
              </div>
            </div>
            <hr />
          </div>
          <br />
          <!-- </paginate> -->
        </div>
      </div>

      <!--Carrito-->

      <div class="col-5 mt-4" v-if="this.items.length > 1">
        <div class="card border-dark color_carro">
          <div class="row">
            <div class="col mt-3" style="text-align: left; margin-left: 10px">
              <span style="font-weight: bold">Mi pedido</span>
            </div>
            <div class="col mt-2" style="text-align: right">
              <label type="button" class="btn btn-xs" v-on:click="deleteCart()">
                <span>
                  <i
                    class="icon ion-md-trash lead align-middle pr-1 pl-1"
                    style="
                      color: #e48130;
                      background: white;
                      border-radius: 5px;
                      border: 2px solid #e48130;
                    "
                  ></i>
                </span>
              </label>
            </div>
          </div>
          <!--Items-->
          <div
            class=""
            v-for="(item, indice) of this.items"
            v-bind:key="item.id"
          >
            <div class="row ml-1 mt-1" v-if="indice != 0">
              <div
                class="col-sm-auto"
                style="
                  padding: 0px;
                  background: #fff;
                  border-radius: 5px;
                  border: 2px solid #e48130;
                  margin: 0px;
                "
              >
                <i
                  class="btn btn-sm"
                  v-on:click="decrementCounter(item.recoveredProduct.id)"
                >
                  -
                </i>

                {{ items[indice].counter }}

                <i
                  class="btn btn-sm"
                  v-on:click="incrementCounter(item.recoveredProduct.id)"
                >
                  +
                </i>
              </div>

              <div class="col" style="padding-right: 1%">
                {{ items[indice].recoveredProduct.name }}
              </div>
              <div class="col">
                {{ updateTotal(indice) }}
                <!-- {{ calculateEstimatedTime() }}-->
                {{
                  new Intl.NumberFormat().format(
                    items[indice].recoveredProduct.price * items[indice].counter
                  )
                }}
              </div>
              <div class="col-sm-2 mr-2" style="text-align: right">
                <label
                  type="button"
                  class="btn btn-sm"
                  v-on:click="deleteItem(item.recoveredProduct.id)"
                  style="color: #e37b2a"
                >
                  <strong>X</strong>
                </label>
              </div>
            </div>
          </div>
          <!--costos-->
          <br />
          <div class="row ml-1">
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
          <div class="container text-center">
            <button
              class="boton_pedido btn btn-sm btn-outline-dark mt-3"
              v-on:click="continueOrder()"
            >
              continuar
            </button>
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardProduct from "@/components/cards/CardProduct.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";

export default {
  name: "ProductList",
  components: {
    CardProduct,
    LoadingGraphql,
    ConnectionErrorGraphql,
  },
  data() {
    return {
      currentPage: 1,
      paginate: ["products"],
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allProducts: Object,

      items: [{ recoveredProduct: Object, counter: null }],
      total: 0,
      estimatedTime: 0,
      // Variable que recibe el error de la consulta
      error: null,
    };
  },
  methods: {
    addItem(product) {
      var bandera = false;
      console.log(product.node.id);
      if (this.items.length == 0) {
        this.items.push({ recoveredProduct: product.node, counter: 1 });
      } else {
        for (var index = 1; index < this.items.length; index++) {
          if (product.node.id == this.items[index].recoveredProduct.id) {
            this.items[index].counter++;
            bandera = true;
          }
        }
        if (bandera == false) {
          this.items.push({ recoveredProduct: product.node, counter: 1 });
        }
      }
      this.saveItems();
    },

    deleteItem(id) {
      console.log(id);

      for (var index = 1; index < this.items.length; index++) {
        if (id == this.items[index].recoveredProduct.id) {
          this.items.splice(index, 1);
          this.saveItems();
        }
      }
    },
    incrementCounter(id) {
      console.log(id);

      for (var index = 1; index < this.items.length; index++) {
        if (id == this.items[index].recoveredProduct.id) {
          this.items[index].counter++;
        }
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
    },
    /*calculateEstimatedTime() {
      var sumatoria = 0;
      for (var index = 1; index < this.items.length; index++) {
        sumatoria = sumatoria + this.items[index].producto.estimatedTime;
      }
      this.estimatedTime = sumatoria;
    },*/
    deleteCart() {
      if (window.confirm("¿Desea eliminar todos los items?")) {
        this.items.splice(1, this.items.length);
      }
    },
    continueOrder() {
      console.log("redirigir");
      this.$router.push({
        name: "OrderConfirmation",
        params: { listado: this.items },
      });
    },

    btnComments() {
      console.log("redirigir");
      this.$router.push({
        name: "CommentsList",
      });
    },

    itemExists() {
      if (this.items.nombreItem != "Pizza") {
        this.addItem();
      } else {
        this.incrimentarContador();
      }
      this.saveItems();
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
      const parsed = JSON.stringify(this.items);
      localStorage.setItem("items", parsed);
    },
  },
  apollo: {
    allProducts: {
      // Consulta
      query: require("@/graphql/product/allProducts.gql"),
      // Asigna el error a la variable definida en data
      error(error) {
        this.error = JSON.stringify(error.message);
      },
    },
  },
};
</script>

<style>
.pagination {
  height: 36px;
  margin: 18px 0;
  color: #6c58bf;
}

.pagination ul {
  display: inline-block;
  *display: inline;
  /* IE7 inline-block hack */
  *zoom: 1;
  margin-left: 0;
  color: #ffffff;
  margin-bottom: 0;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.pagination li {
  display: inline;
  color: var(--orange);
}

.pagination a {
  float: left;
  padding: 0 14px;
  line-height: 34px;
  color: var(--orange);
  text-decoration: none;
  border: 1px solid #ddd;
  border-left-width: 0;
}

.pagination a:hover,
.pagination .active a {
  background-color: var(--primary-x);
  color: #ffffff;
}

.pagination a:focus {
  background-color: var(--primary-x);
  color: #ffffff;
}

.pagination .active a {
  color: #ffffff;
  cursor: default;
}

.pagination .disabled span,
.pagination .disabled a,
.pagination .disabled a:hover {
  color: #999999;
  background-color: transparent;
  cursor: default;
}

.pagination li:first-child a {
  border-left-width: 1px;
  -webkit-border-radius: 3px 0 0 3px;
  -moz-border-radius: 3px 0 0 3px;
  border-radius: 3px 0 0 3px;
}

.pagination li:last-child a {
  -webkit-border-radius: 0 3px 3px 0;
  -moz-border-radius: 0 3px 3px 0;
  border-radius: 0 3px 3px 0;
}

.pagination-centered {
  text-align: center;
}

.pagination-right {
  text-align: right;
}

.pager {
  margin-left: 0;
  margin-bottom: 18px;
  list-style: none;
  text-align: center;
  color: var(--orange);
  *zoom: 1;
}

.pager:before,
.pager:after {
  display: table;
  content: "";
}

.pager:after {
  clear: both;
}

.pager li {
  display: inline;
  color: var(--orange);
}

.pager a {
  display: inline-block;
  padding: 5px 14px;
  color: var(--orange);
  background-color: #fff;
  border: 1px solid #ddd;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;
}

.pager a:hover {
  text-decoration: none;
  background-color: #f5f5f5;
}

.pager .next a {
  float: right;
}

.pager .previous a {
  float: left;
}

.pager .disabled a,
.pager .disabled a:hover {
  color: #999999;
}
.pagination > li > a {
  background-color: white;
  color: var(--orange);
}

.pagination > li > a:focus,
.pagination > li > a:hover,
.pagination > li > span:focus,
.pagination > li > span:hover {
  color: #5a5a5a;
  background-color: #eee;
  border-color: #ddd;
}

.pagination > .active > a {
  color: white;
  background-color: var(--orange) !important;
  border: solid 1px var(--orange) !important;
}

.pagination > .active > a:hover {
  background-color: var(--orange) !important;
  border: solid 1px var(--orange);
  color: var(--dark);
}
</style>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.btn-color {
  background-color: var(--dark-x);
  color: whitesmoke;
}

.div-paginate {
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
}

.div-width {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
.padding-label {
  padding-bottom: 2px;
}
.div {
  margin-left: 81%;
}
</style>
