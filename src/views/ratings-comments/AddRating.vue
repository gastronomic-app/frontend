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
              {{ define_Range(quality) }}
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
              {{ define_Range(presentation) }}
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
              {{ define_Range(preparation) }}
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
              {{ define_Range(ingredients) }}
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
              {{ define_Range(price) }}
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
              {{ define_Range(texture) }}
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
              {{ define_Range(cooking) }}
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
            <b-button
              class="mr-3 btn_order"
              v-on:click="link()"
              size="sm"
              >Cancelar</b-button
            >
            <b-button class="btn_order"
              size="sm"
              v-on:click="save()"
            >
              Guardar
            </b-button></b-col
          >
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
      enterprise: Object,
      enterpriseName: "",
      ok: localStorage.getItem("existUser"),
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
      idOrder: "",
      idClient: "",
      emailUser:"",
    };
  },
  methods: {
    async showComent() {
      await this.$apollo
        .query({
          query: require("@/graphql/comments/allOrder.gql"),
          variables: {
            id: this.id,
          },
          //línea para actualizar
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          this.enterprise = response.data.enterprise;
          
          //this.save();
        });
    },
    mostrarValores() {
      //método no funcional, solo para comprobar
      console.log(this.define_Range(this.quality));
      console.log(this.define_Range(this.presentation));
      console.log("Presen : ", this.define_Range(this.preparation));
      console.log("Ingredients: ", this.define_Range(this.ingredients));
      console.log("Price: ", this.define_Range(this.price));
      console.log("texture: ", this.define_Range(this.texture));
      console.log("cooking: ", this.define_Range(this.cooking));
      console.log("Coment: ", this.comment);
    },
    define_Range(valor) {
      if (valor <= 15) {
        return "Malo";
      } else if (valor <= 35) {
        return "Regular";
      } else if (valor <= 50) {
        return "Bueno";
      }
    },
    define_Range_BD(valor) {
      if (valor <= 15) {
        return "malo";
      } else if (valor <= 35) {
        return "regular";
      } else if (valor <= 50) {
        return "bueno";
      }
    },
    update() {
      //console.log("creacion");
      this.ok = localStorage.getItem("existUser");
      if (this.ok) {
        let user = JSON.parse(localStorage.getItem("user"));
        this.idClient = user.id;
        this.emailUser = user.email;
        console.log("Email: ",user.email)
        console.log("Id Cliente:  ", this.idClient);
      }
    },
    sendData(){
       console.log("Pasando por Guardar");
      //this.idOrder = "T3JkZXJOb2RlOjEz";
      //this.mostrarValores();
      this.$apollo
        .mutate({
          // Establece la mutación de crear
          mutation: require("@/graphql/order/addComent.gql"),
          // Define las variables
          variables: {
            qualityService: this.define_Range_BD(this.quality),
            presentation: this.define_Range_BD(this.presentation),
            preparation: this.define_Range_BD(this.preparation),
            ingredients: this.define_Range_BD(this.ingredients),
            price: this.define_Range_BD(this.price),
            textures: this.define_Range_BD(this.texture),
            cookingPoint: this.define_Range_BD(this.cooking),
            comments: this.comment,
            orderId: this.idOrder,
          },
          //línea para actualizar
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          console.log("creación de Comment:", response.data);
        });
        
    },
    link(){
      localStorage.idCaught= "";
      //localStorage.enterpriseC = "";
      console.log("datos : ",this.id)
      this.$router.push({ name: "CommentsList", params:{idCaught:this.id} });
    },
    save() {
      let bnd_comment=0;
      let bnd_review=0;
      console.log("Entro en save");
      //if (this.enterprise.products.edges.length == 0) {
        //console.log("Empresa no tiene productos");
        //}else{
        for (
        var product = 0;
        product < this.enterprise.products.edges.length;
        product++
      ) {
        console.log("Número empresa: ",product);
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
                .node !== null
            ) {
              this.update();
                //Condición para validar que el usuario registrado tenga ordenes
                if((this.emailUser == this.enterprise.products.
                edges[product].node.orders.edges[order].node.client.email)){
                    //Guardo id de la orden
                    console.log("TIENE ORDEN")
                    this.idOrder=this.enterprise.products.edges[product].node.orders
                    .edges[order].node.id
                    //Mostramos review
                    if(this.enterprise.products.edges[product].node.orders.edges[order].node.review!=null){
                      bnd_review++;
                    }
                    //Aumentamos Bandera de que tiene orden
                    bnd_comment++;
                }else{
                  console.log("No entró");
                }              
            }
            
          }
        }
      }
     
      if(bnd_review==0 && bnd_comment!=0){
        //console.log("Entro en sendData")
        this.sendData();
        this.link();
      }
      if(bnd_review!=0){
        confirm("Ya tiene un comentario");
        this.link();
      }
 
      if(bnd_comment==0){
        confirm("No tiene orden");
        this.link();
      }
      }
      //confirm("Empresa no tiene producto");
      //this.link();
      //},
  },
  computed: {
    commentState() {
      return this.comment.length > 2 ? true : false;
    },
  },
  created() {
    if ((localStorage.getItem("idComment") == "" ) && (localStorage.getItem("enterpriseN")=="")) {

      this.id = this.$route.params.enterpriseId;
      this.enterpriseName = this.$route.params.enterpriseName;
      localStorage.idComment = this.id;
      localStorage.enterpriseN = this.enterpriseName;
      console.log("Id Recibido : ",this.id,"---",this.enterpriseName);
      this.showComent();
    }
  },
};
</script>
<style scoped>
.btn_order {
  background-color: var(--dark-xx);
  color: var(--orange);
}
.btn_order:hover {
  background: var(--grey-hover);
  color: var(--dark);
}
.btn_order:focus {
  box-shadow: 0 0 0 1px var(--orange), 0 0 0 1px var(--white);
}
</style>
