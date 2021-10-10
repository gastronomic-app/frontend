<template>
  <div class="dropdown">
    <a href="" class="dropdown-toggle" data-toggle="dropdown"> Noti </a>
    <ul class="dropdown-menu">
      <div v-for="notification in notifications" :key="notification.node.id">
        <li class="dropdown">{{ notification.node.title }}</li>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Notification",
  data() {
    return {
      notifications: Object,
    };
  },
  mounted() {
    let userData = localStorage.getItem("user");
    userData = JSON.parse(userData);

    if (userData) {
      this.getNotifications();
      setInterval(function() {
        this.getNotifications();
      }.bind(this), 200)

    }
  },
  methods: {
    getNotifications() {
      this.$apollo
        .query({
          query: require("@/graphql/notifications/allNotifications.gql"),
          variables: {
            id: userData.id,
          },
        })
        .then((response) => {
          console.log("---", response.data.user);
          this.notifications = response.data.user.notifications.edges;
        });
    }
  }
};
</script>

<style>
</style>
