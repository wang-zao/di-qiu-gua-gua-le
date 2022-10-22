import Vue from 'vue';
import Vuex from 'vuex';
import {
  VORONOI_DATA_URL,
  DATA_SHUFFLE_INDEX,
} from './utils/constants';
import { getRandomOptionsOfName } from '@/utils/helper';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    voronoiData: [],
    cityData: [],
  },
  mutations: {
    setDataset(state, payload) {
      console.log('setDataset', payload);
      state.voronoiData = payload;
      state.cityData = payload.features
        .map((feature: any) => feature.properties)
        .sort((a: any, b: any) => a.id - b.id + Math.random() * DATA_SHUFFLE_INDEX)
      state.cityData.forEach((i: any) => {
          i.options = getRandomOptionsOfName(i.name_chn);
        });
      console.log('state.cityData', state.cityData);
    }
  },
  actions: {
    async loadDataset({ commit }) {
      // Load the dataset
      const response = await fetch(VORONOI_DATA_URL);
      const data = await response.json();
      // Store the dataset
      commit('setDataset', data);
    }

  },
});
