<template>
  <div>
    <h1>
      Generar reporte para <b>{{ enterprise | capitalize }}</b>
    </h1>
    <div class="jumbotron">
      <div v-for="option in options" :key="option.id">
        <div class="custom-control custom-radio">
          <input
            type="radio"
            :id="option.id"
            name="customRadio"
            class="custom-control-input"
            :value="option.message"
            v-model="optionSelected"
          />
          <label class="custom-control-label" :for="option.id">
            {{ option.message }}
          </label>
        </div>
      </div>

      <br />

      <div class="form-group">
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          v-model="messageWrite"
          placeholder="Escriba un comentario con su inconveniente"
        >
        </textarea>
      </div>
    </div>
    <div class="text-right">
      <button
        type="button"
        class="btn btn-success mr-2"
        :disabled="inputEmpty"
        @click="sendReport"
      >
        Enviar
      </button>
      <button type="button" class="btn btn-danger">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Report",
  props: {
    deliveryId: String,
    enterprise: String,
  },
  data() {
    return {
      options: {
        type: Array,
        default: null,
      },
      optionSelected: {
        type: Object,
        default: null,
      },
      messageWrite: {
        type: String,
        default: "Escriba un comentario con su inconveniente"
      }
    };
  },
  created() {
    let userData = localStorage.getItem("user");
    userData = JSON.parse(userData);

    // Opciones para el reporte
    if (userData.type == "CLIENT") {
      this.options = [
        { id: 1, message: "El tiempo de entrega fue excesivo" },
        { id: 2, message: "Llegaron los productos incorrectos" },
        { id: 3, message: "Mala atención del domiciliario" },
      ];
    }
    if (userData.type == "COURIER") {
      this.options = [
        { id: 1, message: "El pedido no fue pagado" },
        { id: 2, message: "No se encontro la ubicación" },
        { id: 3, message: "Mala atención del domiciliario" },
      ];
    }
  },
  methods: {
    sendReport() {
      // this.$apollo.mutate({
      //   mutation: require("@/graphql/"),
      //   variables: {
      //     id: this.id,
      //     report: this.optionSelected,
      //   },
      // });

      this.$router.push({ name: "ExampleList" });
    },
  },
  computed: {
    inputEmpty() {
      console.log(this.optionSelected);
      if (this.optionSelected === null) {
        return true;
      }
      return false;
    },
  },
};
</script>
