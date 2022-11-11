import Vue from 'vue';
import Vuex from 'vuex';
import {
  DATA_SHUFFLE_INDEX,
  VORONOI_DATA_URL_List,
} from './utils/constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    voronoiData: [],
    cityData: [],
  },
  mutations: {
    setDataset(state, payload) {
      state.voronoiData = payload;
      state.cityData = payload.features
        .map((feature: any) => feature.properties)
        .sort((a: any, b: any) => a.id - b.id + Math.random() * DATA_SHUFFLE_INDEX)
      state.cityData.forEach((i: any) => {
          i.options = i.name_options.split('。')
            .sort(() => Math.random() - 0.5)
        });
    }
  },
  actions: {
    async loadDataset({ commit }) {
      // load a random dataset from the list
      const response = await fetch(VORONOI_DATA_URL_List[Math.floor(Math.random() * VORONOI_DATA_URL_List.length)]);
      const data = await response.json();
      const dataDeepCloned = JSON.parse(JSON.stringify(data));
      // Store the dataset
      commit('setDataset', dataDeepCloned);
    }

  },
});
