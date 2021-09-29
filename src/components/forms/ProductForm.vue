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
          <input type="file" @change="uploadFiles" accept="image/*" />
        </div>
      </div>
      <div class="form-group">
        <button @click="previewImages" class="btn btn-primary mb-2 mt-2 mr-2">
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
            min="0"
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
          type="button"
          class="btn btn-info mb-3"
          id="btnAddRecommendations"
        >
          Agregar Acompañamientos
        </button>
        <br />
        <textarea
          class="form-control"
          id="TxtArea-Recomendations"
          rows="4"
          placeholder="Por ahora no hay recomendaciones para el producto"
          v-model="form.accompaniment"
          readonly
        ></textarea>
      </div>

      <button
        v-if="id === null"
        type="submit"
        @click="checkProduct"
        class="btn btn-success mr-3 mb-2"
        :disabled="inputsEmpty"
      >
        Crear producto
      </button>

      <button
        v-if="id !== null"
        type="submit"
        @click="checkProduct"
        class="btn btn-success mr-3 mb-2"
        :disabled="inputsEmpty"
      >
        Actualizar producto
      </button>

      <button
        type="button"
        class="btn btn-primary mb-2"
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
            ["Hamburguesa", "hamburguesa"],
            ["Pizza", "pizza"],
            ["Sandwich", "sandwich"],
            ["Pollo", "pollo"],
            ["Carne", "carne"],
            ["Otra Comida Rapida", "otra rapida"],
          ],
        ],
        [
          "Comidas Tradicionales",
          [
            ["Mexicana", "mexicana"],
            ["Asiatica", "asiatica"],
            ["Italiana", "italiana"],
            ["Colombiana", "colombiana"],
            ["Otra Comida Tradicional", "otra tradicional"],
          ],
        ],
        [
          "Saludables",
          [
            ["Ensalada", "ensalada"],
            ["Vegana", "vegana"],
          ],
        ],
        [
          "Bebidas",
          [
            ["Gaseosa", "gaseosa"],
            ["Jugo o Batido", "jugo o batido"],
            ["Alcoholica", "alcoholica"],
            ["Infusion", "infusion"],
          ],
        ],
      ],

      show: true,
      show_images: false,
    };
  },

  /**
   * Ciclo de vida del componente
   * donde realiza la consulta si llega un id por props
   */
  async mounted() {
    console.log("id en el formulario", this.id);

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
    }
  },

  methods: {
    redirectProductList() {
      this.$router.push({ name: "ProductsList" });
    },
    checkProduct(event) {
      event.preventDefault();
      let producto = this.allProducts.edges.filter(
        (element) =>
          element.node.name == this.form.name.toLowerCase() &&
          element.node.enterprise.id == "RW50ZXJwcmlzZU5vZGU6MQ=="
      );
      console.log(producto);
      if (producto.length == 0 && this.id === null) {
        this.addproduct();
      } else if (
        (producto.length == 0 && this.id !== null) ||
        (producto.length == 1 && this.id == producto[0].node.id)
      ) {
        this.editProduct();
      } else {
        alert(
          JSON.stringify("Ya se encuentra un producto con ese mismo nombre")
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
            enterpriseId: "RW50ZXJwcmlzZU5vZGU6MQ==",
          },
          refetchQueries: [
            { query: require("@/graphql/product/allProducts.gql") },
          ],
        })
        // El método mutate devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          console.log("creación de producto:", response.data);
          this.uploadImage(response.data.createProduct.product.id);
        });
      alert(JSON.stringify("El producto se creó exitosamente"));

      this.$router.push({ name: "ProductsList" });
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
            enterpriseId: "RW50ZXJwcmlzZU5vZGU6MQ==",
          },
          refetchQueries: [
            { query: require("@/graphql/product/allProducts.gql") },
          ],
        })
        .then((response) => {
          console.log("actualización de producto:", response.data);
          if (this.form.images.length != 0) {
            this.updateImage(this.form.imageId);
          } else {
            this.$router.push({ name: "ProductsList" });
          }
          alert(JSON.stringify("El producto se actualizó exitosamente"));
        });
    },
    onCancel(event) {
      event.preventDefault();
      alert(JSON.stringify(this.form));
    },
    uploadFiles(event) {
      event.preventDefault();
      this.form.images = event.target.files;
      this.images_urls = [];
      this.form.images.forEach((file) => {
        const fileImage = file;
        this.images_urls.push(URL.createObjectURL(fileImage));
      });
    },
    previewImages(event) {
      event.preventDefault();
      this.show_images = ~this.show_images;
    },

    uploadImage(id) {
      if (!this.form.images.length) {
        return;
      }
      console.log(id);
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
      console.log(id);
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

      this.$router.push({ name: "ProductsList" });
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
        (!this.form.images.length && this.id == null)

      ) {
        return true;
      }
      return false;
    },
  },
};
</script>
