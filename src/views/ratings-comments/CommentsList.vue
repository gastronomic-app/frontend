<template>
  <div class="container-fluid">
    <Enterprise
      name="enterpriseName"
      :image="'@/assets/enterprise.jpg'"
      section="Comentarios y calificaciones"
    ></Enterprise>
    <div class="row">
      <div class="col-5 mt-2">
        <h5>Promedio</h5>
        <br />
        <p>Aqui irían los promedios de las calificaciones totales</p>
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
          
          <a href="../add-Rating">
          Agregar comentario</a>
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
      allReviews: Object,
      // Variable que recibe el error de la consulta
      error: null,
    };
  },
  apollo: {
    allReviews: {
      // Consulta
      query: require("@/graphql/order/allReviews.gql"),
      //línea para actualizar
      fetchPolicy: "no-cache",
      // Asigna el error a la variable definida en data
      error(error) {
        this.error = JSON.stringify(error.message);
      },
    },
  },
};
</script>
