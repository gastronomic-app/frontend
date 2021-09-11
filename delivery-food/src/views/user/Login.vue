<template>
  <div class="login">
    <div class="wrapper fadeInDown">
      <div id="formContent">
        <!-- Tabs Titles -->

        <!-- Icon -->
        <div class="fadeIn first">
          <h1>Inicio de sesión</h1>
        </div>

        <!-- Login Form -->
        <form v-on:submit.prevent="startSesion()">
          <input
            type="email"
            id="email"
            class="fadeIn second"
            name="login"
            placeholder="Correo Electronico"
            v-model="email"
            required=""
            autofocus=""
          />
          <input
            @keydown.space.prevent
            type="password"
            id="password"
            class="fadeIn third"
            name="login"
            placeholder="Contraseña"
            v-model="password"
            value=""
            required=""
          />
          <input type="submit" class="fadeIn fourth" value="Iniciar sesión" />
        </form>

        <!-- Remind Passowrd -->
        <div class="alert alert-danger" role="alert" v-if="error">
          {{ error_msg }}
        </div>

        <div id="formFooter">
          <a class="underlineHover" @click="$router.push('/password')"
            >¿Ha olvidado la contraseña?</a
          >
        </div>

        <GoogleLogin
          class="buttonText"
          :params="params"
          :onSuccess="onSuccess"
          :onFailure="onFailure"
          >Iniciar sesión</GoogleLogin
        >
        <br />
        <form v-on:submit.prevent="login">
          <input
            type="submit"
            class="fadeIn fourth"
            @click="$router.push('/Register')"
            value="Registrar"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import GoogleLogin from "vue-google-login";
export default {
  name: "Login",
  components: {
    GoogleLogin,
  },
  data: () => ({
    email: "",
    password: "",
    error: false,
    error_msg: "datos invalidos",
    google: false,
    alert: true,
    // only needed if you want to render the button with the google ui
    params: {},
    user: {
      id: "",
      email: "",
      password: "",
      isActive: "",
      isSuperuser: "",
      isalternative: "",
      names: "",
      lastnames: "",
      location: "",
      telephone: "",
      type: "",
    },
  }),
  methods: {
    makeToast(variant = null, title, info, tiempo) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: tiempo,
        variant: variant,
        solid: true,
      });
    },
    onSuccess(googleUser) {
      // This only gets the user information: id, name, imageUrl and email
      this.email = googleUser.getBasicProfile().Ht;
      this.google = true;
      this.startSesion();
    },
    onFailure(error) {
      console.log(error);
    },
    async startSesion() {
      if (!this.google && this.password === "") {
        this.error_msg = "Datos incorrectos";
        this.error = true;
        return false;
      }
      await this.$apollo
        .query({
          // Establece la consulta para recuperar la empresa
          query: require("@/graphql/user/autentication.gql"),
          // Define las variables
          variables: {
            email: this.email,
            password: this.password,
          },
        })
        // El método query devuelve una promesa
        // que puede usarse para agregar más logica
        .then((response) => {
          // En este caso se usa para cargar el formulario
          // con los datos obtenidos
          if (response.data.allUsers.edges[0] == null) {
            if (this.google) {
              this.error_msg = "Usuario de Google no registrado o inactivo";
              localStorage.clear();
              this.google = false;
              this.email = "";
            } else {
              this.error_msg = "Datos inválidos";
            }
            this.error = true;
          } else {
            if (response.data.allUsers.edges[0].node.isActive) {
              this.user.id = response.data.allUsers.edges[0].node.id;
              this.user.email = response.data.allUsers.edges[0].node.email;
              //this.user.isalternative =  response.data.allUsers.edges[0].node.isalternative;
              // this.user.password = response.data.allUsers.edges[0].node.password;
              // this.user.isActive = response.data.allUsers.edges[0].node.isActive;
              // this.user.isSuperuser = response.data.allUsers.edges[0].node.isSuperuser;
              this.user.type = response.data.allUsers.edges[0].node.type;
              this.user.names =
                response.data.allUsers.edges[0].node.contact.edges[0].node.names;
              // this.user.lastnames = response.data.allUsers.edges[0].node.contact.edges[0].node.lastnames;
              this.user.location =
                response.data.allUsers.edges[0].node.contact.edges[0].node.location;
              // this.user.telephone = response.data.allUsers.edges[0].node.contact.edges[0].node.telephone;
              localStorage.setItem("user", JSON.stringify(this.user));
              localStorage.setItem("existUser", true);

              this.$router.push({ name: "ExampleList" }).then(() => {
                this.makeToast(
                  "success",
                  "Bienvenido",
                  "Usuario: " + this.user.names,
                  3000
                );
              });
            } else {
              (this.error_msg = "El usuario esta inactivo"),
                (this.error = true);
            }
          }
        });
    },
  },
  mounted() {
    if (localStorage.getItem("existUser")) {
      this.$router.push({ name: "ExampleList" });
    }
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
/* BASIC */
html {
  background-color: #ff6079;
}
body {
  font-family: "Poppins", sans-serif;
  height: 100vh;
}
a {
  color: #0c0c0c;
  display: inline-block;
  text-decoration: none;
  font-weight: 400;
}
h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  margin: 40px 8px 10px 8px;
  color: #cccccc;
}
/* STRUCTURE */
.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}
#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  text-align: center;
}
#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}
/* TABS */
h2.inactive {
  color: #cccccc;
}
h2.active {
  color: #0d0d0d;
  border-bottom: 2px solid #ff6079;
}
/* FORM TYPOGRAPHY*/
input[type="button"],
input[type="submit"],
input[type="reset"] {
  background-color: #ff6079;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 5px 20px 40px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
input[type="button"]:hover,
input[type="submit"]:hover,
input[type="reset"]:hover {
  background-color: #ff6079;
}
input[type="button"]:active,
input[type="submit"]:active,
input[type="reset"]:active {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}
input {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}
input:focus {
  background-color: #fff;
  border-bottom: 2px solid #ff6079;
}
input:placeholder {
  color: #cccccc;
}
/* ANIMATIONS */
/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-moz-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fadeIn {
  opacity: 0;
  -webkit-animation: fadeIn ease-in 1;
  -moz-animation: fadeIn ease-in 1;
  animation: fadeIn ease-in 1;
  -webkit-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  animation-duration: 1s;
}
.fadeIn.first {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}
.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}
/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #ff6079;
  content: "";
  transition: width 0.2s;
}
.underlineHover:hover {
  color: #0d0d0d;
}
.underlineHover:hover:after {
  width: 100%;
}
/* OTHERS */
*:focus {
  outline: none;
}
#icon {
  width: 60%;
}
</style>
