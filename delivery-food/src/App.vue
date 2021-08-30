<template>
  <div>
    <NavBar />
    <Footer />

  </div>
</template>

<script>

import NavBar from "@/components/common/NavBar.vue";
import Footer from "@/components/common/Footer.vue";

export default {
  components: {
    NavBar,
    Footer,
  },
};
</script>
<style >
  .container-general{
    min-height: calc(100vh - var(--height-navbar) - var(--height-footer));
  }
</style>
