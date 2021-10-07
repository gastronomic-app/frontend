<template>
  <section>
    <div
      class="modal fade"
      :id="'simpleModal' + modalRef"
      tabindex="-1"
      role="dialog"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" :class="isCentered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title color-title">{{ title }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>{{ body }}</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-black"
              @click="buttonPrimaryAction(modalRef)"
              data-dismiss="modal"
              data-backdrop="false"
            >
              {{ buttonPrimaryTitle }}
            </button>
            <button v-show="buttonSecundary"
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              {{ buttonSecundaryTitle }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "SimpleModal",
  props: {
    modalRef: { type: String, default: "" },
    title: { type: String, default: "" },
    modalCentered: { type: Boolean, default: false },
    body: { type: String, default: "" },
    buttonPrimaryTitle: { type: String, default: "OK" },
    buttonPrimaryAction: { type: Function, default: ()=>{}},
    buttonSecundary:{type:Boolean, default:true},
    buttonSecundaryTitle: { type: String, default: "cerrar" },
    buttonSecundaryAction: { type: Function },
  },
  computed: {
    isCentered() {
      return this.modalCentered == true ? "modal-dialog-centered" : "";
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.btn-black {
  background-color: var(--dark);
  color: var(--white);
}
.btn-black:hover {
  background-color: var(--dark-xx);
  color: var(--light);
}
.color-title {
  color: var(--dark);
}
</style>