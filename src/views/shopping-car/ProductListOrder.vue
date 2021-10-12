<template>
  <div class="container-fluid">
    <Enterprise
      :name="enterpriseName"
      :enterprise="enterpriseNode"
      section="Realizar pedido"
    ></Enterprise>

    {{ showProductEnterprise() }}

    <!--Sección productos ofertados-->
    <div class="row">
      <div class="col-xl-7 col-xs-12">
        <!--Sección busqueda producto-->
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">Buscar</label>
          <div class="col-sm-10 pl-0">
            <input
              type="text"
              class="form-control search mb-1"
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

        <div class="row" v-if="list_products_enterprise !== undefined">
          <div
            class="col-xl-4 col-lg-3 col-md-4 col-sm-12"
            v-for="product in list_products_enterprise.filter(
              (element) =>
                element.node.productType.includes(leaveType) &&
                element.node.name.includes(searchString.toLowerCase()) &&
                element.node.active == true
            )"
            :key="product.node.id"
          >
            <div
              class="contentProduct"
              v-if="product.node.images.edges[0] !== undefined"
            >
              <template>
                <ProductCard :product="product.node" />

                <div class="row mt-2">
                  <div class="col">
                    <span class="float-right mr-2">
                      <button
                        type="button"
                        class="btn btn_order btn-sm"
                        data-toggle="modal"
                        data-target="#viewProductModal"
                        @click="showProduct(product.node.id)"
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        class="btn btn_order btn-sm ml-2"
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

      <div class="col-xl-5 col-xs-12" v-if="this.items.length > 1">
        <div class="card border-dark car-border car mb-2">
          <div class="row">
            <div class="col-sm mt-3" style="text-align: left; margin-left: 1em">
              <h5><b>Mi pedido</b></h5>
            </div>
            <div class="col-sm mt-2 mr-3" style="text-align: right">
              <label
                type="button"
                class="btn btn-sm"
                data-toggle="modal"
                data-target="#deleteConfirmationModal"
              >
                <span>
                  <i
                    class="
                      icon
                      ion-md-trash
                      lead
                      align-middle
                      pr-1
                      pl-1
                      alignment
                      btn_order1
                    "
                  ></i>
                </span>
              </label>
            </div>
          </div>
          <!--Items-->
          <div v-for="(item, indice) of this.items" v-bind:key="item.id">
            <div class="row ml-2 mt-1" v-if="indice != 0">
              <div class="col-sm outer-border">
                <b
                  class="btn btn-sm orange"
                  v-on:click="decrementCounter(item.recoveredProduct.id)"
                >
                  -
                </b>

                {{ items[indice].counter }}

                <b
                  class="btn btn-sm orange"
                  v-on:click="incrementCounter(item.recoveredProduct.id)"
                >
                  +
                </b>
              </div>

              <div class="col-sm" style="padding-right: 1%">
                {{ items[indice].recoveredProduct.name | capitalize }}
              </div>
              <div class="col-sm">
                {{ updateTotal(indice) }}
                {{
                  new Intl.NumberFormat().format(
                    items[indice].recoveredProduct.price * items[indice].counter
                  )
                }}
              </div>
              <div class="col-sm-2">
                <label
                  type="button"
                  class="btn orange btn_order1 p-0"
                  v-on:click="deleteItem(item.recoveredProduct.id)"
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
                Envio Minimo <br />Sub-Total <br />
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
              class="btn btn_order btn-sm mt-3"
              v-on:click="continueOrder(enterpriseNode)"
            >
              continuar
            </button>
          </div>
          <br />
        </div>
        <h3>Recomendaciones</h3>
        <div>
          <ol id="lista-recomendaciones" class="list-group list-group-numbered">
            <li
              v-for="recommendation in this.recommendation_list"
              class="
                list-group-item
                d-flex
                justify-content-between
                align-items-start
              "
              :key="recommendation.node.id"
            >
              <div class="ms-2 me-auto">
                <div class="fw-bold">{{ recommendation.node.name }}</div>
                Ingredientes: {{ recommendation.node.ingredients }}
              </div>
              <span
                class="badge bg-outline-primary rounded-pill orange-background"
                >$ {{ recommendation.node.price }}</span
              >
            </li>
          </ol>
        </div>
        <br />
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
            <button type="button" class="btn btn_order" data-dismiss="modal">
              Cerrar
            </button>
            <button
              type="button"
              class="btn btn_order"
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
            <img
              class="d-block w-100"
              :src="
                productView.imageUrl.substring(0, 5) === 'https'
                  ? productView.imageUrl
                  : 'https://res.cloudinary.com/dcbzwrn30/image/upload/v1/' +
                    productView.imageUrl
              "
            />
            <div class="row">
              <div class="table-responsive">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <th scope="row">Precio</th>
                      <td>
                        $
                        {{ new Intl.NumberFormat().format(productView.price) }}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Ingredientes</th>
                      <td>{{ productView.ingredients | capitalize }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Preparación</th>
                      <td>{{ productView.preparation | capitalize }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Tiempo</th>
                      <td>{{ productView.preparation_time }} minutos</td>
                    </tr>
                    <tr>
                      <th scope="row">Tipo de producto</th>
                      <td>{{ productView.product_type | capitalize }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn_order" data-dismiss="modal">
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
import Enterprise from "@/components/order/Enterprise.vue";
// import TotalOrder from "@/components/order/TotalOrder.vue";

export default {
  name: "ProductListOrder",
  components: {
    ProductCard,
    LoadingGraphql,
    ConnectionErrorGraphql,
    Enterprise,
    // TotalOrder,
  },
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allProducts: Object,
      enterpriseNode:Object,
      items: [{ recoveredProduct: Object, counter: null }],
      total: 0,
      envio: 3000,
      estimatedTime: 0,
      counting: 0,
      idRecovered: "",
      enterpriseName: "",
      prods: [],
      paginate: ["products"],
      recommendation_list: [],
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
    if (localStorage.getItem("idEnterprise")) {
      this.idRecovered = localStorage.idEnterprise;
    }

    if (localStorage.getItem("enterpriseName")) {
      this.enterpriseName = localStorage.enterpriseName;
    }

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
    showProductEnterprise() {
      var list_products_enterprise = [];

      for (const key in this.allProducts.edges) {
        if (
          this.allProducts.edges[key].node.enterprise.id == this.idRecovered
        ) {
          list_products_enterprise.push(this.allProducts.edges[key]);
        }
      }
      this.list_products_enterprise = list_products_enterprise;
    },

    showProduct(idProduct) {
      var producto = this.list_products_enterprise.filter(
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
    fillRecommendations(Item) {
      let producto = this.allProducts.edges.filter(
        (element) => element.node.id == Item
      )[0].node;

      this.recommendation_list = [];
      console.log(producto);
      producto.accompaniments.edges.forEach((product) =>
        this.recommendation_list.push(product)
      );
    },
    addItem(product) {
      var bandera = false;
      if (localStorage.getItem("existUser")) {
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
        this.fillRecommendations(product.node.id);
        this.saveItems();
        this.$store.dispatch("incrementCountAction");
        localStorage.car = this.$store.getters.getCount;
      } else {
        /*this.$router.push({
          name: "Login",
        });*/ window.location = "/login";
      }
    },

    deleteItem(id) {
      for (var index = 1; index < this.items.length; index++) {
        if (id == this.items[index].recoveredProduct.id) {
          this.$store.dispatch("setCountAction", this.items[index].counter);
          localStorage.car = this.$store.getters.getCount;
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
      this.$store.dispatch("incrementCountAction");
      localStorage.car = this.$store.getters.getCount;
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
      this.$store.dispatch("decrementCountAction");
      localStorage.car = this.$store.getters.getCount;
    },

    deleteCart() {
      this.items.splice(1, this.items.length);
      localStorage.removeItem("items");
      this.deleteVariables();
      this.$store.dispatch("setStorageCountAction", 0);
      localStorage.car = 0;
    },
    continueOrder(enterprise) {
      this.$router.push({
        name: "OrderConfirmation",
        params: { listado: this.items, enterpriseName: this.enterpriseName,enterpriseNode:enterprise},
      });
    },
    deleteVariables() {
      localStorage.removeItem("items");
      localStorage.removeItem("envio");
      localStorage.removeItem("total");
      localStorage.removeItem("car");
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

  async created() {
    if (
      localStorage.getItem("idEnterprise") == "" &&
      localStorage.getItem("enterpriseName") == ""
    ) {
      this.idRecovered = this.$route.params.id;
      this.enterpriseName = this.$route.params.name;
      //Guardar en localStorage datos recuperados.
      localStorage.idEnterprise = this.idRecovered;
      localStorage.enterpriseName = this.enterpriseName;
      
    }
    if(this.$route.params.enterpriseNode==undefined){
    await this.$apollo
                .query({
                  // Consulta
                  query: require("@/graphql/enterprise/allEnterprises.gql"),
                })
                .then((response) => {
                  this.Enterprises = response.data.allEnterprises.edges;
                  //this.pages = response.data.allEnterprises.edges.length;
                });

              this.Enterprises.forEach(element => {
                if(element.node.name==localStorage.getItem("enterpriseName")){
                  this.enterpriseNode=element.node;
                }
              });
    }else{
      this.enterpriseNode=this.$route.params.enterpriseNode;
    }

  },
};
</script>

<style scoped>
.bold {
  font-weight: bold;
}
.btn_order {
  /*background-color: var(--dark-xx);
  color: var(--orange);
  background-color: #E85D0C;
  color: var(--dark);*/
  background-color: var(--orange-x);
  color: var(--dark);
}
.btn_order:hover {
  /*background: var(--grey-hover);*/
  background: var(--orange-x-hover);
  color: var(--dark);
}
.btn_order:focus {
  box-shadow: 0 0 0 2px var(--orange-x-focus), 0 0 0 0px var(--orange-x-hover);
}
.contentProduct {
  background-color: var(--dark-x);
  /*background-color: #0d0d0d;*/
  padding-bottom: 0%;
  border-radius: 5px;
}
.car {
  background-color: var(--dark-x);
  color: var(--light);
}
.search {
  background: var(--muted);
}
.alignment {
  color: var(--orange-x);
  background: var(--dark);
  border-radius: 5px;
  border: 2px solid var(--orange-x);
}
.alignment:hover {
  color: var(--orange-x-hover);
  background: var(--dark);
  border-radius: 5px;
  border: 2px solid var(--orange-x-hover);
}
.orange {
  color: var(--orange-x);
  font-size: large;
}
.orange:hover {
  color: var(--orange-x-hover);
  font-size: large;
}
.outer-border {
  border-radius: 5px;
  border: 2px solid var(--orange);
  margin: 0px;
  padding: 0px;
}
@media only screen and (max-width: 575px) {
  .outer-border {
    border-radius: 5px;
    border: 2px solid var(--orange);
    margin-right: 20rem;
  }
}

/* Paginación */
.container {
  display: flex;
  justify-content: center;
}

.div-paginate {
  margin: 0 auto;
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

