import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    decrementCount(state) {
      state.count = state.count - 1;
      console.log("Dec... " + state.count + " (" + typeof this.state.count + ") ");
    },
    incrementCount(state) {
      state.count = state.count + 1;
      console.log("Inc... " + state.count + " (" + typeof this.state.count + ") ");
    },
    setCount(state, value) {
      state.count = state.count - value;
      console.log("Set... " + state.count + " (" + typeof this.state.count + ") ");
    },
    setCountStorage(state, value) {
      state.count = value;
    },
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
  },
  getters: {
    getCount(state) {
      return state.count;
    },
  },
  modules: {},
});
