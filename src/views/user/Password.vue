<template>
  <div class="jumbotron">
    <h1 class="display-4">Recuperación de contraseña</h1>
    <hr class="my-4" />
    <form  v-on:submit.prevent="rememberPassword()">
      <fieldset>
        <span class="help-block">
          Dirección de correo electrónico que utiliza para iniciar sesión en su
          cuenta
          <br />
          Le enviaremos un correo electrónico con instrucciones para elegir una
          nueva contraseña.
        </span>
          <input
            class="form-control"
            placeholder="Email"
            name="email"
            v-model="email"
            type="email"
            required=""
            autofocus=""
          />
          <br>
        <input type="submit"  class="btn btn-color btn-block" value="Continuar" />
        <b-progress
          v-show="ok"
          :value="100"
          variant="info"
          striped
          :animated="true"
          class="mt-2"
        ></b-progress>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    email: "",
    ok: false,
  }),
  methods: {
    makeToast(variant = null, title, info, time) {
      this.$bvToast.toast(info, {
        title: title,
        autoHideDelay: time,
        variant: variant,
        solid: true,
      });
    },
    async rememberPassword() {
      this.ok = true;
      try {
        await this.$apollo
          .mutate({
            // Establece la mutación de crear
            mutation: require("@/graphql/client/rememberClient.gql"),
            // Define las variables
            variables: {
              email: this.email,
            },
          })

          // El método mutate devuelve una promesa
          // que puede usarse para agregar más logica
          .then((response) => {
            this.ok = false;
            if(response.data.rememberClient.client.isAlternative){
              this.email="";
              this.makeToast(
                "danger",
                "Error ",
                "El usuario ha sido registrado mediante google",
                4000
              );
            }else{
              //Validar cuando es de google
            this.$router.push({ name: "catalogSearch" }).then(() => {
              this.makeToast(
                "success",
                "¡Recordatorio de contraseña enviado! ",
                "Consulte su correo electrónico para obtener instrucciones sobre cómo restablecer su contraseña",
                4000
              );
            });
            }
          });
      } catch (error) {
        this.makeToast(
          "danger",
          "Error",
          "El usuario no se encuentra registrado",
          3000
        );
        this.ok = false;
      }
    },
  },
};
</script>

<style>
</style>
