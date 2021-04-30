<template>
  <div>
    <form>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          id="enterpriseInputName"
          aria-describedby="nameEnterpise"
          placeholder="Nombre del establecimiento"
          v-model="name"
        />
      </div>
      <div class="form-group">
        
        <input
          type="text"
          class="form-control"
          id="enterpriseInputLocation"
          placeholder="Ubicación del establecimiento"
          v-model="location"
        />
      </div>
      <button
        v-if="id == null"
        type="submit"
        class="btn btn-primary"
        :disabled="inputsEmpty"
        @click="addEnterprise"
      >
        Crear empresa
      </button>
      <button
        v-if="id !== null"
        type="submit"
        class="btn btn-success"
        :disabled="inputsEmpty"
        @click="editEnterprise"
      >
        Actualizar empresa
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ExampleForm",
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
      // Nombre del establecimiento
      name: "",
      // Ubicación del establecimiento
      location: "",
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
      await this.$apollo
        .query({
          // Establece la consulta para recuperar la empresa
          query: require("@/graphql/enterprise/enterprise.gql"),
          // Define las variables
          variables: {
            id: this.id,
          },
        })
        // El método query devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          // En este caso se usa para cargar el formulario
          // con los datos obtenidos
          this.name = response.data.enterprise.name;
          this.location = response.data.enterprise.location;
        });
    }
  },
  methods: {
    /**
     * Método que crea una empresa cuando es precionado el botón
     */
    addEnterprise() {
      this.$apollo
        .mutate({
          // Establece la mutación de crear
          mutation: require("@/graphql/enterprise/createEnterprise.gql"),
          // Define las variables
          variables: {
            name: this.name,
            location: this.location,
          },
        })
        // El método mutate devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          console.log("creación de empresa:", response.data);
          console.log("agrega aquí más lógica si es necesaria");
        });

      this.$router.push({ name: "ExampleList" });
    },
    /**
     * Método que crea actualiza una empresa cuando es precionado el botón
     */
    editEnterprise() {
      this.$apollo
        .mutate({
          // Establece la mutación de editar
          mutation: require("@/graphql/enterprise/updateEnterprise.gql"),
          // Define las variables
          variables: {
            id: this.id,
            name: this.name,
            location: this.location,
          },
        })
        // El método mutate devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          console.log("actualización de empresa:", response.data);
          console.log("agrega aquí más lógica si es necesaria");
        });

      this.$router.push({ name: "ExampleList" });
    },
  },
  computed: {
    /**
     * Habilita o inhabilita el botón de crear o actualizar establecimiento
     * dependiendo si los inputs están vacios
     */
    inputsEmpty() {
      if (this.name.trim() === "" || this.location.trim() === "") {
        return true;
      }
      return false;
    },
  },
};
</script>
