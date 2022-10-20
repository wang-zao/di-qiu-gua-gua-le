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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MainMenu from '../Tabs/MainMenu.vue';
import Playing from '../Tabs/Playing.vue';
import Rank from '../Tabs/Rank.vue';
import { EventBus } from '@/utils/eventBus';

@Component({
  components: {
    MainMenu,
    Playing,
    Rank,
  }
})
export default class GlobalRouter extends Vue {
  @Prop() private currentRoute!: string;

  handleRouteChange(route: string) {
    this.$emit('handleRouteChange', route);
    EventBus.$emit('playAudio', 'buttonPress');
  }
}
</script>

<style scoped lang="stylus">

.router_wrapper
  position: fixed;
  top: 0;
  left: 0;
  // right: 0;
  // bottom: 0;
  // width: 100vw;
  // height: 100vh;
  // color: #fff;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  z-index: 10;
</style>
