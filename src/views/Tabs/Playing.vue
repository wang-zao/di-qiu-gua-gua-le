<template>
  <div class="playing_wrapper">
    <div class="top_wrapper">
      <div class="top_item top_blood">
        <div class="blood_item blood_active"
          v-for="(item, idx) in game.blood"
          :key="`blood-${idx}`"
        >
        ❤
        </div>
        <div class="blood_item blood_bleed"
          v-for="(item, idx) in (10 - game.blood)"
          :key="`bleed-${idx}`"
        >
        ❤
        </div>
      </div>
      <div class="top_item top_timer">
        {{ formatTime(game.usedTime) }}
      </div>
      <div class="top_item top_percent">
        {{ game.finishedPercent }}%
      </div>
    </div>
    <div class="mid_wrapper">
      <question-pad
        :game="game"
      />
    </div>
    <!-- <div
      class="bottom_wrapper"
      @click="emitRouteChange('main-menu')"
    >go back</div> -->
    <win-window
      :game="game"
      v-if="game.questionPad.displayingWinWindow"
      @routeChange="e => emitRouteChange(e)"
    />
    <lost-window
      :game="game"
      v-if="game.questionPad.displayingLostWindow"
      @routeChange="e => emitRouteChange(e)"
      @restartGame="e => restartGame(e)"
    />
    <confetti v-if="game.questionPad.displayingConfetti"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import QuestionPad from '../component/QuestionPad.vue';
import WinWindow from '../component/WinWindow.vue';
import LostWindow from '../component/LostWindow.vue';
import Confetti from '../component/Confetti.vue';
import store from '@/store';
import { EventBus } from '@/utils/eventBus';
import Game from '@/utils/game';
import { formatTime } from '@/utils/helper';

@Component({
  components: {
    QuestionPad,
    WinWindow,
    LostWindow,
    Confetti,
  }
})
export default class Playing extends Vue {
  @Prop() private msg!: string;
  game: Game = new Game({
    cityData: store.state.cityData,
    // blood: 10, // for build
    blood: 3, // for dev
  });;
  formatTime = formatTime;

  mounted() {
    console.log('mounted')
    this.game = new Game({
      cityData: store.state.cityData,
      blood: 10, // for build
      // blood: 3, // for dev
    });
    this.game.play();
    console.log('game', this.game);
  }

  emitRouteChange(route: string) {
    this.$emit('routeChange', route);
  }

  async restartGame() {
    // update voronoi
    // await this.updateVoronoi();
    this.game.destroyGame();
    this.game = new Game({
      cityData: store.state.cityData,
      blood: 10, // for build
      // blood: 3, // for dev
    });
    this.game.play();
  }

  // async updateVoronoi() {
  //   await store.dispatch('loadDataset');
  //   EventBus.$emit('updateVoronoi', store.state.voronoiData);
  // }

  beforeDestroy() {
    this.game.destroyGame();
  }


}
</script>

<style scoped lang="stylus">

.playing_wrapper
  color #fff
  .top_wrapper
    position fixed
    top 20px
    left 20px
    .top_item
      text-align left
    .top_timer
      font-weight bold
      font-size 1.2rem
      color #fff
      width 3rem
      text-align center
      line-height 1.2rem
      margin 10px 0
    .top_blood
      display flex
      .blood_item
        font-size 0.8rem
        margin-right 3px
      .blood_active
        color #f00
      .blood_bleed
        color #ccc
  .mid_wrapper
    position fixed
    top 60%
    left 50%
    transform translateX(-50%)
  // .bottom_wrapper
  //   position fixed
  //   bottom 20px
  //   left 20px
</style>
