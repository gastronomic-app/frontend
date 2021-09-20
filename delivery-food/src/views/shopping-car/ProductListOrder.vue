<template>
  <div class="container">
    <!--Sección comentarios-->
    <div class="row mt-2">
      <!-- <div class="col-6">
        <div class="row">
          <div class="col-lg-4 pl-0">
            <img
              src="@/assets/enterprise.jpg"
              class="card-img-top"
              alt="logo establecimiento"
            />
          </div>
          <div class="col-sm-autor mt-4">
            <h3>Nombre del restaurante</h3>
          </div>
        </div>
      </div> -->
      <Enterprise
        name="Nombre del restaurante"
        image="@/assets/alien.png"
      ></Enterprise>
      <div class="col-6 mt-4" style="text-align: right">
        <button
          type="submit"
          class="btn btn-outline-dark btn-sm"
          style="width: 140px"
          v-on:click="btnComments()"
        >
          Opiniones (10)
        </button>
      </div>
    </div>

    <SubTitle content="Realizar pedido"></SubTitle>

    <!--Sección productos ofertados-->
    <div class="row">
      <div class="col-7">
        <!--Sección busqueda producto-->
        <div class="form-group row">
          <label class="col-sm-2 col-form-label pl-0">Buscar</label>
          <div class="col-sm-10 pl-0">
            <input
              type="text"
              class="form-control"
              v-model="searchString"
              placeholder="Nombre del producto"
            />
          </div>
        </div>

        <div v-if="$apollo.loading">
          <LoadingGraphql />
        </div>
        <div v-else-if="error" class="d-flex justify-content-center">
          <ConnectionErrorGraphql />
        </div>
        <div class="row" v-if="allProducts.edges !== undefined">
          <div
            class="col-xl-4 col-md-6 col-sm-12 pl-0"
            v-for="product in allProducts.edges.filter(
              (element) =>
                element.node.productType.includes(leaveType) &&
                element.node.name.includes(searchString.toLowerCase())
            )"
            :key="product.node.id"
          >
            <div v-if="product.node.images.edges[0] !== undefined">
              <template>
                <ProductCard
                  :product="product.node"
                  :image="product.node.images.edges[0].node"
                />
                <div class="row mt-2">
                  <div class="col">
                    <span class="float-right">
                      <button
                        type="button"
                        class="btn btn-outline-dark btn-sm"
                        data-toggle="modal"
                        data-target="#viewProductModal"
                        @click="showProduct(product.node.id)"
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-dark btn-sm ml-2"
                        v-on:click="addItem(product)"
                      >
                        Añadir
                      </button>
                    </span>
                  </div>
                </div>
                <hr />
              </template>
            </div>
          </div>
        </div>
      </div>
      <!--Carrito-->

      <div class="col-5" v-if="this.items.length > 1">
        <div class="card border-dark">
          <div class="row">
            <div class="col mt-3" style="text-align: left; margin-left: 10px">
              <span style="font-weight: bold">Mi pedido</span>
            </div>
            <div class="col mt-2" style="text-align: right">
              <label
                type="button"
                class="btn btn-xs"
                data-toggle="modal"
                data-target="#deleteConfirmationModal"
              >
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
          <!-- <TotalOrder :total="this.total" :envio="this.envio"></TotalOrder> -->
          <div class="row ml-1">
            <div class="col">
              <p style="text-align: left; margin-left: 2%">
                Envio <br />Sub-Total <br />
                <span style="font-weight: bold">Total</span>
              </p>
            </div>
            <div class="col">
              <p>
                $ {{ new Intl.NumberFormat().format(envio) }} <br />
                $ {{ new Intl.NumberFormat().format(total) }} <br />
                <span style="font-weight: bold"
                  >$ {{ new Intl.NumberFormat().format(total + envio) }}</span
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

    <!-- Modals -->
    <!-- Delete confirmation Modal -->
    <div
      class="modal fade"
      id="deleteConfirmationModal"
      data-backdrop="static"
      data-keyboard="false"
      tabindex="-1"
      aria-labelledby="deleteConfirmationModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteConfirmationModalLabel">
              Eliminar carrito
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Está a punto de eliminar todo su pedido ¿Desea continuar?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-dark"
              data-dismiss="modal"
            >
              Cerrar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              v-on:click="deleteCart()"
              data-dismiss="modal"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--Product preview  modal-->
    <div class="modal" id="viewProductModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ productView.name | capitalize }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img class="d-block w-100" :src="productView.imageUrl" />
            <p><b>Precio:</b> ${{ productView.price }}</p>
            <p>
              <b>Ingredientes:</b> {{ productView.ingredients | capitalize }}
            </p>
            <p>
              <b>Preparación:</b> {{ productView.preparation | capitalize }}
            </p>
            <p><b>Tiempo:</b> {{ productView.preparation_time }}</p>
            <p>
              <b>Tipo de producto:</b>
              {{ productView.product_type | capitalize }}
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/order/CardProduct.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";
import SubTitle from "@/components/cards/SubTitles.vue";
import Enterprise from "@/components/order/Enterprise.vue";
// import TotalOrder from "@/components/order/TotalOrder.vue";

export default {
  name: "ProductListOrder",
  components: {
    ProductCard,
    LoadingGraphql,
    ConnectionErrorGraphql,
    SubTitle,
    Enterprise,
    // TotalOrder,
  },
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allProducts: Object,

      items: [{ recoveredProduct: Object, counter: null }],
      total: 0,
      envio: 4000,
      estimatedTime: 0,
      // Variable que recibe el error de la consulta
      error: null,

      leaveType: "",
      searchString: "",
      productToDelete: "",
      productsTypes: [
        [
          "Comidas rapidas",
          [
            ["Hamburguesa", "HAMBURGUESA"],
            ["Pizza", "PIZZA"],
            ["Sandwich", "SANDWICH"],
            ["Pollo", "POLLO"],
            ["Carne", "CARNE"],
            ["Otra Comida Rapida", "OTRA_RAPIDA"],
          ],
        ],
        [
          "Comidas Tradicionales",
          [
            ["Mexicana", "MEXICANA"],
            ["Asiatica", "ASIATICA"],
            ["Italiana", "ITALIANA"],
            ["Colombiana", "COLOMBIANA"],
            ["Otra Comida Tradicional", "OTRA_TRADICIONAL"],
          ],
        ],
        [
          "Saludables",
          [
            ["Ensalada", "ENSALADA"],
            ["Vegana", "VEGANA"],
          ],
        ],
        [
          "Bebidas",
          [
            ["Gaseosa", "GASEOSA"],
            ["Jugo o Batido", "JUGO_O_BATIDO"],
            ["Alcoholica", "ALCOHOLICA"],
            ["Infusion", "INFUSION"],
          ],
        ],
      ],

      productView: {
        name: "",
        price: "",
        ingredients: "",
        preparation: "",
        preparation_time: "",
        product_type: "",
        imageUrl: "",
      },
    };
  },
  mounted() {
    if (localStorage.getItem("items")) {
      try {
        this.items = JSON.parse(localStorage.getItem("items"));
        if (localStorage.envio) {
          this.envio = parseFloat(localStorage.envio);
        }
        if (localStorage.total) {
          this.total = parseFloat(localStorage.total);
        }
      } catch (error) {
        this.deleteVariables();
      }
    }
  },
  methods: {
    showProduct(idProduct) {
      var producto = this.allProducts.edges.filter(
        (element) => element.node.id == idProduct
      )[0].node;

      this.productView.name = producto.name;
      this.productView.price = String(producto.price);
      this.productView.ingredients = producto.ingredients;
      this.productView.preparation = producto.preparation;
      this.productView.preparation_time = String(producto.estimatedTime);
      this.productsTypes.forEach((groupType) => {
        groupType[1].forEach((type) => {
          if (type[1] == producto.productType) {
            this.productView.product_type = type[0];
          }
        });
      });
      this.productView.imageUrl = producto.images.edges[0].node.url;
    },

    addItem(product) {
      var bandera = false;
      //console.log(product.node.id);
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
      for (var index = 1; index < this.items.length; index++) {
        if (id == this.items[index].recoveredProduct.id) {
          this.items.splice(index, 1);
          this.saveItems();
        }
      }
    },
    incrementCounter(id) {
      for (var index = 1; index < this.items.length; index++) {
        if (id == this.items[index].recoveredProduct.id) {
          this.items[index].counter++;
        }
      }
      this.saveItems();
    },
    updateTotal() {
      var sumatoria = 0;
      for (var index = 1; index < this.items.length; index++) {
        sumatoria =
          sumatoria +
          this.items[index].recoveredProduct.price * this.items[index].counter;
      }
      this.total = sumatoria;
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
      //if (window.confirm("¿Desea eliminar todos los items?")) {
      this.items.splice(1, this.items.length);
      localStorage.removeItem("items");
      this.deleteVariables();
      //}
    },
    continueOrder() {
      //console.log("redirigir");
      this.$router.push({
        name: "OrderConfirmation",
        params: { listado: this.items },
      });
    },

    btnComments() {
      //console.log("redirigir");
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
    },

    deleteVariables() {
      localStorage.removeItem("items");
      localStorage.removeItem("envio");
      localStorage.removeItem("total");
    },
    saveItems() {
      const parsed = JSON.stringify(this.items);
      localStorage.setItem("items", parsed);
      this.persist();
    },
    persist() {
      localStorage.envio = this.envio;
      localStorage.total = this.total;
    },
  },
  /**
   * Consulta simple que debe definir el mismo nombre en la sección data
   */
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
