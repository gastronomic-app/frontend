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
        <h1 class="text-center">Lista de productos</h1>
        <br />
        <button
          type="button"
          class="btn btn-dark btn-lg orange font-weight-bold btn-block bg-cart"
          @click="redirectProductAdd"
        >
          Crear Producto
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
                element.node.active == true
            )"
            :key="product.node.id"
          >
            <div v-if="product.node.images.edges[0] !== undefined">
              <template>
                <ProductCard
                  :product="product.node"
                  :image="product.node.images.edges[0].node"
                />
                <br />
                <button
                  type="button"
                  class="btn btn-outline-success btn-sm mr-4"
                  @click="redirectProductEdit(product.node.id)"
                >
                  Editar
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm mr-4"
                  data-toggle="modal"
                  data-target="#deleteConfirmationModal"
                  @click="productToDisable = product.node.id"
                >
                  Deshabilitar
                </button>
                <button
                  type="button"
                  class="btn btn-outline-dark btn-sm"
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
              Deshabilitar producto
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
            Está a punto de deshabilitar un producto ¿Desea continuar?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-danger"
              data-dismiss="modal"
            >
              Cerrar
            </button>
            <button
              type="button"
              class="btn btn-outline-dark"
              @click="disableProduct(productToDisable)"
              data-dismiss="modal"
            >
              Deshabilitar
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
      productToDisable: "",

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
      this.$router.push({ name: "ProductAdd" });
    },
    /**
     * Redirige a la vista de editar empresa
     * pasando el id de la empresa por parametro en la url
     */
    redirectProductEdit(idProduct) {
      console.log("enviar id por url", idProduct);

      this.$router.push({
        name: "ProductEdit",
        params: { id: idProduct },
      });
    },
    /**
     * Elimina una empresa y actualiza el cache con refetchQueries
     */
    async disableProduct(idProduct) {
      console.log("enviar id por url", idProduct);
      await this.$apollo.mutate({
        // Establece la consulta a realizar
        mutation: require("@/graphql/product/disableProduct.gql"),
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
        "Deshabilitar producto",
        "El producto ha sido deshabilitado.",
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
      console.log("Viendo producto ", producto.name);
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
</style>
