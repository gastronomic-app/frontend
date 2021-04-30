<template>
  <div>
    <h1>
      Generar reporte para <b>{{ enterprise.name | capitalize }}</b>
    </h1>
    <div class="jumbotron">
      <div class="custom-control custom-radio">
        <input
          type="radio"
          id="customRadio1"
          name="customRadio"
          class="custom-control-input"
        />
        <label class="custom-control-label" for="customRadio1">
          El tiempo de entrega fue excesivo
        </label>
      </div>
      <div class="custom-control custom-radio">
        <input
          type="radio"
          id="customRadio2"
          name="customRadio"
          class="custom-control-input"
        />
        <label class="custom-control-label" for="customRadio2">
          Llegaron los productos incorrectos
        </label>
      </div>
      <div class="custom-control custom-radio">
        <input
          type="radio"
          id="customRadio3"
          name="customRadio"
          class="custom-control-input"
        />
        <label class="custom-control-label" for="customRadio3">
          Mala atención del domiciliario
        </label>
      </div>
      <br />
      <div class="form-group">
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          placeholder="Escriba un comentario con su inconveniente"
        >
        </textarea>
      </div>
    </div>
    <div class="text-right">
      <button type="button" class="btn btn-success mr-2">Enviar</button>
      <button type="button" class="btn btn-danger">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Report",
  data() {
    return {
      enterprise: {
        type: Object,
        default: null,
      },
    };
  },
  created() {
    this.$apollo
      .query({
        query: require("@/graphql/enterprise/enterprise.gql"),
        variables: {
          id: "RW50ZXJwcmlzZU5vZGU6MTM=",
        },
      })
      .then(response => { this.enterprise = response.data.enterprise }
    );
  },
};
</script>
