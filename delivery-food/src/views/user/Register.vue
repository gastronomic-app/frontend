<template>
  <div>
    <h1>Registro</h1>
    <form>
      <div class="form-group">
        <label for="names">Nombres</label>
        <input
          :disabled="google"
          type="text"
          class="form-control"
          id="names"
          v-model.trim="names"
          required
          aria-describedby="namesComplete"
        />
        <label for="lastNames">Apellidos</label>
        <input
          :disabled="google"
          type="text"
          class="form-control"
          id="lastNames"
          v-model.trim="lastNames"
          required
          aria-describedby="lastNames"
        />

        <label for="email">Correo electronico</label>
        <input
          :disabled="google"
          type="email"
          class="form-control"
          id="email"
          v-model.trim="email"
          required
        />

        <label for="phoneNumber">Número de telefono</label>
        <input
          type="number"
          class="form-control"
          id="phoneNumber"
          v-model.trim="telephone"
          required=""
          pattern="[0-9]+"
        />

        <div v-show="!google">
          <label for="exampleInputPassword">Contraseña</label>
          <input
            @keydown.space.prevent
            type="password"
            class="form-control"
            id="password"
            v-model.trim="password"
            required=""
          />
          <label for="confirmPassword">Confirmar contraseña</label>
          <input
            @keydown.space.prevent
            type="password"
            class="form-control"
            id="confirmPassword"
            v-model.trim="passwordConfirmation"
            required=""
          />
        </div>
        <label for="location">Direccion</label>
        <input
          type="text"
          class="form-control"
          id="location"
          v-model.trim="location"
          required=""
          aria-describedby="location"
        />
        <br />
        <br />
        <GoogleLogin
          class="buttonText"
          :params="params"
          :onSuccess="onSuccess"
          :onFailure="onFailure"
          >Registrar con Google
        </GoogleLogin>
        <br />
      </div>

    </form>
    <button
        type="submit"
        class="btn btn-outline-primary"
        @click="check()"
      >
        Registrar
      </button>
    <button @click="$router.push('/Login')" class="btn btn-outline-secondary">
      Volver
    </button>
  </div>
</template>

<script>
import GoogleLogin from "vue-google-login";
export default {
  name: "Register",
  components: {
    GoogleLogin,
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
      password: null,
      passwordConfirmation: null,
      location: null,
      login: null,
      params: {},
    };
  },
  methods: {
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
        },
      });
      this.$router.push({ name: "login" }).then(() => {
        this.makeToast(
          "success",
          "Usuario creado",
          "Usuario creado, revisa tu correo para activar la cuenta ",
          4000
        );
      });
    },
    async checkEmail() {
      await this.$apollo
        .query({
          query: require("@/graphql/user/autentication.gql"),
          variables: {
            email: this.email,
          },
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
        if (this.names != null && this.lastNames!= null && this.email!= null && this.telephone!= null && this.location!= null && this.password!= null && this.passwordConfirmation!=null){
          if (this.password === this.passwordConfirmation) {
            await this.checkEmail();
            if (this.flag === false) {
              this.createRegister();
            } else {
              alert("El correo ya ha sido usado por otra persona!!");
            }
          } else {
            alert("Las contraseñas no coinciden");
          }
        } else {
          alert("Llena todos los campos por favor ");
        }
      } else {
        if (this.telephone != null && this.location != null) {
          this.password = "";
          await this.checkEmail();
          if (this.flag === false) {
            this.createRegister();
          } else if (this.flag === true) {
            alert("El correo ya ha sido usado por otra persona!!");
          }
        }else{
          alert("Llena todos los campos por favor ")
      }
      }
    },
    onSuccess(googleUser) {
      this.names = googleUser.getBasicProfile().zU;
      this.lastNames = googleUser.getBasicProfile().zS;
      this.email = googleUser.getBasicProfile().Ht;
      this.google = true;
      this.is_alternative = true;
    },
    redirectExampleEdit(idEnterprise) {
      this.$router.push({
        name: "ExampleEdit",
        params: { id: idEnterprise },
      });
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
