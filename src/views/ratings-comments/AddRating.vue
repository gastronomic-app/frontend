<template>
  <div class="container-fluid">
    <Enterprise
      :name="enterpriseName"
      :enterprise="enterpriseNode"
      section="Comentarios y calificaciones"
    ></Enterprise>
    <div class="row">
      <div class="col-xl-6 col-md-12 col-xs-12 pl-0">
        <b-container class="mt-3">
          <b-row class="mb-3">
            <b-col sm="10">
              <h6 for="range-2" class="mb-0">Calidad del servicio</h6>
              <b-form-input id="range-1" v-model="quality" type="range" min="0" max="50">
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ define_Range(quality) }}
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col sm="10">
              <h6 for="range-2" class="mb-0">Presentación del producto</h6>
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
          <b-row class="mb-3">
            <b-col sm="10">
              <h6 for="range-2" class="mb-0">Preparación</h6>
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
          <b-row class="mb-3">
            <b-col sm="10">
              <h6 for="range-2" class="mb-0">Ingredientes</h6>
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
          <b-row class="mb-3">
            <b-col sm="10">
              <h6 for="range-2" class="mb-0">Precio</h6>
              <b-form-input id="range-3" v-model="price" type="range" min="0" max="50">
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ define_Range(price) }}
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col sm="10">
              <h6 for="range-2" class="mb-0">Textura</h6>
              <b-form-input id="range-6" v-model="texture" type="range" min="0" max="50">
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ define_Range(texture) }}
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="10">
              <h6 for="range-2" class="mb-0">Punto de cocción</h6>
              <b-form-input id="range-7" v-model="cooking" type="range" min="0" max="50">
              </b-form-input>
            </b-col>
            <b-col sm="2" class="mt-4">
              {{ define_Range(cooking) }}
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="col-xl-6 col-md-12 col-xs-12">
        <b-row><label for="" class="">Agregar comentario</label></b-row>
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

        <div class="contenedor_botones">
          <div class="botonuno">
            <b-button
              class="btn btn-success btn_orderguardar"
              size="sm"
              v-on:click="save()"
            >
              Guardar
            </b-button>
          </div>
          <div class="botondos">
            <b-button class="btn btn_ordercancelar mr-3" v-on:click="back()" size="sm"
              >Cancelar</b-button
            >
          </div>
        </div>
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
      enterpriseNode: Object,
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
      emailUser: "",
    };
  },
  mounted() {
    if (localStorage.getItem("enterpriseN")) {
      this.enterpriseName = localStorage.getItem("enterpriseN");
    }
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
          this.enterpriseName = this.enterprise.name;
          localStorage.enterpriseN = this.enterpriseName;
          //this.save();
        });
    },
    makeToast(variant = null, title, info, time) {
      console.log("Entro make toast");
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },
    back() {
      this.$router.push({
        name: "CommentsList",
        params: { idCaught: this.id },
      });
    },
    link(mensaje, tipo) {
      this.$router
        .push({ name: "CommentsList", params: { idCaught: this.id } })
        .then(() => {
          this.makeToast(tipo, "Mensaje", mensaje, 3000);
        });
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
        console.log("Email: ", user.email);
        console.log("Id Cliente:  ", this.idClient);
      }
    },
    sendData() {
      console.log("Pasando por Guardar");
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

    save() {
      let bnd_comment = 0;
      let bnd_review = 0;
      let bnd_received = 0;
      //if (this.enterprise.products.edges.length == 0) {
      //console.log("Empresa no tiene productos");
      //}else{
      for (var product = 0; product < this.enterprise.products.edges.length; product++) {
        if (this.enterprise.products.edges[product].node.orders.edges.length !== 0) {
          for (
            var order = 0;
            order < this.enterprise.products.edges[product].node.orders.edges.length;
            order++
          ) {
            if (
              this.enterprise.products.edges[product].node.orders.edges[order].node !==
              null
            ) {
              this.update();
              //Condición para validar que el usuario registrado tenga ordenes
              if (
                this.emailUser ==
                this.enterprise.products.edges[product].node.orders.edges[order].node
                  .client.email
              ) {
                //Guardo id de la orden
                this.idOrder = this.enterprise.products.edges[product].node.orders.edges[
                  order
                ].node.id;
                //Mostramos review
                if (
                  this.enterprise.products.edges[product].node.orders.edges[order].node
                    .review != null
                ) {
                  bnd_review++;
                }
                //Aumentamos Bandera de que tiene orden
                bnd_comment++;
                if (
                  this.enterprise.products.edges[product].node.orders.edges[order].node
                    .status == "ENTREGADO"
                ) {
                  bnd_received++;
                }
              }
            }
          }
        }
      }

      /*if (bnd_review == 0 && bnd_comment != 0) {
        this.sendData();
        this.link("Su valoración fue registrada", "success");
      }*/
      if (bnd_comment == 0) {
        this.link("Usted no ha efectuado una orden", "danger");
      }

      if (bnd_review != 0) {
        this.link("Usted ya ha efectuado una valoración", "danger");
      }

      if (bnd_review == 0 && bnd_received != 0) {
        this.sendData();
        this.link("Su valoración fue registrada", "success");
      } else {
        this.link("Solo puedes valorar cuando tu pedido se te haya entregado.", "danger");
      }
    },
  },
  computed: {
    commentState() {
      return this.comment.length > 2 ? true : false;
    },
  },
  async created() {
    if (
      localStorage.getItem("idComment") == ""
      //&&
      //localStorage.getItem("enterpriseN") == ""
    ) {
      this.id = this.$route.params.enterpriseId;
      //this.enterpriseName = this.$route.params.enterpriseName;
      localStorage.idComment = this.id;
      //localStorage.enterpriseN = this.enterpriseName;
      this.showComent();
    }
    if (this.$route.params.enterpriseNode == undefined) {
      await this.$apollo
        .query({
          // Consulta
          query: require("@/graphql/enterprise/allEnterprises.gql"),
        })
        .then((response) => {
          this.Enterprises = response.data.allEnterprises.edges;
          //this.pages = response.data.allEnterprises.edges.length;
        });

      this.Enterprises.forEach((element) => {
        if (element.node.name == localStorage.getItem("enterpriseName")) {
          this.enterpriseNode = element.node;
          this.enterpriseName = element.node.name;
        }
      });
    } else {
      this.enterpriseNode = this.$route.params.enterpriseNode;
    }
  },
};
</script>
<style scoped>
.btn_ordercancelar {
  background-color: var(--orange-x);
  color: var(--dark);
  border: none;
}

.btn_orderguardar:focus {
  box-shadow: 0 0 0 2px var(--orange-x-focus), 0 0 0 0px var(--orange-x-hover);
}
.btn_ordercancelar:hover {
  background: var(--orange-x-hover);
  color: var(--dark);
}
.btn_ordercancelar:focus {
  box-shadow: 0 0 0 2px var(--orange-x-focus), 0 0 0 0px var(--orange-x-hover);
}
.contenedor_botones {
  display: flex;
  width: 75%;
}
.botonuno {
  width: 100%;
}
</style>
