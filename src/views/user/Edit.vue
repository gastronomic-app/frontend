<template>
    <div class="wrapper fadeInDown align-self-lg-center">
        <h1>Actualización de datos</h1>
          <div class="card-body container align-self-center">
              <div class="form-group">
                  <label for="validationName"
                  >Nombre<span class="text-danger">*</span></label          >
                  <input
                      type="text"
                      class="form-control"
                      id="validationName"
                      v-model="name"
                      aria-describedby="name"
                      required
                  />
                  <label for="validationLastname"
                      >Apelido<span class="text-danger">*</span></label
                  >
                  <input
                      type="text"
                      class="form-control"
                      id="validationLastname"
                      v-model="lastname"
                      required
                  />
                  <label for="validationTelephone"
                      >Telefono<span class="text-danger">*</span></label
                  >
                  <input
                      type="text"
                      class="form-control"
                      id="validationTelephone"
                      v-model="telephone"
                      required
                  />
                  <!-- geolocalizacion-->
                  <label for="validationLocation"
                      >Localización<span class="text-danger">*</span></label
                  >
                  <Geolocation v-on:value="newLocation" showmap="True" />
                  <br>
                  <!-- geolocalizacion  -->
                  <button
                      @click="editContact()"
                      type="submit"
                      class="btn btn-outline-primary"
                      >
                      Guardar información
                  </button>

                  <button
                      :disabled="disable()"
                      type="button"
                      class="btn btn-primary"
                      data-toggle="modal"
                      data-target="#exampleModalCenter"
                      >
                      Cambiar Contraseña
                  </button>
              </div>
          </div>
        <!-- Modal -->
        <div
            class="modal fade"
            id="exampleModalCenter"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">
                            Cambiar Contraseña
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <center>
                            <form>
                                <div class="col-md-6 mb-3">
                                    <label for="inputContraseña">
                                        Contraseña Antigua<span class="text-danger"
                                        >*</span
                                    ></label                                >
                                    <input
                                    type="password"
                                    id="inputPassword5"
                                    class="form-control"
                                    aria-describedby="passwordHelpBlock"
                                    required
                                    v-model="passwordOld"
                                    />
                                    <div class="invalid-feedback">
                                        Es necesario escribir la contraseña.
                                    </div>
                                    <small id="passwordHelpBlock" class="form-text text-muted">
                                        Su contraseña debe tener entre 8 a 20 caracteres.
                                    </small>
                                    <div>
                                        <label for="inputPasswordNew">
                                            Nueva Contraseña<span class="text-danger"
                                            >*</span
                                        ></label>
                                        <input
                                            type="password"
                                            id="inputPasswordNew"
                                            class="form-control"
                                            aria-describedby="passwordHelpBlock"
                                            required
                                            v-model="passwordNew"
                                        />
                                        <div class="invalid-feedback">
                                            Es necesario escribir la nueva contraseña.
                                        </div>
                                    </div>
                                    <div>
                                        <label for="inputPasswordConfirmation">
                                            Confirmar Nueva Contraseña<span class="text-danger"
                                            >*</span>
                                        </label>
                                        <input
                                            type="password"
                                            id="inputPasswordConfirmation"
                                            class="form-control"
                                            aria-describedby="passwordHelpBlock"
                                            required
                                            v-model="passwordConfirmation"
                                        />
                                        <div class="invalid-feedback">
                                            Es necesario escribir la confirmación nueva contraseña.
                                        </div>
                                    </div>
                                </div>
                                <button
                                    @click="checkPassword()"
                                    type="button"
                                    data-dismiss="modal"
                                    class="btn btn-primary"

                                >
                                    Guardar cambios
                                </button>
                            </form>
                        </center>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Geolocation from "@/components/geolocation/Geolocation.vue"
export default {
  name: "Edit",
  components: {
    Geolocation
  },
  data() {
    return {
      name: "",
      lastname: "",
      location: "",
      telephone: "",
      password: "",
      passwordOld: "",
      passwordNew: "",
      passwordConfirmation: "",
      id: "",
      is_alternative: "",
      idAux: "",
      go: false
    };
  },
  async mounted() {
    if (
      null === localStorage.getItem("existUser") ||
      false === localStorage.getItem("existUser")
    ) {
      this.$router.push({ name: "catalogSearch" });
    } else {
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
            this.location = response.data.user.contact.edges[0].node.location;
            this.telephone = response.data.user.contact.edges[0].node.telephone;
            this.is_alternative = response.data.user.isAlternative;

            this.password = response.data.user.password;
            this.idAux = response.data.user.contact.edges[0].node.id;
          });
      }
    }
  },
  methods: {
    newLocation(value){
      this.location = value;
    },
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
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
              lastnames: this.lastname,
              location: this.location,
              telephone: this.telephone,
            },
            // Actualiza el cache de GraphQL para visualizar la eliminación
            // al momento de cargar la vista
            refetchQueries: [
              {
                query: require("@/graphql/user/user.gql"),
                variables: {
                  id: this.id,
                },
              },
            ],
          })
          // El método mutate devuelve una promesa
          // que puede usarse para agregar más logica
          .then((response) => {
            //Console necesario debido a que si se deja por fuera la logica se pierde lo asincrono
            console.log("actualización de contacto:", response.data);
            //Llenar cache
            let user = JSON.parse(localStorage.getItem("user"));
            user.names = this.name;
            localStorage.setItem("user", JSON.stringify(user));
            this.$router.push({ name: "catalogSearch" }).then(() => {
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
            password: this.passwordNew,
          },
          // Actualiza el cache de GraphQL para visualizar la eliminación
          // al momento de cargar la vista
          refetchQueries: [
            {
              query: require("@/graphql/user/allUsers.gql"),
              variables: {
                id: this.id,
              },
            },
          ],
        })
        .then((response) => {
          // No puedo eliminar el console
          console.log("actualización de contrasenia:", response.data);
          this.password = this.passwordNew;
          this.makeToast(
            "success",
            "Actualizada",
            "La contraseña ha sido actualizada",
            3000
          );
        });
    },

    disable() {
      return this.is_alternative;
    },
    checkPassword() {
      if (this.password == this.passwordOld) {
        if (this.passwordNew == this.passwordConfirmation) {
          this.editPassword();
        } else {
          this.makeToast(
            "danger",
            "Contraseñas",
            "No coincide las contraseñas nuevas",
            3000
          );
        }
      } else {
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
