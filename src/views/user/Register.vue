<template>
  <div class="card-body container align-self-center">
    <h1>Regístrate</h1>
    <div v-if="!google">
      <GoogleLogin
        class="buttonText"
        :params="params"
        :onSuccess="onSuccess"
        :onFailure="onFailure"
        >Registrar con Google
      </GoogleLogin>
    </div>
     <br />
    <form v-on:submit.prevent="check()">
      <div class="form-group">
        <label for="names">Nombres <span class="text-danger">*</span></label>
        <b-form-input
          :disabled="google"
          :state="validateNames"
          type="text"
          class="form-control"
          id="names"
          v-model="names"
          required
          aria-describedby="namesComplete"
        ></b-form-input>
        <b-form-invalid-feedback :state="validateNames">
          El nombre debe ser valido.
        </b-form-invalid-feedback>
        <label for="lastNames"
          >Apellidos <span class="text-danger">*</span></label
        >
        <b-form-input
          :disabled="google"
          :state="validateLastNames"
          type="text"
          class="form-control"
          id="lastNames"
          v-model="lastNames"
          required
          aria-describedby="lastNames"
        ></b-form-input>
        <b-form-invalid-feedback :state="validateLastNames">
          Los apellidos deben ser validos.
        </b-form-invalid-feedback>
        <label for="email"
          >Correo electronico <span class="text-danger">*</span></label
        >
        <b-form-input
          :disabled="google"
          :state="validateEmail"
          type="email"
          class="form-control"
          id="email"
          v-model="email"
          name="email"
          required=""
        ></b-form-input>
        <b-form-invalid-feedback :state="validateEmail">
          Correo debe ser valido.
        </b-form-invalid-feedback>
        <label for="phoneNumber"
          >Número de telefono <span class="text-danger">*</span></label
        >
        <b-form-input
          type="number"
          class="form-control"
          :state="validateTelephone"
          id="phoneNumber"
          v-model="telephone"
          required=""
        ></b-form-input>
        <b-form-invalid-feedback :state="validateTelephone">
          Telefono debe ser valido (10 o 6 digitos).
        </b-form-invalid-feedback>
        <div v-if="!google">
          <label for="exampleInputPassword"
            >Contraseña <span class="text-danger">*</span></label
          >
          <b-form-input
            @keydown.space.prevent
            type="password"
            class="form-control"
            :state="validationPassword"
            id="password"
            v-model="password"
            required=""
          ></b-form-input>
          <b-form-invalid-feedback :state="validationPassword">
            La contraseña debe tener entre 5 y 12 caracteres.
          </b-form-invalid-feedback>
          <label for="confirmPassword"
            >Confirmar contraseña <span class="text-danger">*</span></label
          >
          <b-form-input
            @keydown.space.prevent
            type="password"
            class="form-control"
            :state="equal"
            id="confirmPassword"
            v-model="passwordConfirmation"
            required=""
          ></b-form-input>
          <b-form-text id="password-help-block">
            La contraseña debe tener entre 5 y 12 caracteres
          </b-form-text>
          <b-form-invalid-feedback :state="equal">
            Las contraseñas no son iguales.
          </b-form-invalid-feedback>
        </div>
        <br />
        <label for="location"
          >Direccion <span class="text-danger">*</span></label
        >
        <Geolocation novalidate required="" v-on:value="ral_Location" :showmap="true" />
        <br />
        <p>
          Los campos marcados con <span class="text-danger">*</span> son
          Obligatorios
        </p>
        <input
          type="submit"
          class="btn btn-color btn-block"
          value="Registrar"
        />
      </div>
    </form>
  </div>
</template>

<script>
import GoogleLogin from "vue-google-login";
import Geolocation from "@/components/geolocation/Geolocation.vue";
export default {
  name: "Register",
  components: {
    GoogleLogin,
    Geolocation,
  },
  props:{
    enterpriseId: {
      type: String,
      require: false,
      default: "Null"
    },
  },

    async mounted() {
    if (localStorage.getItem("existUser")) {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user.type === 'MANAGER') {
        this.type = "COURIER"
      }
      else{
        this.$router.push({ name: "catalogSearch" });
      }
    }
  },

  data() {
    return {
      google: false,
      flag: true,
      is_alternative: false,
      names: null,
      lastNames: null,
      email: null,
      telephone: null,
      password: "",
      passwordConfirmation: "",
      location: null,
      login: null,
      type: "CLIENT",
      params: {},
    };
  },
  computed: {
    validateEmail() {
      if (this.email == null) {
        return null;
      }
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },
    validateNames() {
      if (this.names == null) {
        return null;
      }
      const re = /^[a-zA-Z]+$/;
      const reL = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if (re.test(this.names)) {
        return true;
      }
      return reL.test(this.names);
    },
    validateLastNames() {
      if (this.lastNames == null) {
        return null;
      }
      const re = /^[a-zA-Z]+$/;
      const reL = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if (re.test(this.lastNames)) {
        return true;
      }
      return reL.test(this.lastNames);
    },
    validateTelephone() {
      if (this.telephone == null) {
        return null;
      }
      const re = /^\d{10}$/;
      const reT = /^\d{6}$/;
      if (reT.test(this.telephone)) {
        return true;
      }
      return re.test(this.telephone);
    },
    validationPassword() {
      if (this.password.length > 0) {
        return this.password.length > 4 && this.password.length < 13;
      }
      return null;
    },
    equal() {
      if (this.password.length > 4) {
        if (this.password == this.passwordConfirmation) {
          return true;
        } else {
          return false;
        }
      }
      return null;
    },
  },
  methods: {
    ral_Location(value) {
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

    createRegister() {
      this.$apollo.mutate({
        mutation: require("@/graphql/client/createClient.gql"),
        variables: {
          email: this.email,
          password: this.password,
          is_alternative: this.is_alternative,
          names: this.names,
          telephone: this.telephone,
          lastnames: this.lastNames,
          location: this.location,
          type: this.type,
          enterpriseId: this.enterpriseId
        },
      });
      if (this.type === 'COURIER') {
        this.$router.push({ name: "EnterpriseList" }).then(() => {
        this.makeToast(
          "success",
          "Usuario creado",
          "Usuario creado, correctamente ",
          4000
        );
      });
      }else{
        this.$router.push({ name: "login" }).then(() => {
        this.makeToast(
          "success",
          "Usuario creado",
          "Usuario creado, revisa tu correo para activar la cuenta ",
          4000
        );
      });
      }
    },
    async checkEmail() {
      await this.$apollo
        .query({
          query: require("@/graphql/user/autentication.gql"),
          variables: {
            email: this.email,
          },
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          if (response.data.allUsers.edges.length === 1) {
            this.flag = true;
          } else {
            this.flag = false;
          }
        });
    },
    async check() {
      if (!this.google) {
        if(this.validateNames && this.validateLastNames && this.validateTelephone && this.location != null) {
          if (this.password.length > 4) {
            if (this.password === this.passwordConfirmation) {
              await this.checkEmail();
              if (this.flag === false) {
                this.createRegister();
              } else {
                this.makeToast(
                  "danger",
                  "El correo ya ha sido usado por otra persona!!",
                  "Cuidado",
                  3000
                );
              }
            } else {
              this.makeToast(
                "danger",
                "Las contraseñas no coinciden",
                "Cuidado",
                3000
              );
            }
          } else {
            this.makeToast(
              "danger",
              "Las contraseñas deben tener mas de 4 digitos",
              "Cuidado",
              3000
            );
          }
        } else {
          this.makeToast(
            "danger",
            "Error",
            "Datos invalidos",
            3000
          );
        }
      } else {
        if (this.telephone != null && this.location != null) {
          this.password = "";
          await this.checkEmail();
          if (this.flag === false) {
            this.createRegister();
          } else if (this.flag === true) {
            this.makeToast(
              "danger",
              "El correo ya ha sido usado por otra persona!!",
              "Cuidado",
              3000
            );
          }
        } else {
          this.makeToast(
            "danger",
            "Llena todos los campos por favor",
            "Cuidado",
            3000
          );
        }
      }
    },
    onSuccess(googleUser) {
      this.names = googleUser.getBasicProfile().getGivenName();
      this.lastNames = googleUser.getBasicProfile().getFamilyName();
      this.email = googleUser.getBasicProfile().getEmail();
      this.google = true;
      this.is_alternative = true;
    },
    onFailure(error) {
      console.log(error);
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.lat,
          lng: this.currentPlace.lng,
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    getPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          },
          (error) => {
            console.log(error.message);
          }
        );
      }
    },
  },
};
</script>

<style scoped>

.buttonText:hover {
  cursor: pointer;
}
.buttonText {
  display: inline-block;
  vertical-align: middle;
  padding-left: 42px;
  padding-right: 15px;
  font-size: 22px;
  font-weight: lighter;
  /* Use the Roboto font that is loaded in the <head> */
  font-family: "Roboto", sans-serif;

  background: url("https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg")
    transparent 5px 50% no-repeat;
  color: #444;
  width: 250;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
}
</style>
