<template>
  <div class="dropdown">
    <a class="dropdown" data-toggle="dropdown">
        <!--<svg class="" height="10" width="10">
          <circle cx="5" cy="5" r="3" fill="white" />
        </svg>-->
      <img class="n-bell" src="@/assets/n-bell.png" />
    </a>
    <ul class="dropdown-menu dropdown-menu-right">
      <li class="dropdown-item title"><b>Notificaciones</b></li>
      <div class="dropdown-divider"></div>

      <li v-if="!show" class="dropdown-item">
        <div class="notification-title">
          <b>Aún no tienes notificaciones</b>
        </div>
      </li>

      <div
        v-else
        v-for="notification in notifications"
        :key="notification.node.id"
      >
        <li class="dropdown-item">
          <div class="notification-title">
            <b>{{ notification.node.title }}</b>
          </div>
          <div class="message">{{ notification.node.message }}</div>
          <!--<div class="date">{{ notification.node.created}} </div>-->
        </li>
        <div class="dropdown-divider"></div>
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
      show: false,
    };
  },
  mounted() {
    let userData = localStorage.getItem("user");
    if (userData) {
      userData = JSON.parse(userData);
      this.getNotifications(userData);
      /*setInterval(
        function () {
          this.getNotifications(userData);
        }.bind(this),
        500
      );*/
    }
  },
  methods: {
    getNotifications(userData) {
      this.$apollo
        .query({
          query: require("@/graphql/notifications/allNotifications.gql"),
          variables: {
            id: userData.id,
          },
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          this.notifications = response.data.user.notifications.edges;
          if (this.notifications.length > 0) {
            this.show = true;
          }
        });
    },
  },
};
</script>

<style scoped>
.dropdown-menu {
  /*padding: 3em auto;*/
  margin-top: 2.1em;
  width: 28vw;
  max-width: 28vw;
  height: auto;
  /*width: 20em;*/
  background: var(--dark-x) !important;
}

.dropdown:hover {
  cursor: pointer;
}
.dropdown-item:hover {
  background: transparent !important;
  color: var(--white);
}
.n-bell {
  width: 1.3em;
  height: 1.3em;
  opacity: 0.75;
}

.title {
  color: var(--orange-x);
  font-size: 1.1em;
}

.notification-title {
  color: var(--light);
  font-size: 0.9em;
}

.message {
  color: var(--white);
  font-size: 0.82em;
}

.dropdown-divider {
  border-block-color: var(--dark-xx);
}

.dropdown-item {
  white-space: normal;
}

.circle {
  position: absolute;
  left: 20px;
}

.date{
  color: var(--white);
  font-size: 0.6em;
}
</style>
