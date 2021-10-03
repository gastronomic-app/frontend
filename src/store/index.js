import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    setCount(state, value) {
      state.count=value;
    },
  },
  actions: {
    setCountAction(context, value) {
      context.commit("setCount", value);
    },
  },
  getters: {
    getCount(state) {
      return state.count;
    },
  },
  modules: {},
});
