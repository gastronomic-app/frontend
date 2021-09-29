<template>
  <div class="row ml-5">
    <div class="col">
      <p style="text-align: left; margin-left: 2%">
        Envio <br />Sub-Total <br />
        <span style="font-weight: bold">Total</span>
      </p>
    </div>
    <div class="col">
      <!-- {{ persist() }} -->
      <p>
        $ {{ new Intl.NumberFormat().format(envio) }} <br />
        $ {{ new Intl.NumberFormat().format(total) }} <br />
        <span style="font-weight: bold"
          >$ {{ new Intl.NumberFormat().format(total + envio) }}</span
        >
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "TotalOrder",
  props: {
    total: Number,
    envio: Number,
  },
  methods: {
    persist() {
      localStorage.envio = this.envio;
      localStorage.total = this.total;
    },
  },
};
</script>
