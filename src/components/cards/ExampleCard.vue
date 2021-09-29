<template>
  <div class="card">
    <img
      src="@/assets/enterprise.jpg"
      class="card-img-top"
      alt="logo establecimiento"
    />
    <div class="card-body">
      <h5 class="card-title">{{ enterprise.name | capitalize }}</h5>
      <p class="card-text">{{ enterprise.location | capitalize }}</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Creeado el {{ enterprise.created }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExampleCard",
  props: {
    /**
     * Objeto establecimiento enviado
     * como prop desde una vista
     */
    enterprise: Object,
  },
};
</script>
