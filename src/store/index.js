import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    deliveryTimesLocal:{
      lastActiveTime:{},
      deliveryTimes: [],

    }
   
  },
  mutations: {
    decrementCount(state) {
      state.count = state.count - 1;
    },
    incrementCount(state) {
      state.count = state.count + 1;
    },
    setCount(state, value) {
      state.count = state.count - value;
    },
    setCountStorage(state, value) {
      state.count = value;
    },

    //Add a new delivery time for an order
    addDeliveryTime(state, time) {
      if (time.hours > 0 || time.min > 0 || time.sec > 0) {
        let idx = state.deliveryTimesLocal.deliveryTimes.findIndex(element => {
          if (element.id === time.id) {
            return true;
          }
        });
        if (idx >= 0) {
          state.deliveryTimesLocal.deliveryTimes[idx] = time;
        } else {
          state.deliveryTimesLocal.deliveryTimes.push(time)
        }
      }
    },

    //Add all delivery times to localstorage
    setDeliveryTimes(state) {
      const date = new Date();
      const currenttime = {
        hours: date.getHours(),
        min: date.getMinutes(),
        sec: date.getSeconds(),
      };
      state.deliveryTimesLocal.lastActiveTime=currenttime;
      localStorage.setItem("deliveryTimes", JSON.stringify(state.deliveryTimesLocal))
    }
  },
  actions: {
    decrementCountAction(context) {
      context.commit("decrementCount");
    },
    incrementCountAction(context) {
      context.commit("incrementCount");
    },
    setCountAction(context, value) {
      context.commit("setCount", value);
    },

    setStorageCountAction(context, value) {
      context.commit("setCountStorage", value);
    },
    setDeliveryTimesAction(context) {
      context.commit("setDeliveryTimes")
    },
    addDeliveryTimeAction(context, time) {

      context.commit("addDeliveryTime", time);
    },
  },


  getters: {
    getCount(state) {
      return state.count;
    },
  },
  modules: {},
});
