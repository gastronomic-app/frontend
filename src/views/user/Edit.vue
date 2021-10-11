<template>
  <div class="wrapper fadeInDown align-self-lg-center">
    <h1>Actualización de datos</h1>
    <div class="card-body container align-self-center">
      <form v-on:submit.prevent="editContact()">
        <div>
          <label for="validationName"
            >Nombre<span class="text-danger">*</span></label
          >
          <b-form-input
            type="text"
            class="form-control"
            id="validationName"
            v-model="name"
            :state="validateNames"
            name="validationLastname"
            required
          ></b-form-input>
          <b-form-invalid-feedback :state="validateNames">
            El nombre debe ser valido.
          </b-form-invalid-feedback>

          <label for="validationLastname"
            >Apelido<span class="text-danger">*</span></label
          >
          <b-form-input
            type="text"
            class="form-control"
            :state="validateLastNames"
            id="validationLastname"
            v-model="lastname"
            aria-describedby="lastNames"
            required
            name="validationLastname"
          ></b-form-input>
          <b-form-invalid-feedback :state="validateLastNames">
            Los apellidos deben ser validos.
          </b-form-invalid-feedback>
          <label for="validationTelephone"
            >Telefono<span class="text-danger">*</span></label
          >
          <b-form-input
            type="text"
            class="form-control"
            :state="validateTelephone"
            id="validationTelephone"
            v-model="telephone"
            required
          ></b-form-input>
          <b-form-invalid-feedback :state="validateTelephone">
            Telefono debe ser valido (10 o 7 digitos).
          </b-form-invalid-feedback>

          <!-- geolocalizacion-->
          <label for="validationLocation"
            >Localización<span class="text-danger">*</span></label
          >
          <Geolocation
            ref="foo"
            :showmap="true"
            :disable_input="true"
            :placeholder="location"
          />
          <br />
          <!-- geolocalizacion  -->
          <input type="submit" class="btn btn-color" value="Guardar Cambios" />
        </div>
      </form>
       <br />
      <button
        v-show="!disable()"
        type="submit"
        class="btn btn-black"
        v-b-modal.ModalCenter
        @click="show_modal = true"
      >
        Cambiar Contraseña
      </button>
    </div>
    <!-- Modal -->
    <b-modal
      v-model="show_modal"
      id="ModalCenter"
      hide-footer
      title="Cambiar Contraseña"
    >
      <div class="modal-body">
        <center>
          <form v-on:submit.prevent="validatePassword()">
            <div class="col-md-6 mb-3">
              <label for="inputContraseña">
                Contraseña Antigua<span class="text-danger">*</span></label
              >
              <b-form-input
                @keydown.space.prevent
                type="password"
                id="inputPassword5"
                class="form-control"
                :state="validationOld"
                aria-describedby="passwordHelpBlock"
                required
                v-model="passwordOld"
              ></b-form-input>
              <b-form-invalid-feedback :state="validationOld">
                La contraseña debe tener entre 5 y 12 caracteres.
              </b-form-invalid-feedback>

              <div>
                <label for="inputPasswordNew">
                  Nueva Contraseña<span class="text-danger">*</span></label
                >
                <b-form-input
                  @keydown.space.prevent
                  type="password"
                  id="inputPasswordNew"
                  class="form-control"
                  :state="validation"
                  aria-describedby="passwordHelpBlock"
                  required
                  v-model="passwordNew"
                ></b-form-input>
                <b-form-invalid-feedback :state="validation">
                  La contraseña debe tener entre 5 y 12 caracteres.
                </b-form-invalid-feedback>
                <b-form-invalid-feedback :state="validationEqual">
                  Utilizaste esta contraseña. Elije una diferente.
                </b-form-invalid-feedback>

              </div>
              <div>
                <label for="confirmPassword"
                  >Confirmar contraseña
                  <span class="text-danger">*</span></label
                >
                <b-form-input
                  @keydown.space.prevent
                  type="password"
                  id="inputPasswordConfirmation"
                  :state="equal"
                  class="form-control"
                  aria-describedby="passwordHelpBlock"
                  required
                  v-model="passwordConfirmation"
                ></b-form-input>
                <b-form-text id="password-help-block">
                  La contraseña debe tener entre 5 y 12 caracteres
                </b-form-text>
                <b-form-invalid-feedback :state="equal">
                  Las contraseñas no son iguales.
                </b-form-invalid-feedback>
              </div>
            </div>
            <input
              type="submit"
              value="Guardar cambios"
              class="btn btn-color"
              id="save"
            />
          </form>
        </center>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-black"
          data-dismiss="modal"
          @click="show_modal = false"
        >
          Cerrar
        </button>
      </div>
    </b-modal>
  </div>
</template>
<script src="https://maps.googleapis.com/maps/api/js?&libraries=places&key=AIzaSyAYFB5yvCJzaZy09_qPCONtoT6-pPmCkns"></script>
<script>

import Geolocation from "@/components/geolocation/Geolocation.vue";
export default {
  name: "Edit",
  components: {
    Geolocation,
  },
  data() {
    return {
      email: "",
      name: "",
      lastname: "",
      location: "",
      telephone: "",
      passwordOld: "",
      passwordNew: "",
      passwordConfirmation: "",
      id: "",
      is_alternative: "",
      idAux: "",
      show_modal: false,
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
            this.email = response.data.user.email;
            this.idAux = response.data.user.contact.edges[0].node.id;
          });
          this.getCompleteAddress(this.location).then((value) => {
            this.$refs.foo.showUserLocation(value.lat, value.lng);
          });
      }
    }
  },
  computed: {
    validateNames() {
      if (this.name == null) {
        return null;
      } else {
        const re = /^[a-zA-Z]+$/;
        const reL = /^[a-zA-Z]+ [a-zA-Z]+$/;
        if (re.test(this.name.trim()) || reL.test(this.name.trim())) {
          return true;
        }
      }
      return false;
    },
    validateLastNames() {
      if (this.lastname == null) {
        return null;
      }
      const re = /^[a-zA-Z]+$/;
      const reL = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if (re.test(this.lastname.trim()) || reL.test(this.lastname.trim())) {
        return true;
      }
      return false;
    },
    validateTelephone() {
      if (this.telephone == null) {
        return null;
      }
      const re = /^\d{10}$/;
      const reT = /^\d{7}$/;
      if (reT.test(this.telephone)) {
        return true;
      }
      return re.test(this.telephone);
    },
    validation() {
      if (this.passwordNew.length > 0) {
        return this.passwordNew.length > 4 && this.passwordNew.length < 13;
      }
      return null;
    },
    validationOld() {
      if (this.passwordOld.length > 0) {
        return this.passwordOld.length > 4 && this.passwordOld.length < 13;
      }
      return null;
    },
    validationEqual() {
      if (this.passwordNew.length > 4) {
        if (this.passwordNew == this.passwordOld) {
          return false;
        } else {
          return true;
        }
      }
      return null;
    },
    equal() {
      if (this.passwordNew.length > 4) {
        if (this.passwordNew == this.passwordConfirmation) {
          return true;
        } else {
          return false;
        }
      }
      return null;
    },
  },
  methods: {

    async getCompleteAddress(address) {
      const geocoder = new google.maps.Geocoder();
      var completeAddress = {
        address: "",
        lat: "",
        lng: "",
      };
      await geocoder.geocode(
        {
          address: address,
        },
        (response, status) => {
          if (status === "OK") {
            (completeAddress.address = response[0].formatted_address),
              (completeAddress.lat = response[0].geometry.location.lat()),
              (completeAddress.lng = response[0].geometry.location.lng());
          }
        }
      );
      return completeAddress;
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
      if (
        this.validateNames &&
        this.validateLastNames &&
        this.validateTelephone
      ) {
        await this.$apollo
          .mutate({
            // Establece la mutación de editar
            mutation: require("@/graphql/client/updateContact.gql"),
            // Define las variables
            variables: {
              id: this.idAux,
              names: this.name.trim(),
              lastnames: this.lastname.trim(),
              location: this.$refs.foo.address,
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
            response.data;
            //Llenar cache
            let user = JSON.parse(localStorage.getItem("user"));
            user.names = this.name;
            user.location = this.$refs.foo.address;
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
      } else {
        this.makeToast("danger", "Error", "Datos invalidos", 3000);
      }
    },
    async validatePassword() {
      if (this.validation && this.validationOld && this.equal && this.validationEqual) {
        try {
          await this.$apollo
            .mutate({
              // Establece la mutación de editar
              mutation: require("@/graphql/user/tockenAuth.gql"),
              // Define las variables
              variables: {
                email: this.email,
                password: this.passwordOld,
              },
            })
            // El método query devuelve una promesa
            // que puede usarse para agregar más logica
            .then((response) => {
              // En este caso se usa para cargar el formulario
              // con los datos obtenidos
              response.data;
              this.editPassword();
            });
        } catch (error) {
          this.makeToast(
            "danger",
            "Contraseña",
            "No coincide la contraseña antigua",
            3000
          );
        }
      } else {
        this.makeToast("danger", "Error", "Datos invalidos", 3000);
      }
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
          response.data;
          this.password = this.passwordNew;
          this.makeToast(
            "success",
            "Actualizada",
            "La contraseña ha sido actualizada",
            3000
          );
          this.passwordOld = "";
          this.passwordNew = "";
          this.passwordConfirmation = "";
          this.show_modal = false;
        });
    },
    disable() {
      return this.is_alternative;
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
