<template>
  <div class="card bg-cart color-black">
    <img
      :src="
      enterprise.image.substring(0, 5) === 'https'
          ? enterprise.image
          : 'https://res.cloudinary.com/dcbzwrn30/image/upload/v1/' + enterprise.image
          "
      class="card-img-top img-fluid img-responsive"
      :alt="'Imagen de ' + enterprise.name"
      style="width: 23rem; height: 18rem"
    />
    <div class="card-body container-md">
      <div>
        <b-form-rating
          class="bg-cart text-warning"
          variant="warning"
          font="warning"
          v-model="valoration"
          show-value
          id="rating-sm-no-border"
          no-border
          readonly
        ></b-form-rating>
      </div>
      <h5 class="card-title font-weight-bold">
        {{ enterprise.name | capitalize }}
      </h5>
      <p class="card-text">{{ enterprise.historicalReview | capitalize }}</p>
      <p class="card-text">{{ enterprise.location | capitalize }}</p>
      <p class="card-text">Horario de atención:</p>
      <p class="card-text">
        {{ varShedule }}
      </p>

      <button
        v-show="ok"
        v-on:click="btnComments(enterprise.id,enterprise.name,enterprise)"
        type="button"
        class="btn btn-success btn-sm mr-4"
      >
        Valoraciones
      </button>

      <button
        v-show="ok"
        v-on:click="makeOrder(enterprise,enterprise)"
        type="button"
        class="btn btn-success btn-sm mr-4"
      >
        Hacer Pedido
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExampleCard",
  data() {
    return {
      ok: localStorage.getItem("existUser"),
      allReviews: Object,
      valoration: 0,
      counter: 0,
      varShedule: "",
      calculo: 0,
    };
  },

  props: {
    /**
     * Objeto establecimiento enviado
     * como prop desde una vista
     */
    enterprise: Object,
  },
  created() {
    if(this.ok){
    let user = JSON.parse(localStorage.getItem("user"));
    if (user.type === "MANAGER") {
      this.ok=false;
    }else{
      this.ok=true;
    }
    }

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
        this.allReviewsMeth1();
        //this.pages = response.data.allEnterprises.edges.length;
      });
  },

  mounted() {
    this.mostrar();
  },
  methods: {
    btnComments(id,name,enterprise) {
      localStorage.idCaught = "";
      //console.log("redirigir");
      this.$router.push({
        name: "CommentsList",
        params: { idCaught: id ,nameenterprise:name,enterpriseNode:enterprise},
      });
    },
    makeOrder(Enterprise,enterprise) {
      if(this.ok){
      if (Enterprise.id == localStorage.idEnterprise) {
        this.$store.dispatch(
          "setStorageCountAction",
          parseInt(localStorage.getItem("car"))
        );
        localStorage.car = this.$store.getters.getCount;
        this.$router.push({
          name: "ProductListOrder",
          params: { id: Enterprise.id, name: Enterprise.name ,enterpriseNode:enterprise},
        });
      } else {
        this.$store.dispatch("setCountAction", this.$store.getters.getCount);
        localStorage.removeItem("items");
        localStorage.removeItem("idRecovered");
        localStorage.removeItem("car");
        localStorage.idEnterprise = "";
        localStorage.enterpriseName = "";
        this.$router.push({
          name: "ProductListOrder",
          params: { id: Enterprise.id, name: Enterprise.name,enterpriseNode:enterprise },
        });
      }
      }else{
           this.$router.push({name:"login"});
      }
    },
    valnum(texto) {
      var aux = 1;
      if (texto == "BUENO") {
        aux = 5;
      } else if (texto == "REGULAR") {
        aux = 3;
      }
      return aux;
    },
    allReviewsMeth1() {
      var comments = [];
      var aux1 = 0;
      var aux2 = 0;
      var aux3 = 0;
      var aux4 = 0;
      var aux5 = 0;
      var aux6 = 0;
      var aux7 = 0;
      var conttam = 0;
      //var users = [];

      if (this.allReviews.products.edges.length === 0) {
        return;
      }
      for (
        var product = 0;
        product < this.allReviews.products.edges.length;
        product++
      ) {
        if (
          this.allReviews.products.edges[product].node.orders.edges.length !== 0
        ) {
          for (
            var order = 0;
            order <
            this.allReviews.products.edges[product].node.orders.edges.length;
            order++
          ) {
            if (
              this.allReviews.products.edges[product].node.orders.edges[order]
                .node.review !== null
            ) {
              comments.push(
                this.allReviews.products.edges[product].node.orders.edges[order]
                  .node
              );
              aux1 =
                aux1 +
                this.valnum(
                  this.allReviews.products.edges[product].node.orders.edges[
                    order
                  ].node.review.qualityService
                );
              aux2 =
                aux2 +
                this.valnum(
                  this.allReviews.products.edges[product].node.orders.edges[
                    order
                  ].node.review.presentation
                );
              aux3 =
                aux3 +
                this.valnum(
                  this.allReviews.products.edges[product].node.orders.edges[
                    order
                  ].node.review.preparation
                );
              aux4 =
                aux4 +
                this.valnum(
                  this.allReviews.products.edges[product].node.orders.edges[
                    order
                  ].node.review.ingredients
                );
              aux5 =
                aux5 +
                this.valnum(
                  this.allReviews.products.edges[product].node.orders.edges[
                    order
                  ].node.review.price
                );
              aux6 =
                aux6 +
                this.valnum(
                  this.allReviews.products.edges[product].node.orders.edges[
                    order
                  ].node.review.textures
                );
              aux7 =
                aux7 +
                this.valnum(
                  this.allReviews.products.edges[product].node.orders.edges[
                    order
                  ].node.review.cookingPoint
                );
            }
          }
        }
      }

      //promedios
      conttam = comments.length;
      this.auxcont = conttam;
      aux1 = Math.round(aux1 / conttam);
      this.aux1 = aux1;
      aux2 = Math.round(aux2 / conttam);
      this.aux2 = aux2;
      aux3 = Math.round(aux3 / conttam);
      this.aux3 = aux3;
      aux4 = Math.round(aux4 / conttam);
      this.aux4 = aux4;
      aux5 = Math.round(aux5 / conttam);
      this.aux5 = aux5;
      aux6 = Math.round(aux6 / conttam);
      this.aux6 = aux6;
      aux7 = Math.round(aux7 / conttam);
      this.aux7 = aux7;
      this.comments = comments;
      var calculo = ((aux1 + aux2 + aux3 + aux4 + aux5 + aux7) / 7).toFixed(1);
      this.valoration = calculo;
    },

    mostrar() {
      let diasSemana = JSON.parse(this.enterprise.businessHours);
      let dias = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
      ];
      let hoy = new Date();
      let dia = dias[hoy.getDay()];

      if (dia == "lunes") {
        if (diasSemana.lunes.horaI != "" && diasSemana.lunes.estado == true) {
          this.varShedule =
            "Abierto: " +
            diasSemana.lunes.horaI +
            " Cierre: " +
            diasSemana.lunes.horaF;
        } else {
          this.varShedule = "Hoy no habra atencion";
        }
      } else if (dia == "martes") {
        if (diasSemana.martes.horaI != "" && diasSemana.martes.estado == true) {
          this.varShedule =
            "Abierto: " +
            diasSemana.martes.horaI +
            " Cierre: " +
            diasSemana.martes.horaF;
        } else {
          this.varShedule = "Hoy no habra atencion";
        }
      } else if (dia == "miercoles") {
        if (
          diasSemana.miercoles.horaI != "" &&
          diasSemana.miercoles.estado == true
        ) {
          this.varShedule =
            "Abierto: " +
            diasSemana.miercoles.horaI +
            " Cierre: " +
            diasSemana.miercoles.horaF;
        } else {
          this.varShedule = "Hoy no habra atencion";
        }
      } else if (dia == "jueves") {
        if (diasSemana.jueves.horaI != "" && diasSemana.jueves.estado == true) {
          this.varShedule =
            "Abierto: " +
            diasSemana.jueves.horaI +
            " Cierre: " +
            diasSemana.jueves.horaF;
        } else {
          this.varShedule = "Hoy no habra atencion";
        }
      } else if (dia == "viernes") {
        if (
          diasSemana.viernes.horaI != "" &&
          diasSemana.viernes.estado == true
        ) {
          this.varShedule =
            "Abierto: " +
            diasSemana.viernes.horaI +
            " Cierre: " +
            diasSemana.viernes.horaF;
        } else {
          this.varShedule = "Hoy no habra atencion";
        }
      } else if (dia == "sabado") {
        if (diasSemana.sabado.horaI != "" && diasSemana.sabado.estado == true) {
          this.varShedule =
            "Abierto: " +
            diasSemana.sabado.horaI +
            " Cierre: " +
            diasSemana.sabado.horaF;
        } else {
          this.varShedule = "Hoy no habra atencion";
        }
      } else if (dia == "domingo") {
        if (
          diasSemana.domingo.horaI != "" &&
          diasSemana.domingo.estado == true
        ) {
          this.varShedule =
            "Abierto: " +
            diasSemana.domingo.horaI +
            " Cierre: " +
            diasSemana.domingo.horaF;
        } else {
          this.varShedule = "Hoy no habra atencion";
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
        average += varaux / 7;
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
