<template>
  <div>
    <!-- Header -->
    <div class="header-container">
      <h2 class="title"><b> Lista de mensajeros adscritos.</b></h2>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1"
            ><b-icon-search></b-icon-search
          ></span>
        </div>
        <input
          ref="search"
          type="text"
          class="form-control"
          placeholder="Buscar"
          aria-label="search"
          aria-describedby="basic-addon1"
          @keyup.enter="search($refs.search.value)"
        />
      </div>
      <button class="new-courier btn btn-success"  @click="addCourier" type="button">Agregar</button>
    </div>
    <!-- Section List -->
    <div v-if="!isReadyQuery">
      <div v-if="courierList.length === 0">
        <loading-graphql></loading-graphql>
      </div>
    
    </div>
    <div v-else>
      <div v-show="found !== undefined">
        <courier-card :courier-info="found" :fn="changeStatus" ></courier-card>
      </div>
      <paginate ref="paginator" name="courierList" :list="courierList" :per="6">
        <section v-show="!found" class="container">
          <template v-for="(courier, idx) in paginated('courierList')">
            <courier-card :key="idx" :courier-info="courier" :fn="changeStatus"></courier-card>
          </template>
        </section>
      </paginate>
      <section v-if="courierList.length > 1">
        <div class="div-paginate">
          <paginate-links
            for="courierList"
            :classes="{ ul: 'pagination' }"
            :show-step-links="true"
          ></paginate-links>
        </div>

        <div class="div-paginate">
          <span v-if="$refs.paginator">
            Viendo {{ $refs.paginator.pageItemsCount }} resultados
          </span>
        </div>
      </section>
    </div>
      <div v-show="isReadyQuery && courierList.length==0">
        <not-found></not-found>
      </div>
  </div>
</template>
<script>
import CourierCard from "@/components/cards/CourierCard.vue";
import NotFound from "@/components/common/NotFound.vue";
import LoadingGraphql from "@/components/common/LoadingGraphql.vue";

export default {
  name: "CourierList",
  components: { CourierCard, NotFound, LoadingGraphql },

  created() {
    this.queryCouriers();
  },
  data() {
    return {
      courierList: [],
      enterpriseId: "RW50ZXJwcmlzZU5vZGU6Mg==",
      found: undefined,
      paginate: ["courierList"],
      isReadyQuery: false,
    };
  },
  methods: {
    async queryCouriers() {
      await this.$apollo
        .query({
          query: require("@/graphql/deliveries/couriersEnterprise.gql"),
          variables: {
            id: this.enterpriseId,
          },
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          this.prepareData(response.data.enterprise.couriers.edges);
          this.isReadyQuery = true;
        });
    },
   
    prepareData(data) {
      data.forEach((courier) => {
        let newCourier = {
          id: courier.node.id,
          email: courier.node.email,
          isAvailable:
            courier.node.isAvailable == true ? "Disponible" : "Asignado",
          isActive: courier.node.isActive == true ? "Activo" : "Inactivo",
          names: courier.node.contact.edges[0].node.names,
          last: courier.node.contact.edges[0].node.lastnames,
          location: courier.node.contact.edges[0].node.location,
          tel: courier.node.contact.edges[0].node.telephone,
        };
        this.courierList.push(newCourier);
      });
    },

    search(value) {
      const capitalize = value.toLowerCase();

      const found = this.courierList.find((courier) => {
        if (
          courier.names ==
          value.charAt(0).toUpperCase() + capitalize.slice(1)
        ) {
          return true;
        }
      });
      if (found !== undefined) {
        this.found = found;
      } else {
        this.found = undefined;
      }
    },
     addCourier(){
         console.log("agregando")
    },
    changeStatus(value){
        console.log(value )
    }
  },
};
</script>
<style scoped>
.header-container {
  margin: 2em auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1em;
  align-content: center;
}
.container {
  max-width: 100vw;
  display: flex;
  justify-content: space-between;
  gap: 2em;
  flex-wrap: wrap;
}
</style>
