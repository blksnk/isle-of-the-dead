import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    slideIndex: 0,
  },
  mutations: {
    setSlideIndex(state, index) {
      state.slideIndex = index;
    },
  },
  actions: {},
  modules: {},
});
