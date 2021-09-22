<template>

  <div class="card">
    <img
      src="@/assets/enterprise.jpg"
      class="card-img-top"
      alt="logo establecimiento"
    />

    <div class="card-body">
      <h5 class="card-title">{{ enterprise.name | capitalize }}</h5>
      <p class="card-text">{{ enterprise.location | capitalize }}</p>
      <p class="card-text">{{ variable }}</p>
      <p></p>

    </div>
    <div class="card-footer">
      <small class="text-muted">Creeado el {{ enterprise.created }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnterpriseCard",
  data() {
    return{
      variable : "",
      validarRango: "",
    }
  },
  props: {
    /**
     * Objeto establecimiento enviado
     * como prop desde una vista
     */
    enterprise: Object,
  },
  mounted(){
    this.mostrar();
  },
  methods:{
    mostrar(){
          let diasSemana = JSON.parse(this.enterprise.businessHours);
          console.log(diasSemana);
          let dias = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
          let hoy = new Date();
          let dia = dias[hoy.getDay()];
          //let hora = hoy.getHours();
          //console.log(hora);
          //let horassss = parseInt(diasSemana.jueves.horaI);
          //this.variable = dias[hoy.getDay()];

          if (dia == "lunes") {
            if (diasSemana.lunes.horaI != "") {
                this.variable = "Abierto: "+diasSemana.lunes.horaI +" Cierre: "+diasSemana.lunes.horaF;
                //this.validarRango = true;
            }

          }else if (dia == "martes") {
            if (diasSemana.martes.horaI != "") {
                this.variable = "Abierto: "+diasSemana.martes.horaI +" Cierre: "+diasSemana.martes.horaF;
            }

          }
          else if (dia == "miercoles") {
            if (diasSemana.miercoles.horaI != "") {
                this.variable = "Abierto: "+diasSemana.miercoles.horaI +" Cierre: "+diasSemana.miercoles.horaF;
            }

          }
          else if (dia == "jueves") {
            if (diasSemana.jueves.horaI != "") {
                this.variable = "Abierto: "+diasSemana.jueves.horaI +" Cierre: "+diasSemana.jueves.horaF;
            }

          }
          else if (dia == "viernes") {
            if (diasSemana.viernes.horaI != "") {
                this.variable = "Abierto: "+diasSemana.viernes.horaI +" Cierre: "+diasSemana.viernes.horaF;
            }

          }
          else if (dia == "sabado") {
            if (diasSemana.sabado.horaI != "") {
                this.variable = "Abierto: "+diasSemana.sabado.horaI +" Cierre: "+diasSemana.sabado.horaF;
            }

          }
          else if (dia == "domingo") {
            if (diasSemana.domingo.horaI != "") {
                this.variable = "Abierto: "+diasSemana.domingo.horaI +" Cierre: "+diasSemana.domingo.horaF;
            }

          }
    },
  }
};
</script>
