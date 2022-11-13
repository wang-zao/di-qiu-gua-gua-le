<template>
  <div class="router_wrapper">
    <main-menu
      @routeChange="handleRouteChange"
      v-if="currentRoute === 'main-menu'"
    />
    <playing
      @routeChange="handleRouteChange"
      v-if="currentRoute === 'playing'"
    />
    <rank
      @routeChange="handleRouteChange"
      v-if="currentRoute === 'rank'"
    />
    <music-player />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MainMenu from '../Tabs/MainMenu.vue';
import Playing from '../Tabs/Playing.vue';
import Rank from '../Tabs/Rank.vue';
import MusicPlayer from '../component/MusicPlayer.vue';
import { EventBus } from '@/utils/eventBus';

@Component({
  components: {
    MainMenu,
    Playing,
    Rank,
    MusicPlayer,
  }
})
export default class GlobalRouter extends Vue {
  @Prop() private currentRoute!: string;


  handleRouteChange(route: string) {
    this.$emit('handleRouteChange', route);
    if (route === 'playing') {
      EventBus.$emit('globeRotate', false);
    } else {
      EventBus.$emit('globeRotate', true);
    }
  }
}
</script>

<style scoped lang="stylus">

.router_wrapper
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
</style>
