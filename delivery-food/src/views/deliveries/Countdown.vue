<template>
   <section class="inline">
<span v-if="timeout===true">
        {{min}} minutos-{{ sec }} segundos
      </span>
      <!-- Button trigger modal -->
      <button
      style="background-color:var(--dark); color:   white"
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
            <h5 class="modal-title"  style="color: black" id="exampleModalLabel">Información</h5>
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
            <button type="button" class="btn " style="background-color:var(--dark); color: white" @click="redirect">
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
  props:["sec","min","hour"],
 
  data() {
    return {
      timeout:true
    };
  },
  methods: {
    redirect() {
      this.$destroy();
      this.$router.push({ name: "Report" });
    },
  },
  watch: {
    sec: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.sec--;
          }, 1000);
        }
        else if(this.min>0){
          this.min--
          this.sec=60
        }
        else if(this.hour>0){
          this.hour--
          this.min=60
          this.sec=60
        }
        else{
          this.timeout=false
        }
      },
      immediate: true,
    },
  },
};
</script>
<style scoped>
  .inline{
    display: inline-block; 
  }
</style>
