<template>
  <div class="jumbotron">
    <!-- Header -->
    <div class="header-container">
      <h2 class="title">
        Lista de mensajeros adscritos a <b> {{ enterpriseName }}</b>
      </h2>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1" style="height: 2.4em"
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
      <button
        class="new-courier btn btn-black"
        @click="addCourier"
        type="button"
      >
        Agregar
      </button>
      <button class="new-courier btn btn-black" @click="back" type="button">
        volver
      </button>
    </div>
    <!-- Section List -->
    <div v-if="!isReadyQuery">
      <div v-if="courierList.length === 0">
        <loading-graphql></loading-graphql>
      </div>
    </div>
    <div v-else>
      <div v-show="found !== undefined">
        <courier-card :courier-info="found" :fn="changeStatus"></courier-card>
      </div>
      <paginate ref="paginator" name="courierList" :list="courierList" :per="6">
        <section v-show="!found" class="container">
          <template v-for="(courier, idx) in paginated('courierList')">
            <courier-card
              :key="idx"
              :courier-info="courier"
              :fn="changeStatus"
            ></courier-card>
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
    <div v-show="isReadyQuery && courierList.length == 0">
      <not-found></not-found>
    </div>
    <div>
      <b-modal id="warning" centered title="¡Atención!">
        <p class="my-4">
          El mensajero que quiere desactivar de su lista tiene asignada una
          entrega.
        </p>
        <template #modal-footer="{ cancel }">
          <b-button class="btn-black" size="sm" @click="cancel">
            Cancelar</b-button
          >
        </template>
      </b-modal>
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
  props: {
    enterpriseId: {
      type: String,
      require: true,
    },
    enterpriseName: {
      type: String,
      require: true,
    },
  },

  created() {
    const id = JSON.parse(localStorage.getItem("enterpId"));
    const name = JSON.parse(localStorage.getItem("enterpName"));

    if (id !== null) {
      this.enterpriseId = id;
      this.enterpriseName = name;
    }
    window.addEventListener("beforeunload", this.leaving);

    this.queryCouriers();
  },
  ready: function () {
    window.beforeunload = this.leaving;
    window.onblur = this.leaving;
  },
  destroyed() {
    this.leaving();
  },
  data() {
    return {
      courierList: [],
      found: undefined,
      paginate: ["courierList"],
      isReadyQuery: false,
    };
  },
  methods: {
    leaving() {
      if (localStorage.getItem("enterpId") !== undefined) {
        localStorage.setItem("enterpId", JSON.stringify(this.enterpriseId));
        localStorage.setItem("enterpName", JSON.stringify(this.enterpriseName));
      }
    },
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
            courier.node.isAvailable === true ?  "Disponible" :"Asignado",
          isActive: courier.node.isActive,
          names: courier.node.contact.edges[0].node.names,
          last: courier.node.contact.edges[0].node.lastnames,
          location: courier.node.contact.edges[0].node.location,
          tel: courier.node.contact.edges[0].node.telephone,
        };
        this.courierList.push(newCourier);
      });
    },
    /*Actualizar el estado del mensajero*/
    updateStatusCourier(courier, status) {
      this.$apollo.mutate({
        mutation: require("@/graphql/deliveries/updateCourier.gql"),
        variables: {
          id: courier,
          isAvailable: status ?true: true,
        },
      });
    },

    search(value) {
      const found = this.courierList.find((courier) => {
        if (courier.names.toLowerCase() === value.toLowerCase()) {
          return true;
        }
      });
      if (found !== undefined) {
        this.found = found;
      } else {
        this.found = undefined;
      }
    },
    addCourier() {
      this.$router.push({
        name: "Register",
        params: { enterpriseId: this.enterpriseId },
      });
    },
    back() {
      this.$router.push({
        name: "EnterpriseList",
      });
    },
    changeStatus(courierId, state) {
      let idx = this.courierList.findIndex((courier) => {
        if (courier.id === courierId) {
          return true;
        }
      });
      if (this.courierList[idx].isAvailable!=="Asignado" ) {
        this.$apollo.mutate({
          mutation: require("@/graphql/client/deactivateClient.gql"),
          variables: {
            id: courierId,
            is_active: !state,
          },
        });
        this.updateStatusCourier(courierId, status);
        this.courierList[idx].isActive = !state;
      } else {
        this.$bvModal.show("warning");
      }
    },

  },
};
</script>
<style scoped>
.jumbotron {
  margin: 2em 0;
  background-color: whitesmoke;
  box-shadow: 1em 1em 4em 1em rgba(13, 13, 13, 0.2);
  border-radius: 1em;
}
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
.btn-black {
  transform: width 1s;
  transform: height 1s;
}
.btn-black:hover {
  background-color: var(--dark-xx);
  color: white;
  width: calc(100% + 0.2em);
  height: calc(100% + 0.2em);
}
</style>
