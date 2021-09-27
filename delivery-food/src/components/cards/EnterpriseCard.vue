<template>
  <div class="card bg-cart color-black">
    <img
      src="@/assets/enterprise.jpg"
      class="card-img-top"
      alt="logo establecimiento"
    />
    <div class="card-body container-md">
        <div>
          <b-form-rating class="bg-cart text-warning" variant="warning" font="warning" v-model="valoration" show-value id="rating-sm-no-border" no-border
      readonly></b-form-rating>
        </div>
      <h5 class="card-title font-weight-bold">
        {{ enterprise.name | capitalize }}
      </h5>
      <p class="card-text">{{ enterprise.location | capitalize }}</p>
      <p class="card-text">
        Horario de atención:
      </p>
      <p class="card-text">
          {{varShedule}}
      </p>

      <button v-show="ok" type="button" class="btn btn-success btn-sm mr-4">
        Hacer Pedido
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExampleCard",
  data() {
    return{
      ok: localStorage.getItem("existUser"),
      allReviews: Object,
      valoration: 0,
      counter: 0,
      varShedule : "",
      aux1:0,
      aux2:0,
      aux3:0,
      aux4:0,
      aux5:0,
      aux6:0,
      aux7:0,
      auxprom:0,
      auxcont:0,
    }
  },

  props: {
    /**
     * Objeto establecimiento enviado
     * como prop desde una vista
     */
    enterprise: Object,
  },
  created() {
    this.$apollo
      .query({
        // Consulta
        query: require("@/graphql/comments/allReviews.gql"),
          // Define las variables
          variables: {
            id: this.enterprise.id,
          },
      })
      .then((response) => {
        this.allReviews = response.data.enterprise;
        this.allReviewsMeth1()
        //this.pages = response.data.allEnterprises.edges.length;
      });
  },

  mounted(){
    this.mostrar();
  },
  methods:{
    valnum(texto){
      var aux=1;
      if(texto=="BUENO"){
        aux=5
      }
      else if(texto=="REGULAR"){
          aux=3
        }
      return aux;
    },

  async allReviewsMeth1(){

      var aux1=0;
      var aux2=0;
      var aux3=0;
      var aux4=0;
      var aux5=0;
      var aux6=0;
      var aux7=0;
      var conttam=0;
      var comments=[];
      var users=[];

      for (const product in this.allReviews.products.edges){
        for(const order in  this.allReviews.products.edges[product].node.orders.edges){
          comments.push(this.allReviews.products.edges[product].node.orders.edges[order].node.review.comments)
          users.push(this.allReviews.products.edges[product].node.orders.edges[order].node.client.email)
          aux1=Math.round(aux1+this.valnum(this.allReviews.products.edges[product].node.orders.edges[order].node.review.qualityService))
          aux2=Math.round(aux2+this.valnum(this.allReviews.products.edges[product].node.orders.edges[order].node.review.preparation))
          aux3=Math.round(aux3+this.valnum(this.allReviews.products.edges[product].node.orders.edges[order].node.review.presentation))
          aux4=Math.round(aux4+this.valnum(this.allReviews.products.edges[product].node.orders.edges[order].node.review.ingredients))
          aux5=Math.round(aux5+this.valnum(this.allReviews.products.edges[product].node.orders.edges[order].node.review.price))
          aux6=Math.round(aux6+this.valnum(this.allReviews.products.edges[product].node.orders.edges[order].node.review.textures))
          aux7=Math.round(aux7+this.valnum(this.allReviews.products.edges[product].node.orders.edges[order].node.review.cookingPoint))
        conttam=conttam+1;
        }

      }
      //promedios
      this.auxcont=conttam;
      aux1=Math.round( aux1/conttam);
      this.aux1=aux1;
      aux2=Math.round(aux2/conttam);
      this.aux2=aux2;
      aux3=Math.round(aux3/conttam);
      this.aux3=aux3;
      aux4=Math.round(aux4/conttam);
      this.aux4=aux4;
      aux5=Math.round(aux5/conttam);
      this.aux5=aux5;
      aux6=Math.round(aux6/conttam);
      this.aux6=aux6;
      aux7=Math.round(aux7/conttam);
      this.aux7=aux7;
      this.comments=comments;
      this.users=users;
      this.valoration= ((aux1+aux2+aux3+aux4+aux5+aux7)/7).toFixed(1);

    },
    mostrar(){
          let diasSemana = JSON.parse(this.enterprise.businessHours);
          let dias = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
          let hoy = new Date();
          let dia = dias[hoy.getDay()];

          if (dia == "lunes") {
            if (diasSemana.lunes.horaI != "") {
                this.varShedule = "Abierto: "+diasSemana.lunes.horaI +" Cierre: "+diasSemana.lunes.horaF;
            }

          }else if (dia == "martes") {
            if (diasSemana.martes.horaI != "") {
                this.varShedule = "Abierto: "+diasSemana.martes.horaI +" Cierre: "+diasSemana.martes.horaF;
            }

          }
          else if (dia == "miercoles") {
            if (diasSemana.miercoles.horaI != "") {
                this.varShedule = "Abierto: "+diasSemana.miercoles.horaI +" Cierre: "+diasSemana.miercoles.horaF;
            }

          }
          else if (dia == "jueves") {
            if (diasSemana.jueves.horaI != "") {
                this.varShedule = "Abierto: "+diasSemana.jueves.horaI
                +" Cierre: "+diasSemana.jueves.horaF;
            }

          }
          else if (dia == "viernes") {
            if (diasSemana.viernes.horaI != "") {
                this.varShedule = "Abierto: "+diasSemana.viernes.horaI +" Cierre: "+diasSemana.viernes.horaF;
            }

          }
          else if (dia == "sabado") {
            if (diasSemana.sabado.horaI != "") {
                this.varShedule = "Abierto: "+diasSemana.sabado.horaI +" Cierre: "+diasSemana.sabado.horaF;
            }

          }
          else if (dia == "domingo") {
            if (diasSemana.domingo.horaI != "") {
                this.varShedule = "Abierto: "+diasSemana.domingo.horaI +" Cierre: "+diasSemana.domingo.horaF;
            }

          }
    },
    apreciation() {
      var varaux = 0;
      var average = 0;
      this.counter = 0;
      for (this.counter; this.counter < this.allReviews.edges.length; ) {
        varaux =
          varaux +
          this.aux(this.allReviews.edges[this.counter].node.qualityService);
        varaux =
          varaux +
          this.aux(this.allReviews.edges[this.counter].node.presentation);
        varaux =
          varaux +
          this.aux(this.allReviews.edges[this.counter].node.preparation);
        varaux =
          varaux +
          this.aux(this.allReviews.edges[this.counter].node.ingredients);
        varaux =
          varaux + this.aux(this.allReviews.edges[this.counter].node.price);
        varaux =
          varaux + this.aux(this.allReviews.edges[this.counter].node.textures);
        varaux =
          varaux +
          this.aux(this.allReviews.edges[this.counter].node.cookingPoint);
        average +=(varaux / 7);
        varaux = 0;
        this.counter += 1;
        //this.itemsRatings[this.counter] = varaux;
      }
      this.valoration = average / this.counter;
      //this.auxsize=this.itemsRatings.length;

    },
    aux(text) {
      var valor = 1;
      if (text == "BUENO") {
        valor = 5;
      } else if (text == "REGULAR") {
        valor = 3;
      }
      return valor;
    },
  },

};
</script>
<style scoped>
.name-app {
  color: var(--primary-x);
}
.bg-cart {
  background-color: var(--dark-x);
}
.navbar-orange-text {
  color: var(--orange);
}
.color-black {
  color: white;
}
.checked {
  color: orange;
}
</style>
