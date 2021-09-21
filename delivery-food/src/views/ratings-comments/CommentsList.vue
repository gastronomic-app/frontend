<template>
  <div class="container-fluid">
    <div class="row mt-2">
      <div class="col-6">
        <div class="row">
          <div class="col-lg-4 pl-0">
            <img
              src="@/assets/enterprise.jpg"
              class="card-img-top"
              alt="logo establecimiento"
            />
          </div>
          <div class="col-sm-autor mt-4">
            <h3>Nombre del restaurante</h3>
          </div>
        </div>
      </div>
    </div>
    <SubTitle content="Comentarios y calificaciones"></SubTitle>
    <div class="row">
      <div class="col-5 mt-2">
        <h2>Promedio</h2>
        <br />
        <h5>Aqui irían los promedios de las calificaciones totales</h5>
      </div>
      <div class="col-7 mt-2">
        <h2>Comentarios</h2>
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
        <div v-for="comment in allReviews.edges" :key="comment.node.id">
          <TextArea :review="comment.node" />
        </div>
        <div>
          <a href="#" class="stretched-link">Agregar comentario</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextArea from "@/components/cards/TextArea.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";
import ConnectionErrorGraphql from "@/components/common/ConnectionErrorGraphql.vue";
import SubTitle from "@/components/cards/SubTitles.vue";

export default {
  name: "CommentsList",
  components: {
    TextArea,
    SubTitle,
    LoadingGraphql,
    ConnectionErrorGraphql,
  },
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allReviews: Object,
      // Variable que recibe el error de la consulta
      error: null,
    };
  },
  apollo: {
    allReviews: {
      // Consulta
      query: require("@/graphql/comments/allReviews.gql"),
      // Asigna el error a la variable definida en data
      error(error) {
        this.error = JSON.stringify(error.message);
      },
    },
  },
};
</script>
