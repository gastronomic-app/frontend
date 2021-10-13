<template>
  <div class="row mt-2">
    <div class="col-md-12 col-sm-12">
      <div class="row">
        <div class="col-lg-2">
          <img
            :src="
              enterprise.image.substring(0, 5) === 'https'
                ? enterprise.image
                : 'https://res.cloudinary.com/dcbzwrn30/image/upload/v1/' +
                  enterprise.image
            "
            class="card-img-top img-fluid img-responsive"
            :alt="'logo ' + name"
          />
        </div>
        <div class="col-lg-10 col-md-12 col-sm-12 mt-4">
          <h1>
            <b>{{ name | capitalize }}</b>
          </h1>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-10 col-md-12 col-sm-12 mt-2">
          <h4>
            {{ section | capitalize }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Enterprise",
  props: {
    name: String,
    enterprise: Object,
    section: String,
  },
  methods: {},
};
</script>
<style scoped></style>
