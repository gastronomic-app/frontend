<template>
  <div>
    <form>
      <!-- Nombre -->
      <div class="form-group" id="Field-name">
        <label for="input-name">Nombre</label>
        <input
          class="form-control"
          id="input-name"
          v-model="form.name"
          type="text"
          placeholder="Nombre del producto"
          required
        />
      </div>

      <!-- Imagen -->
      <div class="input-group">
        <div class="custom-file">
          <input
            id="product-image"
            type="file"
            @change="uploadFiles"
            accept="image/*"
          />
        </div>
      </div>
      <div class="form-group">
        <button @click="previewImages" class="btn black-button mb-2 mt-2 mr-2">
          {{ show_images ? "Ocultar imagen" : "Visualizar imagen" }}
        </button>
      </div>
      <div v-if="show_images">
        <img
          v-for="url in images_urls"
          v-bind:key="url"
          v-bind:src="url"
          class="rounded mx-auto d-block"
          height="300"
          alt="..."
        />
      </div>

      <!-- Precio -->
      <div class="form-group">
        <label for="txt-Precio">Precio</label>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">$</span>
          </div>
          <input
            type="number"
            min="1"
            oninput="validity.valid||(value='');"
            class="form-control"
            placeholder="Precio"
            v-model="form.price"
            required
          />
        </div>
      </div>

      <!-- Ingredientes -->
      <div class="form-group">
        <label for="TxtArea-Ingredientes">Ingredientes</label>
        <textarea
          class="form-control"
          id="TxtArea-Ingredientes"
          rows="4"
          placeholder="Ingredientes del producto"
          v-model="form.ingredients"
          required
        ></textarea>
      </div>

      <!-- Preparación -->
      <div class="form-group">
        <label for="TxtArea-Preparacion">Preparación</label>
        <textarea
          class="form-control"
          id="TxtArea-Preparacion"
          rows="4"
          placeholder="Preparación del producto"
          v-model="form.preparation"
        ></textarea>
      </div>

      <!-- Tiempo de preparación -->
      <div class="form-group">
        <label for="txt-TiempoPreparacion">Tiempo de Preparacion</label>
        <div class="input-group mb-3">
          <input
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
            class="form-control"
            placeholder="Tiempo estimado de preparacion del producto"
            v-model="form.preparation_time"
            required
          />
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">minutos</span>
          </div>
        </div>
      </div>

      <!-- Tipo -->
      <div class="form-group">
        <label>Tipo de producto</label>
        <select class="form-control" v-model="form.product_type" required>
          <optgroup
            v-for="groupType in product_types"
            :label="groupType[0]"
            :key="groupType[0]"
          >
            <option
              v-for="type in groupType[1]"
              :value="type[1]"
              :key="type[0]"
            >
              {{ type[0] }}
            </option>
          </optgroup>
        </select>
      </div>

      <!-- Acompañamientos -->
      <div class="form-group">
        <label for="btnAddRecommendations"> Acompañamientos </label>
        <br />
        <button
          v-b-modal.modal-Recommendations
          type="button"
          class="btn black-button mb-3 mr-3"
          id="btnAddRecommendations"
        >
          Gestionar acompañamientos
        </button>
        <button @click="previewAccompaniments" class="btn black-button mb-3">
          {{
            this.show_accompaniments
              ? "Ocultar acompañamientos"
              : "Visualizar acompañamientos"
          }}
        </button>
        <ol
          id="lista-recomendaciones"
          v-if="this.show_accompaniments"
          class="list-group list-group-numbered"
        >
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

      <div>
        <b-modal
          id="modal-Recommendations"
          title="Agregar acompañamientos"
          hide-footer
        >
          <div v-for="(groupType, index) in product_types" :key="groupType[0]">
            <div>
              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button
                    block
                    v-b-toggle="'accordion-' + index"
                    class="black-button"
                    >{{ groupType[0] }}
                  </b-button>
                </b-card-header>
                <b-collapse
                  :id="'accordion-' + index"
                  accordion="my-accordion"
                  role="tabpanel"
                >
                  <b-card-body>
                    <div v-if="allProducts.edges !== undefined">
                      <div v-for="type in groupType[1]" :key="type[0]">
                        <b-form-group
                          :label="type[0]"
                          v-if="
                            allProducts.edges.filter(
                              (element) =>
                                element.node.productType.includes(type[2]) &&
                                element.node.active == true &&
                                element.node.id !== id &&
                                element.node.enterprise.id === idEnterprise
                            ).length > 0
                          "
                        >
                          <b-form-checkbox-group
                            v-model="recommendation_id_list"
                          >
                            <b-form-checkbox
                              @change="fillRecommendations"
                              v-for="product in allProducts.edges.filter(
                                (element) =>
                                  element.node.productType.includes(type[2]) &&
                                  element.node.active == true &&
                                  element.node.id !== id &&
                                element.node.enterprise.id === idEnterprise
                                  
                              )"
                              :value="product.node.id"
                              :key="product.node.id"
                              >{{ product.node.name }}</b-form-checkbox
                            >
                          </b-form-checkbox-group>
                        </b-form-group>
                      </div>
                    </div>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </div>
          <b-button
            class="mt-3 orange-button"
            block
            @click="$bvModal.hide('modal-Recommendations')"
            >Cerrar</b-button
          >
        </b-modal>
      </div>

      <button
        v-if="id === null"
        type="submit"
        @click="checkProduct"
        class="btn orange-button mr-3 mb-2"
        :disabled="inputsEmpty"
      >
        Crear producto
      </button>

      <button
        v-if="id !== null"
        type="submit"
        @click="checkProduct"
        class="btn orange-button mr-3 mb-2"
        :disabled="inputsEmpty"
      >
        Actualizar producto
      </button>

      <button
        type="button"
        class="btn black-button mb-2"
        @click="redirectProductList"
      >
        Volver
      </button>
    </form>
  </div>
</template>
<script>
export default {
  name: "ProductForm",
  props: {
    /**
     * Se asigna null si el formulario
     * no es de actualización
     */
    id: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      allProducts: Object,
      images_urls: [],
      producto: null,
      recommendation_id_list: [],
      recommendation_list: [],
      edit_recommendation_list: [],
      idEnterprise:"",
      form: {
        name: "",
        images: [],
        price: "",
        ingredients: "",
        preparation: "",
        preparation_time: "",
        product_type: "",
        accompaniment: "",
        imageId: "",
      },
      product_types: [
        [
          "Comidas rapidas",
          [
            ["Hamburguesa", "hamburguesa", "HAMBURGUESA"],
            ["Pizza", "pizza", "PIZZA"],
            ["Sandwich", "sandwich", "SANDWICH"],
            ["Pollo", "pollo", "POLLO"],
            ["Carne", "carne", "CARNE"],
            ["Otra Comida Rapida", "otra rapida", "OTRA_RAPIDA"],
          ],
        ],
        [
          "Comidas Tradicionales",
          [
            ["Mexicana", "mexicana", "MEXICANA"],
            ["Asiatica", "asiatica", "ASIATICA"],
            ["Italiana", "italiana", "ITALIANA"],
            ["Colombiana", "colombiana", "COLOMBIANA"],
            ["Otra Comida Tradicional", "otra tradicional", "OTRA_TRADICIONAL"],
          ],
        ],
        [
          "Saludables",
          [
            ["Ensalada", "ensalada", "ENSALADA"],
            ["Vegana", "vegana", "VEGANA"],
          ],
        ],
        [
          "Bebidas",
          [
            ["Gaseosa", "gaseosa", "GASEOSA"],
            ["Jugo o Batido", "jugo o batido", "JUGO_O_BATIDO"],
            ["Alcoholica", "alcoholica", "ALCOHOLICA"],
            ["Infusion", "infusion", "INFUSION"],
          ],
        ],
      ],

      show: true,
      show_images: false,
      show_accompaniments: ~false,
    };
  },

  /**
   * Ciclo de vida del componente
   * donde realiza la consulta si llega un id por props
   */
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

    // Si el id existe, realiza la consulta
    if (this.id) {
      let producto = this.allProducts.edges.filter(
        (element) => element.node.id == this.id
      )[0].node;

      this.form.name = producto.name;
      this.form.price = String(producto.price);
      this.form.ingredients = producto.ingredients;
      this.form.preparation = producto.preparation;
      this.form.preparation_time = String(producto.estimatedTime);
      this.product_types.forEach((groupType) => {
        groupType[1].forEach((type) => {
          if (
            type[1].toUpperCase().replace(/\s/g, "_") == producto.productType
          ) {
            this.form.product_type = type[1];
          }
        });
      });
      this.form.imageId = producto.images.edges[0].node.id;
      this.images_urls.push(producto.images.edges[0].node.url);
      producto.accompaniments.edges.forEach((accompaniment) => {
        if (accompaniment.node.active) {
          this.recommendation_id_list.push(accompaniment.node.id);
        }
      });
      this.edit_recommendation_list = this.recommendation_id_list;
      this.fillRecommendations();
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
    redirectProductList() {
     this.$router.push({
        name: "ProductsList",
        params: { idEnt: this.idEnterprise },
      });
    },
    checkProduct(event) {
      event.preventDefault();
      let producto = this.allProducts.edges.filter(
        (element) =>
          element.node.name == this.form.name.toLowerCase() &&          
          element.node.enterprise.id === this.idEnterprise
      );      
      if (producto.length == 0 && this.id === null) {
        this.addproduct();
      } else if (
        (producto.length == 0 && this.id !== null) ||
        (producto.length == 1 && this.id == producto[0].node.id)
      ) {
        this.editProduct();
        this.makeToast(
          "success",
          "Producto actualizado",
          "El producto ha sido actualizado",
          4000
        );
      } else {
        this.makeToast(
          "warning",
          "Datos incorrectos",
          "Ya se encuentra un producto con el mismo nombre",
          4000
        );
      }
    },

    /**
     * Método que crea un producto cuando es presionado el botón
     */
    addproduct() {
      this.$apollo
        .mutate({
          // Establece la mutación de crear
          mutation: require("@/graphql/product/createProduct.gql"),
          // Define las variables
          variables: {
            name: this.form.name.toLowerCase(),
            price: this.form.price,
            ingredients: this.form.ingredients,
            preparation: this.form.preparation,
            estimatedTime: this.form.preparation_time,
            productType: this.form.product_type,
            enterpriseId: this.idEnterprise,
          },
          refetchQueries: [
            { query: require("@/graphql/product/allProducts.gql") },
          ],
        })
        // El método mutate devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {          
          this.uploadImage(response.data.createProduct.product.id);
          this.recommendation_id_list.forEach((recommendation) => {
            this.addRecommendations(
              response.data.createProduct.product.id,
              recommendation
            );
          });
          this.makeToast(
            "success",
            "Producto creado",
            "Producto " + this.form.name + " ha sido creado",
            4000
          );
        });
      this.$router.push({
        name: "ProductsList",
        params: { idEnt: this.idEnterprise },
      });
    },

    editProduct() {
      this.$apollo
        .mutate({
          // Establece la mutación de editar
          mutation: require("@/graphql/product/updateProduct.gql"),
          // Define las variables
          variables: {
            id: this.id,
            productType: this.form.product_type,
            name: this.form.name.toLowerCase(),
            price: this.form.price,
            ingredients: this.form.ingredients,
            preparation: this.form.preparation,
            estimatedTime: this.form.preparation_time,
            enterpriseId: this.idEnterprise,
          },
          refetchQueries: [
            { query: require("@/graphql/product/allProducts.gql") },
          ],
        })
        .then((response) => {
          if (this.form.images.length != 0) {
            this.updateImage(this.form.imageId);
          }

          const added_recommendations = this.recommendation_id_list.filter(
            (x) => !this.edit_recommendation_list.includes(x)
          );
          const removed_recommendations = this.edit_recommendation_list.filter(
            (x) => !this.recommendation_id_list.includes(x)
          );

          added_recommendations.forEach((recommendation) => {
            this.addRecommendations(response.data.updateProduct.product.id, recommendation);
          });
          removed_recommendations.forEach((recommendation) => {
            this.deleteRecommendations(response.data.updateProduct.product.id, recommendation);
          });
          this.$router.push({
        name: "ProductsList",
        params: { idEnt: this.idEnterprise },
      });
        });
    },
    uploadFiles(event) {
      event.preventDefault();
      const fileName = document.getElementById("product-image").value;
      const idxDot = fileName.lastIndexOf(".") + 1;
      const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
        this.form.images = Array.from(event.target.files);
        this.images_urls = [];        
        this.form.images.forEach((file) => {
          const fileImage = file;
          this.images_urls.push(URL.createObjectURL(fileImage));
        });        
      } else {
        this.form.images = [];
        this.images_urls = []; 
        this.makeToast(
          "warning",
          "Datos incorrectos",
          "Solo jpg/jpeg y png estan permitidos.",
          4000
        );
      }
    },
    previewImages(event) {
      event.preventDefault();
      this.show_images = ~this.show_images;
    },
    previewAccompaniments(event) {
      event.preventDefault();
      this.show_accompaniments = ~this.show_accompaniments;
    },

    uploadImage(id) {
      if (!this.form.images.length) {
        return;
      }      
      this.$apollo.mutate({
        mutation: require("@/graphql/image/createImage.gql"),
        variables: {
          product: id,
          file: this.form.images[0],
        },

        refetchQueries: [
          { query: require("@/graphql/product/allProducts.gql") },
        ],
      });
    },
    updateImage(id) {
      if (!this.form.images.length) {
        return;
      }
     
      this.$apollo.mutate({
        mutation: require("@/graphql/image/updateImage.gql"),
        variables: {
          id: id,
          url: this.form.images[0],
        },

        refetchQueries: [
          { query: require("@/graphql/product/allProducts.gql") },
        ],
      });
    },
    fillRecommendations() {
      this.recommendation_list = [];
      this.recommendation_id_list.forEach((id_product) =>
        this.recommendation_list.push(
          this.allProducts.edges.filter(
            (element) => element.node.id == id_product
          )[0]
        )
      );
    },
    deleteRecommendations(idProducto, idRecomendacion) {
      this.$apollo.mutate({
        // Establece la mutación de eliminar recomendaciones
        mutation: require("@/graphql/product/deleteAccompaniment.gql"),
        // Define las variables
        variables: {
          fromProductId: idProducto,
          toProductId: idRecomendacion,
        },
        refetchQueries: [
          { query: require("@/graphql/product/allProducts.gql") },
        ],
      });
    },

    addRecommendations(idProducto, idRecomendacion) {
      this.$apollo.mutate({
        // Establece la mutación de editar
        mutation: require("@/graphql/product/addAccompaniment.gql"),
        // Define las variables
        variables: {
          fromProductId: idProducto,
          toProductId: idRecomendacion,
        },
        refetchQueries: [
          { query: require("@/graphql/product/allProducts.gql") },
        ],
      });
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

  computed: {
    /**
     * Habilita o inhabilita el botón de crear o actualizar establecimiento
     * dependiendo si los inputs están vacios
     */
    inputsEmpty() {      
      if (        
        this.form.name.trim() === "" ||
        this.form.price.trim() === "" ||
        this.form.ingredients.trim() === "" ||
        this.form.preparation_time.trim() === "" ||
        this.form.product_type.trim() === "" ||
        (!this.form.images.length && this.id == null) ||
        (!this.images_urls.length && this.id !== null)
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.bg-cart {
  background-color: var(--dark-x);
}
.color-black {
  color: white;
}
.orange {
  color: orange;
}
.orange-background {
  background-color: orange;
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

.orange-button:hover:enabled,
.black-button:hover:enabled {
  box-shadow: 0 4px 16px rgb(201, 132, 30);
  transition: all 0.2s ease;
}
</style>
