<template>
  <div class="container-fluid">
    <Enterprise
      :name="enterprise.name"
      :image="'@/assets/enterprise.jpg'"
      section="Valoraciones y Comentarios"
    >
    </Enterprise>

    <div class="row">
      <div class="col-5 mt-2">
        <div>
          <h5>
            <b>Puntuacion {{ calculo }}</b>
          </h5>
          <b-form-rating
            class="puntuacion mb-4 mb-0 p-0"
            variant="warning"
            v-model="calculo"
            readonly
          ></b-form-rating>
          <h6>Basado en la valoracion de {{ auxcont }} usuarios</h6>
        </div>
        <br />
        <h5>Calidad de servicios</h5>

        <progress max="5" :value="aux1" style="width: 80%"></progress>
        {{ "(" }}{{ this.aux1 }}
        {{ "/5)" }}
        <h5>Presentación</h5>

        <progress max="5" :value="aux2" style="width: 80%"></progress>
        {{ "(" }}{{ this.aux2 }}
        {{ "/5)" }}
        <h5>Preparación</h5>

        <progress max="5" :value="aux3" style="width: 80%"></progress>
        {{ "(" }}{{ this.aux3 }}
        {{ "/5)" }}
        <h5>Ingredientes</h5>

        <progress max="5" :value="aux4" style="width: 80%"></progress>
        {{ "(" }}{{ this.aux4 }}
        {{ "/5)" }}
        <h5>Precio</h5>

        <progress max="5" :value="aux5" style="width: 80%"></progress>
        {{ "(" }}{{ this.aux5 }}
        {{ "/5)" }}
        <h5>Textura</h5>

        <progress max="5" :value="aux6" style="width: 80%"></progress>
        {{ "(" }}{{ this.aux6 }}
        {{ "/5)" }}
        <h5>Punto de cocción</h5>

        <progress max="5" :value="aux7" style="width: 80%"></progress>
        {{ "(" }}{{ this.aux7 }}
        {{ "/5)" }}
        <br />
        <br />
      </div>
      <div class="col-7 mt-2">
        <h5><b>Comentarios</b></h5>
        <div class="container">
          <div class="row justify-content-center align-items-center">
            <div v-if="$apollo.loading" class="center">
              <LoadingGraphql />
              <p>Loading...</p>
            </div>
            <!--Cuando sucede un error-->
            <div v-else-if="error" class="d-flex justify-content-center mt-5">
              <ConnectionErrorGraphql />
            </div>
          </div>
        </div>

        <div v-for="(item, indice) in this.comments" v-bind:key="indice">
          <div v-if="item.review.comments != ''">
            <TextArea
              :email="item.client.email"
              :comment="item.review.comments"
            />
          </div>
        </div>
        <div class="mb-2">
          <a v-on:click="link()" type="button" class="nav-link mr-4">
            Agregar comentario
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextArea from "@/components/cards/TextArea.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";
import Enterprise from "@/components/order/Enterprise.vue";

export default {
  name: "CommentsList",
  components: {
    TextArea,
    LoadingGraphql,
    ConnectionErrorGraphql,
    Enterprise,
  },
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      enterprise: Object,
      enterpriseName: "",
      id: "",
      // Variable que recibe el error de la consulta
      error: null,
      calculo: 0,
      auxcont: 0,
      comments: [],
      aux1: 0,
      aux2: 0,
      aux3: 0,
      aux4: 0,
      aux5: 0,
      aux6: 0,
      aux7: 0,
      conttam: 0,
    };
  },
  methods: {
    link() {
      localStorage.idComment = "";
      localStorage.enterpriseN = "";
      this.$router.push({
        name: "AddRating",
        params: { enterpriseId: this.id, enterpriseName: this.enterprise.name },
      });
    },
    async prueba() {
      await this.$apollo
        .query({
          query: require("@/graphql/comments/allReviews.gql"),
          variables: {
            id: this.id,
          },
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          this.enterprise = response.data.enterprise;
          this.allReviewsMeth1();
        });
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
      if (this.enterprise.products.edges.length === 0) {
        return;
      }
      for (
        var product = 0;
        product < this.enterprise.products.edges.length;
        product++
      ) {
        if (
          this.enterprise.products.edges[product].node.orders.edges.length !== 0
        ) {
          for (
            var order = 0;
            order <
            this.enterprise.products.edges[product].node.orders.edges.length;
            order++
          ) {
            if (
              this.enterprise.products.edges[product].node.orders.edges[order]
                .node.review !== null
            ) {
              comments.push(
                this.enterprise.products.edges[product].node.orders.edges[order]
                  .node
              );

              aux1 =
                aux1 +
                this.valnum(
                  this.enterprise.products.edges[product].node.orders.edges[
                    order
                  ].node.review.qualityService
                );
              aux2 =
                aux2 +
                this.valnum(
                  this.enterprise.products.edges[product].node.orders.edges[
                    order
                  ].node.review.presentation
                );
              aux3 =
                aux3 +
                this.valnum(
                  this.enterprise.products.edges[product].node.orders.edges[
                    order
                  ].node.review.preparation
                );
              aux4 =
                aux4 +
                this.valnum(
                  this.enterprise.products.edges[product].node.orders.edges[
                    order
                  ].node.review.ingredients
                );
              aux5 =
                aux5 +
                this.valnum(
                  this.enterprise.products.edges[product].node.orders.edges[
                    order
                  ].node.review.price
                );
              aux6 =
                aux6 +
                this.valnum(
                  this.enterprise.products.edges[product].node.orders.edges[
                    order
                  ].node.review.textures
                );
              aux7 =
                aux7 +
                this.valnum(
                  this.enterprise.products.edges[product].node.orders.edges[
                    order
                  ].node.review.cookingPoint
                );
            }
          }
        }
      }

      //promedios
      if (comments.length > 0) {
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
        var calculo = ((aux1 + aux2 + aux3 + aux4 + aux5 + aux7) / 7).toFixed(
          1
        );

        this.calculo = calculo;
      }
    },
  },
  apollo: {},
  created() {
    if (localStorage.getItem("idCaught") == "") {
      this.id = this.$route.params.idCaught;
      localStorage.idCaught = this.id;
      this.prueba();
    } else {
      this.id = localStorage.getItem("idCaught");
      this.prueba();
    }
  },
  mounted() {},
};
</script>
<style>
.puntuacion {
  border: none;
}
</style>
