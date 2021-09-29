<template>
  <section class="inline">
    <span v-if="timeout === false">
      <span v-show="time.hours > 0">{{ time.hours }} horas - </span>
      <span v-show="time.min > 0"> {{ time.min }} minutos - </span
      >{{ time.sec }} segundos
    </span>
    <!-- Button trigger modal -->
    <button
      style="background-color: var(--dark); color: white"
      type="button"
      class="btn"
      data-toggle="modal"
      data-target="#exampleModal"
      v-else
    >
      Generar reporte
    </button>
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
            <h5 class="modal-title" style="color: black" id="exampleModalLabel">
              Información
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
          <div class="modal-body">Hola ¿paso algo con tu orden?</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn"
              style="background-color: var(--dark); color: white"
              @click="redirect"
            >
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
  </section>
</template>

<script>
export default {
  name: "Countdown",
  props: ["id", "sec", "min", "hours", "currentTime"],

  data() {
    return {
      timeout: false,

      time: {
        id: this.id,
        hours: this.hours,
        min: this.min,
        sec: this.sec,
      },
    };
  },

  beforeDestroy() {
    this.prepareData();
    this.currentTime(this.time);
  },
  methods: {
    redirect() {
      this.$destroy();
      this.$router.push({ name: "Report" });
    },
    prepareData() {
      this.time.hours === undefined ? (this.time.hours = 0) : this.time.hours;
      this.time.min === undefined ? (this.time.min = 0) : this.time.min;
      this.time.sec === undefined ? (this.time.sec = 0) : this.time.sec;
    },
  },

  watch: {
    time: {
      deep: true,
      handler(value) {
        if (value.sec > 0) {
          setTimeout(() => {
            this.time.sec--;
          }, 1000);
        } else if (this.time.min > 0) {
          this.time.min--;
          this.time.sec = 60;
        } else if (this.time.hours > 0) {
          this.time.hours--;
          this.time.min = 60;
          this.time.sec = 60;
        } else {
          this.timeout = true;
        }
      },
      immediate: true,
    },
  },
};
</script>
<style scoped>
.inline {
  display: inline-block;
}
</style>
