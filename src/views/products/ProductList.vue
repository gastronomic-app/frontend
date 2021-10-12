<template>
  <div class="about">
    <div class="row">
      <div class="col-md-3 bg-cart color-black search-side">
        <div class="form-group">
          <div class="row mt-3 correct-align">
            <h3 class="text-center">Busqueda</h3>
            <input
              type="text"
              class="form-control mb-2"
              v-model="searchString"
              placeholder="Nombre del producto"
            />

            <div>
              <button
                @click="leaveType = ''"
                type="button"
                class="btn btn-link orange"
              >
                Todos los productos
              </button>
              <div
                class="text-center"
                v-for="groupType in productsTypes"
                :key="groupType[0]"
              >
                <h5 class="mt-4">{{ groupType[0] }}</h5>
                <button
                  v-for="type in groupType[1]"
                  v-on:click="leaveType = type[1]"
                  type="button"
                  class="btn btn-link btn-block m-0 p-0 text-left orange"
                  :key="type[0]"
                >
                  {{ type[0] }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <div class="col-md-10">
        <h1 class="text-center">
          Lista de productos - {{ this.nameEnterprise }}
        </h1>
        <br />
        <button
          type="button"
          class="
            btn
            black-button
            btn-lg
            orange
            font-weight-bold
            btn-block
            bg-cart
          "
          @click="redirectProductAdd"
        >
          Crear Producto
        </button>
        <button
          type="button"
          class="
            btn
            black-button
            btn-lg
            orange
            font-weight-bold
            btn-block
            bg-cart
          "
          @click="redirectEnterpriseList"
        >
          Volver a la lista de establecimientos
        </button>
        <br />
        <div v-if="$apollo.loading">
          <LoadingGraphql />
        </div>
        <div v-else-if="error" class="d-flex justify-content-center">
          <ConnectionErrorGraphql />
        </div>
        <div class="row" v-if="allProducts.edges !== undefined">
          <div
            class="col-xl-4 col-md-6 col-sm-12"
            v-for="product in allProducts.edges.filter(
              (element) =>
                element.node.productType.includes(leaveType) &&
                element.node.name.includes(searchString.toLowerCase()) &&
                element.node.enterprise.id == this.idEnterprise
            )"
            :key="product.node.id"
          >
            <template>
              <ProductCard
                :product="product.node"
                :image="
                  product.node.images.edges[0] !== undefined
                    ? product.node.images.edges[0].node.url
                    : 'https://icones.pro/wp-content/uploads/2021/04/icone-de-nourriture-orange-symbole-png.png'
                "
              />
              <br />
              <button
                type="button"
                class="btn btn-dark btn-sm mr-4 orange-button"
                @click="redirectProductEdit(product.node.id)"
              >
                Editar
              </button>
              <button
                type="button"
                class="btn black-button btn-sm mr-4"
                data-toggle="modal"
                data-target="#deleteConfirmationModal"
                @click="stateToChange = product.node.id"
              >
                {{ product.node.active ? "Deshabilitar" : "Habilitar" }}
              </button>
              <button
                type="button"
                class="btn black-button btn-sm"
                data-toggle="modal"
                data-target="#viewProductModal"
                @click="showProduct(product.node.id)"
              >
                Ver
              </button>
              <hr />
            </template>
          </div>
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
              Cambiar estado de producto
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
            Está a punto de cambiar el estado de un producto ¿Desea continuar?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn black-button" data-dismiss="modal">
              Cerrar
            </button>
            <button
              type="button"
              class="btn orange-button"
              @click="changeState(stateToChange)"
              data-dismiss="modal"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--Product preview  modal-->
    <div class="modal" id="viewProductModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-cart color-black">
          <div class="modal-header">
            <h5 class="modal-title orange font-weight-bold">
              {{ productView.name | capitalize }}
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
            <img class="d-block w-100" :src="
        productView.imageUrl.substring(0, 5) === 'https'
          ? productView.imageUrl
          : 'https://res.cloudinary.com/dcbzwrn30/image/upload/v1/' + productView.imageUrl
          " />
            <p><b>Precio:</b> ${{ productView.price }}</p>
            <p>
              <b>Ingredientes:</b> {{ productView.ingredients | capitalize }}
            </p>
            <p>
              <b>Preparación:</b> {{ productView.preparation | capitalize }}
            </p>
            <p><b>Tiempo:</b> {{ productView.preparation_time }} minutos</p>
            <p>
              <b>Tipo de producto:</b>
              {{ productView.product_type | capitalize }}
            </p>
            <h4 v-if="this.recommendation_list.length > 0" class="orange">
              Acompañamientos:
            </h4>
            <ol
              id="lista-recomendaciones"
              class="list-group list-group-numbered"
            >
              <li
                v-for="recommendation in this.recommendation_list"
                class="
                  list-group-item
                  d-flex
                  justify-content-between
                  align-items-start
                  bg-cart
                  color-black
                  outlineOrange
                "
                :key="recommendation.node.id"
              >
                <div class="ms-2 me-auto">
                  <div class="fw-bold">{{ recommendation.node.name }}</div>
                </div>
                <span
                  class="
                    badge
                    bg-outline-primary
                    rounded-pill
                    orange-background
                    text-black
                  "
                  >$ {{ recommendation.node.price }}</span
                >
              </li>
            </ol>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-dark orange bg-cart"
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
import ProductCard from "@/components/cards/ProductCard.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";

export default {
  name: "ProductsList",
  components: {
    ProductCard,
    LoadingGraphql,
    ConnectionErrorGraphql,
  },
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allProducts: Object,
      // Variable que recibe el error de la consulta
      error: null,

      leaveType: "",
      searchString: "",
      idEnterprise: "",
      nameEnterprise: "",
      stateToChange: "",
      recommendation_list: [],

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
  async mounted() {
    if (localStorage.getItem("user")) {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user.type === "MANAGER") {
        this.idEnterprise = this.$route.params.idEnt;
        await this.$apollo
          .query({
            query: require("@/graphql/user/usersenterprise.gql"),
            variables: {
              email: user.email,
            },
          })
          .then((response) => {
            if (
              response.data.allManagers.edges[0].node.enterprises.edges.length >
              0
            ) {
              let enterprise =
                response.data.allManagers.edges[0].node.enterprises.edges.filter(
                  (element) => element.node.id == this.idEnterprise
                );
              if (enterprise.length > 0) {
                enterprise = enterprise[0].node;
                localStorage.idEnterprise = enterprise.id;
                localStorage.nameEnterprise = enterprise.name;
                this.idEnterprise = localStorage.getItem("idEnterprise");
                this.nameEnterprise = localStorage.getItem("nameEnterprise");
              } else {
                this.$router.push({ name: "EnterpriseList" });

                setTimeout(() => {
                  this.makeToast(
                    "warning",
                    "Lista de productos",
                    "No tiene permiso para administrar los productos de este establecimiento.",
                    6000
                  );
                }, 500);
              }
            } else {
              this.$router.push({ name: "EnterpriseList" });

              setTimeout(() => {
                this.makeToast(
                  "warning",
                  "Lista de productos",
                  "No tiene permiso para administrar los productos de este establecimiento.",
                  6000
                );
              }, 500);
            }
          });
      } else {
        this.$router.push({ name: "EnterpriseList" });

        setTimeout(() => {
          this.makeToast(
            "warning",
            "Lista de productos",
            "No puede realizar esta acción con su rol actual.",
            6000
          );
        }, 500);
      }
    } else {
      this.$router.push({ name: "EnterpriseList" });

      setTimeout(() => {
        this.makeToast(
          "warning",
          "Lista de productos",
          "Debe ingresar como usuario administrador del establecimiento.",
          6000
        );
      }, 500);
    }
  },
  methods: {
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },
    redirectProductAdd() {
      this.$router.push({
        name: "ProductAdd",
        params: {
          idEnt: this.idEnterprise,
        },
      });
    },
    /**
     * Redirige a la vista de editar empresa
     * pasando el id de la empresa por parametro en la url
     */
    redirectProductEdit(idProduct) {      

      this.$router.push({
        name: "ProductEdit",
        params: { id: idProduct, idEnt: this.idEnterprise },
      });
    },
    /**
     * Elimina una empresa y actualiza el cache con refetchQueries
     */
    async changeState(idProduct) {      
      await this.$apollo.mutate({
        // Establece la consulta a realizar
        mutation: require("@/graphql/product/changeState.gql"),
        // Define la variable
        variables: {
          id: idProduct,
        },
        // Actualiza el cache de GraphQL para visualizar la eliminación
        // al momento de cargar la vista
        refetchQueries: [
          { query: require("@/graphql/product/allProducts.gql") },
        ],
      });
      this.makeToast(
        "success",
        "Cambio de estado de producto",
        "El producto ha cambiado su estado.",
        4000
      );
    },
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
      this.fillRecommendations(idProduct);      
    },
    fillRecommendations(Item) {
      let producto = this.allProducts.edges.filter(
        (element) => element.node.id == Item
      )[0].node;

      this.recommendation_list = [];      
      producto.accompaniments.edges.forEach((product) => {
        if (product.node.active) {
          this.recommendation_list.push(product);
        }
      });
    },
    redirectEnterpriseList() {
      this.$router.push({
        name: "EnterpriseList",
      });
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

<style scoped>

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
.search-side {
  left: -113px;
  margin-right: -98px;
}
.correct-align {
  padding-left: 15px;
  padding-right: 15px;
}
.orange-button {
  background-color: orange;
  color: black;
  font-weight: bold;
}

.black-button {
  background-color: black;
  color: white;
  font-weight: bold;
}
.orange-background {
  background-color: orange;
}
.text-black {
  color: black;
}
.outlineOrange {
  border-inline-color: orange;
}

.orange-button:hover,
.black-button:hover {
  box-shadow: 0 4px 16px rgb(201, 132, 30);
  transition: all 0.2s ease;
}
</style>
