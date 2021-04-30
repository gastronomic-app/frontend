<template>
  <div class="text-center">
    <div class="jumbotron">
      <h1 class="display-4" v-if="timerCount !== 0">
        Tiempo estimado de la entrega: {{ timerCount }}
      </h1>
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
        v-else
      >
        Generar reporte
      </button>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Información</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">Hola ¿paso algo con tu orden?</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="redirect">
              Generar reporte
            </button>
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
export default {
  name: "Countdown",
  data() {
    return {
      timerCount: 5,
    };
  },
  methods: {
    redirect() {
      this.$destroy();
      this.$router.push({ name: "Report" });
    },
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
      },
      immediate: true,
    },
  },
};
</script>
