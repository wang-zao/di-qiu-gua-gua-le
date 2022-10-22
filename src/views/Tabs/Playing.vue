<template>
  <div class="playing_wrapper">
    <div class="top_wrapper">
      <div class="top_item top_timer">
        {{ game.usedTime }}
      </div>
      <div class="top_item top_blood">
        {{ game.blood }}
      </div>
    </div>
    <div class="mid_wrapper">
      <question-pad :game="game"/>
    </div>
    <div
      class="bottom_wrapper"
      @click="emitRouteChange('main-menu')"
    >go back</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import QuestionPad from '../component/QuestionPad.vue';
import store from '@/store';
import { EventBus } from '@/utils/eventBus';
import Game from '@/utils/game';

@Component({
  components: {
    QuestionPad,
  }
})
export default class Playing extends Vue {
  @Prop() private msg!: string;
  game: Game = new Game({
    cityData: store.state.cityData,
    blood: 10,
  });

  mounted() {
    // const game = new Game();
    this.game.play();
    console.log('game', this.game);
  }


  emitRouteChange(route: string) {
    this.$emit('routeChange', route);
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
  .mid_wrapper
    position fixed
    top 60%
    left 50%
    transform translateX(-50%)
  .bottom_wrapper
    position fixed
    bottom 20px
    left 20px
</style>
