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
      <div class="col-6 mt-2">
        <br />
        <h2>Comentarios y calificaciones</h2>
        <b-container>
          <b-row>
            <b-col sm="2"
              ><b-col md="6" class="mb-3">
                <b-icon
                  icon="person-circle"
                  animation="fade"
                  font-scale="4"
                ></b-icon>
              </b-col>
            </b-col>
            <b-col sm="10" class="mt-4">
              <label for="">Nombre del usuario</label>
            </b-col>
          </b-row>
          <b-row class="ml-1">
            <b-col sm="10">
              <h6>Calidad del servicio</h6>
              <b-form-input
                id="range-1"
                v-model="quality"
                type="range"
                min="0"
                max="5"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ quality }}
            </b-col>
          </b-row>
          <b-row class="ml-1">
            <b-col sm="10">
              <h6 for="range-2">Presentación del producto</h6>
              <b-form-input
                id="range-2"
                v-model="presentation"
                type="range"
                min="0"
                max="5"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ presentation }}
            </b-col>
          </b-row>
          <b-row class="ml-1">
            <b-col sm="10">
              <h6 for="range-2">Preparación</h6>
              <b-form-input
                id="range-4"
                v-model="preparation"
                type="range"
                min="0"
                max="5"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ preparation }}
            </b-col>
          </b-row>
          <b-row class="ml-1">
            <b-col sm="10">
              <h6 for="range-2">Ingredientes</h6>
              <b-form-input
                id="range-5"
                v-model="ingredients"
                type="range"
                min="0"
                max="5"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ ingredients }}
            </b-col>
          </b-row>
          <b-row class="ml-1">
            <b-col sm="10">
              <h6 for="range-2">Precio</h6>
              <b-form-input
                id="range-3"
                v-model="price"
                type="range"
                min="0"
                max="5"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ price }}
            </b-col>
          </b-row>
          <b-row class="ml-1">
            <b-col sm="10">
              <h6 for="range-2">Textura</h6>
              <b-form-input
                id="range-6"
                v-model="texture"
                type="range"
                min="0"
                max="5"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ texture }}
            </b-col>
          </b-row>
          <b-row class="ml-1">
            <b-col sm="10">
              <h6 for="range-2">Punto de cocción</h6>
              <b-form-input
                id="range-7"
                v-model="cooking"
                type="range"
                min="0"
                max="5"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ cooking }}
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="col-6">
        <br /><br />
        <b-row><label for="" class="mt-5">Agregar comentario</label></b-row>
        <b-row>
          <div role="group">
            <b-form-textarea
              name=""
              id="text-area"
              cols="40"
              rows="5"
              v-model="comment"
              :state="commentState"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="Ingrese un cometario sobre el pedido"
              trim
            ></b-form-textarea>
            <b-form-invalid-feedback id="input-live-feedback">
              Ingrese un comentario
            </b-form-invalid-feedback>
          </div>
        </b-row>
        <br />
        <b-row>
          <b-col lg="6" class="pb-2 text-center"
            ><b-button size="sm" variant="warning">Guardar</b-button></b-col
          >
        </b-row>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
export default {
  name: "CommentsList",
  components: {},
  data() {
    return {
      // Variable que recibe los resultados
      // de la consulta definida en la sección apollo
      allReviews: Object,
      // Variable que recibe el error de la consulta
      error: null,
      quality: 0,
      presentation: 0,
      preparation: 0,
      ingredients: 0,
      price: 0,
      texture: 0,
      cooking: 0,
      comment: "",
    };
  },
  computed: {
    commentState() {
      return this.comment.length > 2 ? true : false;
    },
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
