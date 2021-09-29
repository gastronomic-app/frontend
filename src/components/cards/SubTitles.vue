<template>
  <div>
    <div class="row">
      <h4 class="mt-2">{{ content }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubTitles",
  props: {
    content: String,
  },
};
</script>
