<template>
  <div class="container-fluid">
    <Enterprise
      :name="enterpriseName"
      :enterprise="enterpriseNode"
      :image="'@/assets/enterprise.jpg'"
      section="Valoraciones y Comentarios"
    >
    </Enterprise>

    <div class="row">
      <div class="col-xl-5 col-sm-12 mt-2">
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
        {{ "(" }}{{ aux1 }}
        {{ "/5)" }}
        <h5>Presentación</h5>

        <progress max="5" :value="aux2" style="width: 80%"></progress>
        {{ "(" }}{{ aux2 }}
        {{ "/5)" }}
        <h5>Preparación</h5>

        <progress max="5" :value="aux3" style="width: 80%"></progress>
        {{ "(" }}{{ aux3 }}
        {{ "/5)" }}
        <h5>Ingredientes</h5>

        <progress max="5" :value="aux4" style="width: 80%"></progress>
        {{ "(" }}{{ aux4 }}
        {{ "/5)" }}
        <h5>Precio</h5>

        <progress max="5" :value="aux5" style="width: 80%"></progress>
        {{ "(" }}{{ aux5 }}
        {{ "/5)" }}
        <h5>Textura</h5>

        <progress max="5" :value="aux6" style="width: 80%"></progress>
        {{ "(" }}{{ aux6 }}
        {{ "/5)" }}
        <h5>Punto de cocción</h5>

        <progress max="5" :value="aux7" style="width: 80%"></progress>
        {{ "(" }}{{ aux7 }}
        {{ "/5)" }}
        <br />
        <br />
      </div>
      <div class="col-xl-7 col-md-10 col-sm-12 mt-2">
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

        <paginate ref="paginator" name="reviews" :list="reviews" :per="3">
          <div
            v-for="(comment, idx) in paginated('reviews')"
            :key="idx"
            :item="comment"
            :checkbox_use="true"
          >
            <div v-if="comment.node.comments != ''">
              <TextArea
                :email="comment.node.order.client.email"
                :comment="comment.node.comments"
              />
            </div>
          </div>
          <div class="mb-2">
            <a v-on:click="link()" type="button" class="nav-link mr-4">
              Agregar comentario
            </a>
          </div>
        </paginate>

        <div class="div-paginate d-flex justify-content-center">
          <paginate-links
            for="reviews"
            :classes="{ ul: 'pagination' }"
            :show-step-links="true"
          ></paginate-links>
        </div>
        <div class="div-paginate d-flex justify-content-center">
          <span v-if="$refs.paginator">
            Viendo {{ $refs.paginator.pageItemsCount }} resultados
          </span>
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
      reviews: [],
      enterpriseName: "",
      enterpriseNode:Object,
      ok: localStorage.getItem("existUser"),
      id: "",
      // Variable que recibe el error de la consulta
      error: null,
      calculo: 0,
      auxcont: 0,
      comments: [],
      paginate: ["reviews"],
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
      if(this.ok){
      localStorage.idComment = "";
      //localStorage.enterpriseN = "";
      this.$router.push({
        name: "AddRating",
        params: { enterpriseId: this.id },
      });
      }else{
           this.$router.push({name:"login"});
      }
    },
    async queryReviews() {
      await this.$apollo
        .query({
          query: require("@/graphql/comments/reviews.gql"),
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          console.log(response.data.allReviews);
          this.filterQuery(response.data.allReviews.edges);
          this.allReviewsMeth1();
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

    filterQuery(response) {
      this.reviews = response.filter(
        (review) => review.node.order.products.edges[0].node.enterprise.id === this.id
      );
      this.reviews.reverse();
      //this.enterpriseName = this.reviews[0].node.order.products.edges[0].node.enterprise.name;
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
      var qualityService = 0;
      var presentation = 0;
      var preparation = 0;
      var ingredients = 0;
      var price = 0;
      var texture = 0;
      var cookingPoint = 0;
      var conttam = 0;

      this.reviews.forEach((review) => {
        qualityService += this.valnum(review.node.qualityService);
        presentation += this.valnum(review.node.presentation);
        preparation += this.valnum(review.node.preparation);
        ingredients += this.valnum(review.node.ingredients);
        price += this.valnum(review.node.price);
        texture += this.valnum(review.node.texture);
        cookingPoint += this.valnum(review.node.cookingPoint);
        comments.unshift(review.node.comments);
      });

      //promedios
      if (this.reviews.length > 0) {
        conttam = this.reviews.length;
        this.auxcont = conttam;
        qualityService = Math.round(qualityService / conttam);
        this.aux1 = qualityService;
        presentation = Math.round(presentation / conttam);
        this.aux2 = presentation;
        preparation = Math.round(preparation / conttam);
        this.aux3 = preparation;
        ingredients = Math.round(ingredients / conttam);
        this.aux4 = ingredients;
        price = Math.round(price / conttam);
        this.aux5 = price;
        texture = Math.round(texture / conttam);
        this.aux6 = texture;
        cookingPoint = Math.round(cookingPoint / conttam);
        this.aux7 = cookingPoint;
        //this.comments = comments;
        var calculo = (
          (qualityService +
            presentation +
            preparation +
            ingredients +
            price +
            texture +
            cookingPoint) /
          7
        ).toFixed(1);

        this.calculo = calculo;
      }
    },
  },
  apollo: {},
  created() {
    if (localStorage.getItem("idCaught") == "") {
      this.id = this.$route.params.idCaught;
      this.enterpriseName=this.$route.params.nameenterprise;
      this.enterpriseNode=this.$route.params.enterpriseNode;
      localStorage.idCaught = this.id;
      //this.prueba();
      this.queryReviews();
    } else {
      this.id = localStorage.getItem("idCaught");
      //this.prueba();
      this.queryReviews();
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
