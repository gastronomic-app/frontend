<template>
  <div class="wrapper fadeInDown align-self-lg-center ">
    <h1>Actualizar Datos</h1>
    <div class="card-body container align-self-center">
      <form >
        <div class="col-md-6 mb-3">
          <label for="validationNombre">Nombre<span class="text-danger">*</span></label
          >
          <div class="form-group">
          <input
            type="text"
            class="form-control"
            id="validationNombre"
            v-model="name"
            required
            aria-describedby="name"
          />
          </div>
          <div class="invalid-feedback">Es necesario escribir el nombre.</div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="validationNombre">Apelido<span class="text-danger">*</span></label>
          <div class="form-group">
        <input
            type="text"
            class="form-control"
            id="validationNom"
            v-model="lastname"
            required
          />
          </div>
          <div class="invalid-feedback">Es necesario escribir el apellido.</div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="validationLocaliza"
            >Localización<span class="text-danger">*</span></label
          >
          <div class="form-group">
          <input
            type="text"
            class="form-control"
            id="validationLocaliza"
            v-model="localizacion"
            required
          />
          </div>
          <div class="invalid-feedback">
            Es necesario escribir la Localización.
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="validationTelefono"
            >Telefono<span class="text-danger">*</span></label
          >
          <div class="form-group">
          <input
            type="text"
            class="form-control"
            id="validationtelefono"
            v-model="telephone"
            required
          />
          </div>
          <div class="invalid-feedback">
            Es necesario escribir el telefono.
          </div>
        </div>
      </form>
      <button class="btn btn-primary fadeIn third"
          @click="editContact()"
          type="submit">Guardar información</button>


         <button
          :disabled ="deshabilitar()"
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModalCenter"
          >Cambiar Contraseña</button>

          <!-- Modal -->
          <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">Cambiar Contraseña</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
            <center>
                    <div
                     class="col-md-6 mb-3">
                <label for="inputContraseña"
                  >Contraseña Antigua<span class="text-danger">*</span></label
                >
                <input
                  type="password"
                  id="inputPassword5"
                  class="form-control"
                  aria-describedby="passwordHelpBlock"
                  required
                  v-model="passwordA"
                />
                <div class="invalid-feedback">
                  Es necesario escribir la contraseña.
                </div>
                <small id="passwordHelpBlock" class="form-text text-muted">
                  Su contraseña debe tener entre 8 a 20 caracteres.
                </small>
                <div >
                  <label for="inputContraseñaConf"
                    > Nueva Contraseña<span class="text-danger">*</span></label
                  >
                  <input
                    type="password"
                    id="inputPasswordMo"
                    class="form-control"
                    aria-describedby="passwordHelpBlock"
                    required
                    v-model="passwordN"
                  />
                  <div class="invalid-feedback">
                    Es necesario escribir la nueva contraseña.
                  </div>
                </div>
                 <div >
                  <label for="inputContraseñaConf"
                    > Confirmar Nueva Contraseña<span class="text-danger">*</span></label
                  >
                  <input
                    type="password"
                    id="inputPasswordM"
                    class="form-control"
                    aria-describedby="passwordHelpBlock"
                    required
                    v-model="passwordC"
                  />
                  <div class="invalid-feedback">
                    Es necesario escribir la confirmación nueva contraseña.
                  </div>
                </div>
              </div>
        </center>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  <button @click="comprobarPassword()" type="button" data-dismiss="modal" class="btn btn-primary">Guardar cambios</button>
                </div>
              </div>
            </div>
          </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Editar",
  data() {
    return {
      name: "",
      lastname: "",
      localizacion: "",
      telephone: "",
      password: "",
      passwordA: "",
      passwordN: "",
      passwordC: "",
      id: "",
      is_alternative:"",
      idAux: "",
    };
  },
  async mounted() {
    console.log("id en el formulario", this.id);
    if(null === localStorage.getItem('hayUser') || false === localStorage.getItem('hayUser')){
      this.$router.push({ name: "ExampleList" });
    }else{
    if (this.id) {
      await this.$apollo
        .query({
          query: require("@/graphql/user/user.gql"),
          variables: {
            id: this.id,
          },
        })
        .then((response) => {
          this.name = response.data.user.contact.edges[0].node.names;
          this.lastname = response.data.user.contact.edges[0].node.lastnames;
          this.localizacion = response.data.user.contact.edges[0].node.location;
          this.telephone = response.data.user.contact.edges[0].node.telephone;
          this.is_alternative = response.data.user.isAlternative;
          console.log("1 es google:", response.data.user.isAlternative);

          this.password = response.data.user.password;
          this.idAux =response.data.user.contact.edges[0].node.id;
        });
    }
    }
  },
  methods: {
    makeToast(variant = null, title, info, tiempo) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: tiempo,
        variant: variant,
        solid: true,
      });
    },
    async editContact() {
      await this.$apollo
        .mutate({
          // Establece la mutación de editar
          mutation: require("@/graphql/client/updateContact.gql"),
          // Define las variables
          variables: {
            id: this.idAux,
            names: this.name,
            lastnames :  this.lastname,
            location : this.localizacion,
            telephone : this.telephone,
          },
          // Actualiza el cache de GraphQL para visualizar la eliminación
        // al momento de cargar la vista
        refetchQueries: [
          { query: require("@/graphql/user/user.gql"),
            variables:{
              id: this.id
            },
          },
        ],
        })
        // El método mutate devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          //localStorage.setItem('names', this.name);
          console.log("actualización de contacto:", response.data);
          //Llenar cache
        let user = JSON.parse(localStorage.getItem('user'));
        user.names = this.name;
        localStorage.setItem("user", JSON.stringify(user));
           this.$router.push({ name: "ExampleList" }).then(() => {
                this.makeToast(
                  "success",
                  "Actualizado",
                  "La información de usuario ha sido actualizada",
                  3000
                );
              });

        });
    },
      async editPassword() {
      await this.$apollo
        .mutate({
          // Establece la mutación de editar
          mutation: require("@/graphql/client/updateClient.gql"),
          // Define las variables
          variables: {
            id: this.id,
            password : this.passwordN,
          },
          // Actualiza el cache de GraphQL para visualizar la eliminación
        // al momento de cargar la vista
        refetchQueries: [
          { query: require("@/graphql/user/allUsers.gql"),
            variables:{
              id: this.id
            },

          },
        ],
        })
        // El método mutate devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          console.log("actualización de contrasenia:", response.data);
          this.password=this.passwordN;
          this.makeToast(
                  "success",
                  "Actualizada",
                  "La contraseña ha sido actualizada",
                  3000
                );
        });
    },

  deshabilitar(){
      console.log("quitar:", this.is_alternative);
      return this.is_alternative;
  },
  comprobarPassword(){
     if(this.password == this.passwordA){
      if(this.passwordN == this.passwordC){
          this.editPassword()
      }else{
        this.makeToast(
                  "danger",
                  "Contraseñas",
                  "No coincide las contraseñas nuevas",
                  3000
                );
      }
    }else{
      this.makeToast(
                  "danger",
                  "Contraseña",
                  "No coinciden la contraseña antigua",
                  3000
                );
    }
  },
},
  /**
   * Ciclo de vida del componente
   * donde obtiene el parametro id pasado por la url
   */
  created() {
    this.id = this.$route.params.id;
  },
};
</script>
