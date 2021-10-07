<template>
  <section>

    <div
      class="modal fade"
      id="simpleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
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
              data-dismiss="modal"
              data-backdrop="false"
            >
              {{ buttonPrimaryTitle }}
            </button>
            <button
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
    title: { type: String, default: "Modal Title" },
    body: { type: String, default: "Modal Body" },
    buttonPrimaryTitle: { type: String, default: "OK" },
    buttonPrimaryAction: { type: Function },
    buttonSecundaryTitle: { type: String, default: "cerrar" },
    buttonSecundaryAction: { type: Function },
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
.color-text-tar {
  color: var(--black);
}
.color-text-tar:hover {
  text-decoration: none;
  color: var(--black);
}
</style>