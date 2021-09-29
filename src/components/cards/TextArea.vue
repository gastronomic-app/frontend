<template>
  <div>
    <div class="row ml-1">
      <h6 class="font-weight-bold">{{ user }}</h6>
    </div>
    {{ getNickName() }}
    <div class="row ml-1 mb-4 font-weight-light text-justify">
      {{ review.comments }}
    </div>
    <hr />
  </div>
</template>

<script>
export default {
  name: "TextArea",
  data() {
    return {
      user: "",
    };
  },
  methods: {
    getNickName() {
      this.user = this.review.order.client.email.split("@")[0];
    },
  },
  props: {
    review: Object,
  },
};
</script>
