<template>
  <div>
    <NavBar />
    <div class="container container-general">
     <router-view />
   </div>
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
