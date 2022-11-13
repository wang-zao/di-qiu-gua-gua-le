<template>
  <div class="playing_wrapper">
    <div class="top_wrapper">
      <div class="top_left">
        <div class="top_item top_blood">
          <div class="blood_item blood_active"
            v-for="(item, idx) in game.blood"
            :key="`blood-${idx}`"
          >
          </div>
          <div class="blood_item blood_bleed"
            v-for="(item, idx) in (10 - game.blood)"
            :key="`bleed-${idx}`"
          >
          </div>
          <div class="blood_label">❤</div>
        </div>
        <div class="top_item top_percent">
          <div class="progress_bar_outer">
            <div class="progress_bar_inner"
              :style="{
                width: `${game.finishedPercent}%`,
              }"
            />
          </div>
          <div class="top_percent_number">{{ game.finishedPercent }}%</div>
        </div>
      </div>
      <div class="top_right">
        <div class="top_item top_timer">
          {{ formatTime(game.usedTime) }}
        </div>
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
  },
})
export default class Playing extends Vue {

  game: Game = new Game({
    cityData: [],
    blood: 10, // for build
  });  formatTime = formatTime;
  @Prop() private msg!: string;

  mounted() {
    this.restartGame();
  }

  emitRouteChange(route: string) {
    this.$emit('routeChange', route);
  }

  async restartGame() {
    this.game.destroyGame();
    // update voronoi first
    EventBus.$emit('updateVoroniData', () => {
      // start the game in the callback
      this.game = new Game({
        cityData: store.state.cityData,
        blood: 10, // for build
        // blood: 3, // for dev
      });
      this.game.play();
    });
  }

  beforeDestroy() {
    this.game.destroyGame();
  }


}
</script>

<style scoped lang="stylus">

@keyframes fadeIn
  0%
    opacity 0
  100%
    opacity 1

.playing_wrapper
  user-select none
  color #fff
  opacity 0
  animation fadeIn .3s ease-in-out forwards
  animation-delay .5s
  .top_wrapper
    position fixed
    top 40px
    left calc(15vw - 20px)
    width calc(70vw + 40px)
    background-image radial-gradient(circle,
      rgba(255,255,255,0.1) 40%,
      rgba(255,255,255,0.3) 100%)
    border-radius 20px
    padding 20px
    box-sizing border-box
    display flex
    justify-content space-between
    align-items center
    .top_item
      text-align right
    .top_percent
      display flex
      align-items center
      margin-top 5px
      .progress_bar_outer
        position relative
        width 5rem
        height 0.6rem
        background-color #fff
        border-radius 0.2rem
        margin-top 0.15rem
        .progress_bar_inner
          position absolute
          top 0
          left 0
          height 100%
          background-color #4ac74a
          border-radius 0.2rem
      .top_percent_number
        margin-left 10px
        font-size 1rem
        line-height 1rem
    .top_timer
      font-weight bold
      font-size 1.6rem
      color #fff
      width 5rem
      text-align right
      line-height 2rem
      // margin 10px 0
    .top_blood
      display flex
      flex-wrap wrap
      .blood_item
        font-size 1.2rem
        margin-right 0.15rem
        width 0.25rem
        height 1rem
        border-radius 0.2rem
      .blood_label
        font-size 1rem
        margin-left 10px
        height 100%
        line-height 1rem
      .blood_active
        color #de5757
        background #de5757
      .blood_bleed
        color #ccc
        background #ccc
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
