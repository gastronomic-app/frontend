<template>
  <div class="container-fluid">
    <div class="row mt-3">
      <div class="col-6">
        <div class="row">
          <div class="col-lg-3">
            <img
              src="@/assets/enterprise.jpg"
              class="card-img-top"
              alt="logo establecimiento"
            />
          </div>
          <div class="col-sm-autor mt-3">
            <h3>Nombre del restaurante</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-7 mt-2">
        <h2>Comentarios y calificaciones</h2>

        <h3>Promedio</h3>

        <div v-for="comment in allReviews.edges" :key="comment.node.id">
          <TextArea :review="comment.node" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextArea from "@/components/cards/TextArea.vue";

export default {
  name: "CommentsList",
  components: {
    TextArea,
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
