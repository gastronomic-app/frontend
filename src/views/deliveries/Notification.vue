<template>
  <div class="dropdown">

      <a class="dropdown" data-toggle="dropdown">
        <div class="bell-fer">
        <svg class="dot" v-if="unread" height="10" width="10">
          <circle cx="5" cy="5" r="3.5" fill="white" />
        </svg>
        <img class="n-bell" src="@/assets/n-bell2.png" />
        </div>
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
        <li
          class="dropdown-item"
          v-bind:class="{ unread: !notification.node.read }"
        >
          <div class="date">
            <b>{{ notification.node.created | filterDate }}</b>
          </div>
          <div class="notification-title">
            <b>{{ notification.node.title }}</b>
          </div>
          <div class="message">{{ notification.node.message }}</div>
          <div>
            <a class="link-read" v-on:click="markRead(notification.node.id)"
              >Marcar como leído</a
            >
          </div>
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
      unread: false,
    };
  },
  mounted() {
    let userData = localStorage.getItem("user");
    if (userData) {
      userData = JSON.parse(userData);
      this.getNotifications(userData);
      setInterval(
        function () {
          this.getNotifications(userData);
        }.bind(this),
        3000
      );
    }
  },
  filters: {
    filterDate: function (value) {
      let date = new Date(value);
      let now = new Date();
      let stringReturn = "";
      let stringDate =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      let stringNow =
        now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();

      if (stringDate !== stringNow) {
        let monthNames = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        stringReturn = date.getDate() + "-" + monthNames[date.getMonth()];
      } else {
        stringReturn = date.getHours() + ":" + date.getMinutes();
      }

      return stringReturn;
    },
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
            this.notifications.sort((a, b) => {
              return new Date(b.node.created) - new Date(a.node.created);
            });
          }
          let countUnread = this.notifications.filter(
            (notification) => !notification.node.read
          );

          if (countUnread.length > 0) {
            this.unread = true;
          } else {
            this.unread = false;
          }
        });
    },
    markRead(notificationId) {
      this.$apollo
        .mutate({
          mutation: require("@/graphql/notifications/updateNotification.gql"),
          variables: {
            id: notificationId,
            read: true,
          },
        })
        .then((response) => {
          console.log("actualización de notification:", response.data);
        });
    },
  },
};
</script>

<style scoped>
.dropdown-menu {
  /*padding: 3em auto;*/
  margin-top: 2.2em;
  min-width: 28vw;
  /*max-width: 28vw;*/
  max-height: 30vw;
  overflow: scroll;
  overflow-x: hidden;
  /*width: 20em;*/
  background: var(--dark-x) !important;
}

.dropdown-menu::-webkit-scrollbar {
  width: 0.5em;
}
.dropdown-menu::-webkit-scrollbar-track {
  background: var(--dark-xx);
}
.dropdown-menu::-webkit-scrollbar-thumb {
  background-color: var(--grey);
  border-radius: 1em;
  border: 1px solid var(--grey);
}

.dropdown:hover {
  cursor: pointer;
}
.dropdown-item:hover {
  background: transparent !important;
  color: var(--white);
}
.n-bell {
  width: 1.6em;
  height: 1.6em;
  opacity: 0.7;
}

.title {
  color: var(--orange-x);
  font-size: 1.1em;
}

.notification-title {
  color: var(--light);
  font-size: 0.9em;
  /*float: left;*/
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

.date {
  color: var(--orange-x);
  font-size: 0.7em;
  float: right;
  padding-left: 1em;
  padding-top: 0.2em;
}

.unread {
  background-color: rgba(26, 26, 26, 0.705);
}

.link-read {
  color: var(--orange-x);
  font-size: 0.75em;
}

.dot {
  position: absolute;
  left: 0.8em;
  top: 0.1em;
  z-index: 10;
}
</style>
