<template>
  <div>
    <div class="row ml-1">
      <h6 class="font-weight-bold">{{ review.order.client.email }}</h6>
    </div>

    <div class="row ml-1 mb-4 font-weight-light text-justify">
      {{ review.comments }}
    </div>
    <hr />
  </div>
</template>

<script>
export default {
  name: "TextArea",
  props: {
    review: Object,
  },
};
</script>
