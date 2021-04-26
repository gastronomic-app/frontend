<template>
  <div class=top>
    <br />
    <h3><b>Pedidos por despachar</b></h3>
    <h5>Vista del administrador</h5>

    <div class="accordion" id="accordionExample">
      <!--CARD1-->
      <div class="d-flex justify-content-end">
        <label class="form-check-label">
          Seleccionar todos
          <input type="checkbox" v-on:click="selectAll()"/>
        </label> 
      </div>
      <template v-for="(order, index) in orders">
        <div class="card" :key="order.id" v-if="order.state == 'preparando'">
          <div
            class="card-header"
            :id="`heading` + order.id"
            v-bind:class="{ selected: order.selected }"
          >
            <h2 class="mb-0 flex">
              <button
                class="btn btn-block text-left btn-width"
                type="button"
                data-toggle="collapse"
                :data-target="'#collapse' + order.id"
                aria-expanded="false"
                :aria-controls="'collapse' + order.id"
              >
                Pedido Pendiente #{{ index + 1 }}
              </button>
              <span class="force-left">
                <label class="form-check-label">
                  <input
                    type="checkbox"
                    v-on:click.stop="order.selected = !order.selected"
                    :checked = order.selected
                    
                  />
                </label>
              </span>
            </h2>
          </div>

          <div
            :id="'collapse' + order.id"
            class="collapse"
            :aria-labelledby="'heading' + order.id"
            data-parent="#accordionExample"
          >
            <div class="card-body">
              - Estado: {{ order.state }} <br />
              - Fecha: {{ order.date }}<br />
              <b>Productos:</b> <br />
              - {{ order.products }} <br />
              <b>Realizado por:</b> <br />
              - {{ order.client }} <br />
              <b>Ubicación:</b> <br />
              - {{ order.location }}
            </div>
          </div>
        </div>
      </template>

      <br />
      <span class="float-right">
        <button type="button" class="btn btn-color" v-on:click="dispatch()">
          Despachar Pedidos
        </button>
      </span>
    </div>
  </div>
</template>


<script>
export default {
  name: "PendingOrders",
  data() {
    return {
      checked_all : false,
      orders: [
        {
          id: "1",
          date: "22/04/2021 21:07",
          state: "preparando",
          location: "742 Evergreen Terrace",
          client: "Florinda Meza",
          products: "Salchipapa especial",
          selected: false,
        },
        {
          id: "2",
          date: "22/04/2021 21:12",
          state: "preparando",
          location: "Elm Street 123",
          client: "Luigi Bross",
          products: "Pizza de la Casa",
          selected: false,
        },
        {
          id: "3",
          date: "22/04/2021 21:16",
          state: "preparando",
          location: "Elm Street 123",
          client: "Nagato Uzumaki",
          products: "Sopa Ramen",
          selected: false,
        },
        {
          id: "4",
          date: "22/04/2021 21:18",
          state: "preparando",
          location: "Avenida Siempre Viva 123",
          client: "Bartolomeo J. Simpson",
          products: "Helado con chispas de chocolate",
          selected: false,
        },
      ],
      couriers: [
        {
          id: "courier1",
          nombre: "Jesus Maria Peña",
          celular: "3103103100",
          state: true,
        },
        {
          id: "courier2",
          nombre: "Mario Cesar Bross",
          celular: "3103103100",
          state: true,
        },
        {
          id: "courier3",
          nombre: "Ebrio Morales",
          celular: "3103103100",
          state: true,
        },
      ],
    };
  },
  methods: {
    dispatch() {
      for (let index = 0; index < this.orders.length; index++) {
        if (this.orders[index].selected) {
          alert("Asignando un mensajero al pedido " + this.orders[index].id) + "...";
          this.asignCourier(index);
          this.orders[index].selected = false;
        }
      }
    },
    asignCourier(index) {
      let count_couriers = this.availableCouriers();
      if (count_couriers == 0) {
        alert("Lo sentimos no hay mensajeros disponibles en el momento")
      }else{
        for (let idx = 0; idx < this.couriers.length; idx++) {
          if (this.couriers[idx].state) {
            this.orders[index].state = "despachado";
            this.couriers[idx].state = false;
            alert("Pedido asignado al mensajero: " + this.couriers[idx].nombre);
            break;
          }
        }
      }
    },
    availableCouriers(){
      let count_couriers = 0;
      for (let idx = 0; idx < this.couriers.length; idx++) {
        if (this.couriers[idx].state){
          count_couriers ++;
        }
      } 
      return count_couriers;
    },
    selectAll(){
      this.checkedAll = !this.checkedAll;
      for (let idx = 0; idx < this.orders.length; idx++)
        if (this.orders[idx].state == 'preparando')
          this.orders[idx].selected = this.checkedAll;
    }
  },
};
</script>

<style scoped>
.selected {
  background-color: rgba(252, 86, 25, 0.5);
  color: rgb(39, 39, 39);
}
.force-left {
  width: 3%;
}
.flex {
  display: flex;
  width: 100%;
}
.btn-width {
  width: 97%;
}
.texto {
  color: black;
}
.btn-color{
  background-color: black;
  color: whitesmoke;
}
.check-color{
  background-color: black;

}
.top{
  padding-top:4em;
}

</style>