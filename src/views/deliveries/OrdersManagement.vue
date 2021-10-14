<template>
  <div style="margin-top:1em">
  <b-card no-body>
    <b-tabs card>
      <b-tab  title="Nuevos" active>
        <PendingOrders/>
      </b-tab>
      <b-tab title="Despachados">

        <dispached-orders></dispached-orders>
      </b-tab>
      <b-tab title="Cancelados">
        <orders-canceled></orders-canceled>
      </b-tab>
    </b-tabs>
  </b-card>
</div>
</template>
<script>
import PendingOrders from "@/views/deliveries/PendingOrders.vue";
import DispachedOrders from "@/views/deliveries/DispachedOrders.vue";
import OrdersCanceled from "@/views/deliveries/OrdersCanceled.vue";


export default {
  name: "OrdersManagement",
  components: {
    PendingOrders,
    DispachedOrders,
    OrdersCanceled
   
  },
  data() {},
};
</script>
<style scoped>
</style>
