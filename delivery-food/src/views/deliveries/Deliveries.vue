<template>
  <div class="top">
    <h3>Mis Pedidos</h3>
    <div class="accordion" id="accordionExample">

      <!--PEDIDO 1-->
      
        <div class="card "  v-for="(pedido,idx) in pedidos" :key="pedido">
        <div class="card-header"  id="headingOne">
          <h2 class="mb-0">
            <button
              class="btn btn-link btn-block text-left color-text-tar shadow-none "
              
              type="button"
              data-toggle="collapse"
              :data-target="'#collapse'+idx"
              aria-expanded="false"
              aria-controls="collapseOne"
            >
              Pedido #{{idx +1 }}
            </button>
          </h2>
        </div>

        <div
          :id="'collapse'+idx"
          class="collapse"
          aria-labelledby="headingOne"
          data-parent="#accordionExample"
        >
          <div class="card-body content-black">
            <b> Productos:</b> <br>
               {{ pedido.productos}}<br>
            <b> Establecimiento: </b> <br>
              {{pedido.establecimiento}} <br>
            <b> Costo: </b> <br>
              {{pedido.costo}}</div>
          </div>
         </div>
       </div>
      
     

    <div class="container container2">
      <button type="button" class="btn btn-black centered">
        Seguir Pedido
      </button>
    </div>

    <div class="container">
      <google-map></google-map>
    </div>

    <div class="container">
      <br />
        <h5>Tiempo estimado de llegada: 20 minutos</h5>
      <br />
    </div>

  </div>
</template>

<script>
import GoogleMap from "../Geolocation.vue";
export default {
  name: "Deliveries",
  components: {
    GoogleMap,
  },
  data(){
    return{
      pedidos:[
        { 
          id: "1",
          productos: "Alitas BBQ, Gaseosa 1.5 litros",
          establecimiento: 'Delicias',
          costo: '$24.000',
        },
         {
          id: "2",
         productos: "Sancocho de gallina",
          establecimiento: 'Doña Pepa',
          costo: '$18.000',
        },
         {
          id: "3",
         productos: "Arroz con pollo, Jarra-Jugo de mora",
          establecimiento: 'Donde Manolo',
          costo: '$23600',
        },
         {
          id: "4",
         productos: "Arepas de choclo, Queso cuajada bien caliente",
          establecimiento: 'Queseria de mì sin ti',
          costo: '$8000',
        },

      ],
    }
  }
};
</script>

<style>
.centered {
  margin: auto;
  background-color: rgb(0, 66, 128);
  margin-left: 45%;
  margin-top: 3%;
}
.btn-black{
  background-color: black;
  color:whitesmoke;
}
.btn-black:hover{
   background-color: rgba(255, 102, 0, 0.521);  
  color:black;
}
.color-text-tar{
  color:black;
}
.color-text-tar:hover{
  text-decoration: none;
  color:black;
}

.card-header:hover{
  background-color: rgba(255, 102, 0, 0.521);
}
.content-black{
  background-color: black;
  color:rgb(190, 189, 189);
}
.top{
  padding-top:6em;
}
</style>