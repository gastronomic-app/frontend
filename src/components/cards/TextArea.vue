<template>
  <div>
    {{ getNickName() }}
    <div class="row ml-1">
      <h6 class="font-weight-bold">{{ user }}</h6>
    </div>
    {{ getNickName() }}
    <div class="row ml-4 mb-4 font-weight-light text-justify">
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
