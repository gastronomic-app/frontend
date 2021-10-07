<template>
  <section class="inline">
    <span v-if="timeout === false">
      <span v-show="time.hours > 0">{{ time.hours }} horas - </span>
      <span v-show="time.min > 0"> {{ time.min }} minutos - </span
      >{{ time.sec }} segundos
    </span>
    <slot v-else></slot>
  </section>
</template>

<script>
export default {
  name: "Countdown",
  props: ["id", "sec", "min", "hours"],

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

  methods: {
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
        this.$store.dispatch("addDeliveryTimeAction",this.time)
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
