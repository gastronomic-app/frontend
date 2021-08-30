<template>
  <div>
    <form >
      <h2>Asignacion de contraseña</h2>
      <div class="form-group">
          <label for="exampleInputPassword1">Contraseña</label>
          <input
            type="password"
            class="form-control"
            id="password1"
            v-model.trim="password"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword1">Confirmar contraseña</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword1"
            v-model.trim="passwordC"
            required
          />
        </div>
    <button @click= "$router.push ('/Login')" class="btn btn-outline-secondary">Volver</button>
    <button @click-prevent="check()" type="submit" class="btn btn-outline-primary">
      Registrar
    </button>
  </form>
  </div>

</template>

<script>
//import Regisrar from ("@/views/users/Registrar.vue")
export default {
  name: "RegisterPassword",
  props: {
    /**
     * Se asigna null si el formulario
     * no es de actualización
     */
    id: {
      type: String,
      required: false,
      default: null,
    },
  },
  components:{

  },
  methods: {
    createRegister() {
      console.log(this.email);
      this.$apollo.mutate({
        mutation: require("@/graphql/client/register.gql"),
        variables: {
          name: this.names,
          lastName: this.lastNames,
          telephone: this.telephone,
          email: this.email,
          password: this.password,
          location: "dddddd",
        },
      });
      this.$router.push({ name: "login" });
    },
    async check() {
      if (this.password == this.passwordC) {
        this.createRegister();
      } else {
        alert("Las contraseñas no coinciden");
        console.log("Las contraseñas no coinciden");
      }
    },
  }
}
</script>

<style>

</style>
