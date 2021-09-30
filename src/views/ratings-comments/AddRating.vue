<template>
  <div class="container-fluid">
    <Enterprise
      :name="enterpriseName"
      :image="'@/assets/enterprise.jpg'"
      section="Comentarios y calificaciones"
    ></Enterprise>
    <div class="row">
      <div class="col-6 col-xs-12 pl-0">
        <b-container>
          <b-row class="mt-4">
            <b-col md="2" class="mb-3">
              <b-icon icon="person-circle" font-scale="3"></b-icon>
            </b-col>
            <b-col sm="8" class="">
              <label for="">Nombre del usuario</label>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="10">
              <h6>Calidad del servicio</h6>
              <b-form-input
                id="range-1"
                v-model="quality"
                type="range"
                min="0"
                max="50"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
               {{define_Range(quality)}}
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="10">
              <h6 for="range-2">Presentación del producto</h6>
              <b-form-input
                id="range-2"
                v-model="presentation"
                type="range"
                min="0"
                max="50"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
               {{define_Range(presentation)}}
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="10">
              <h6 for="range-2">Preparación</h6>
              <b-form-input
                id="range-4"
                v-model="preparation"
                type="range"
                min="0"
                max="50"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{define_Range(preparation)}}
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="10">
              <h6 for="range-2">Ingredientes</h6>
              <b-form-input
                id="range-5"
                v-model="ingredients"
                type="range"
                min="0"
                max="50"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{define_Range(ingredients)}}
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="10">
              <h6 for="range-2">Precio</h6>
              <b-form-input
                id="range-3"
                v-model="price"
                type="range"
                min="0"
                max="50"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{define_Range(price)}}
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="10">
              <h6 for="range-2">Textura</h6>
              <b-form-input
                id="range-6"
                v-model="texture"
                type="range"
                min="0"
                max="50"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{define_Range(texture)}}
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="10">
              <h6 for="range-2">Punto de cocción</h6>
              <b-form-input
                id="range-7"
                v-model="cooking"
                type="range"
                min="0"
                max="50"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{define_Range(cooking)}}
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="col-md-6 col-xs-12">
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
          <b-col lg="6" class="ml-5 text-center">
          <b-button class="mr-3" v-on:click="redirectComments()"
           size="sm" 
           variant="warning" 
           style="background:yellow" 
           >Cancelar</b-button>
          <b-button  
          size="sm"
          variant="warning" style="background:orange"
          v-on:click="save()">
          Guardar
          </b-button></b-col>
        </b-row>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import Enterprise from "@/components/order/Enterprise.vue";
export default {
  name: "CommentsList",
  components: {
    Enterprise,
  },
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
      idOrder : "",
    };
  },
  methods:{
    redirectComments(){
      this.$router.push({name: "CommentsList"});
    },
    mostrarValores(){
      //método no funcional, solo para comprobar
      console.log(this.define_Range(this.quality));
      console.log(this.define_Range(this.presentation));
      console.log("Presen : ",this.define_Range(this.preparation));
      console.log("Ingredients: ",this.define_Range(this.ingredients));
      console.log("Price: ",this.define_Range(this.price));
      console.log("texture: ",this.define_Range(this.texture));
      console.log("cooking: ",this.define_Range(this.cooking));
      console.log("Coment: ",this.comment);
    },
    define_Range(valor){
      if(valor <= 15){
        return "Malo"
      }else if(valor <= 35){
        return "Regular"
      }else if(valor <= 50){
        return "Bueno"
      }
    },
    define_Range_BD(valor){
      if(valor <= 15){
        return "malo"
      }else if(valor <= 35){
        return "regular"
      }else if(valor <= 50){
        return "bueno"
      }
    },
    save(){
      console.log("Pasando por Guardar");
      this.idOrder="T3JkZXJOb2RlOjEz";
      this.mostrarValores();
      this.$apollo
          .mutate({
            // Establece la mutación de crear
            mutation: require("@/graphql/order/addComent.gql"),
            // Define las variables
            variables: {
              qualityService:this.define_Range_BD(this.quality),
              presentation:this.define_Range_BD(this.presentation),
              preparation:this.define_Range_BD(this.preparation),
              ingredients:this.define_Range_BD(this.ingredients),
              price:this.define_Range_BD(this.price),
              textures:this.define_Range_BD(this.texture),
              cookingPoint:this.define_Range_BD(this.cooking),
              comments:this.comment,
              orderId:this.idOrder,              
            },
          }).then((response) => {
            
            console.log("creación de Comment:", response.data);
          });
          //Redirigir a lista de comentarios.          
          this.redirectComments();
    }
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
