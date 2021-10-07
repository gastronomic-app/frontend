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
    deliveryId: {
      type: String,
      required: true,
    },
    enterprise: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      options: {
        type: Array,
        default: null,
      },
      optionSelected: null,
      messageWrite: null,
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
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },
    validate() {
      // Decide que valor enviar
      if (this.optionSelected) {
        return this.optionSelected;
      } else if (this.messageWrite) {
        return this.messageWrite;
      }
    },
    sendReport() {
      let value = this.validate();

      // Generar reporte a la orden de pedido
      this.$apollo
        .mutate({
          mutation: require("@/graphql/deliveries/generateReport.gql"),
          variables: {
            id: this.deliveryId,
            complaint: value,
          },
        })
        .then(() => {
          this.makeToast(
            "success",
            "Reporte",
            "El reporte ha sido enviado con exito.",
            5000
          );
        });

      // Redirección a otra página
      this.$router.push({ name: "OrdersPlaced" });
    },
  },
  computed: {
    // Deshabilita el botón de enviar
    inputEmpty() {
      if (this.optionSelected || this.messageWrite) {
        return false;
      }
      return true;
    },
  },
};
</script>
