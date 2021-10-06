<template>
  <div>
    {{ getNickName() }}
    <div class="row ml-3">
      <h6 class="font-weight-bold">{{ user }}</h6>
    </div>
    <div class="row ml-4 mb-2 font-weight-light text-justify">
      {{ comment }}
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
      this.user = this.email.split("@")[0];
    },
  },
  props: {
    email: String,
    comment: String,
  },
};
</script>
