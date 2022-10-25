<template>
  <div class="win_window_wrap">
    <div class="win_window">
      <div class="win_window_title">地球，刮出来了!</div>
      <div class="win_window_time_used">用时：{{ formatTime(game.usedTime) }}</div>
      <div class="win_window_buttons_wrap">
        <div class="win_window_button"
          @click="handleHomeClicked"
        >主页</div>
        <div class="win_window_button"
          @click="showAddToRankingWindow"
        >加入排行榜</div>
      </div>
    </div>
    <div class="win_window_add_to_ranking_window"
      :class="{
        'win_window_add_to_ranking_window_show': game.questionPad.displayingAddToRankingWindow,
      }"
    >
      <div class="win_window_add_to_ranking_window_title">加入排行榜</div>
      <div class="win_window_add_to_ranking_window_used_time">用时：{{ formatTime(game.usedTime) }}</div>
      <div class="win_window_add_to_ranking_window_input_wrap">
        <input
          class="win_window_add_to_ranking_window_input"
          type="text"
          placeholder="输入你的名字"
          v-model="name"
          @input="handleNameChange"
        />
        <div
          class="win_window_add_to_ranking_window_warning"
          :class="{
            'win_window_add_to_ranking_window_warning_show': showNameWarning,
          }"
        >
          {{ nameWarning }}
        </div>
        <input
          class="win_window_add_to_ranking_window_input"
          type="text"
          placeholder="输入你的感想"
          v-model="words"
          @input="handleWordsChange"
        />
        <div 
          class="win_window_add_to_ranking_window_warning"
          :class="{
            'win_window_add_to_ranking_window_warning_show': showWordsWarning,
          }"
        >
          {{ wordsWarning }}
        </div>
      </div>
      <div class="win_window_add_to_ranking_window_buttons_wrap">
        <div class="win_window_add_to_ranking_window_button"
          @click="hideAddToRankingWindow"
        >取消</div>
        <div class="win_window_add_to_ranking_window_button"
          @click="addToRanking"
        >加入</div>
      </div>
    </div>
    <div class="win_window_add_to_ranking_window_mask"
      :class="{
        'win_window_add_to_ranking_window_mask_show': game.questionPad.displayingAddToRankingWindow,
      }"
      @click="hideAddToRankingWindow" />

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Game from '@/utils/game';
import { formatTime } from '@/utils/helper';

@Component
export default class WinWindow extends Vue {
  @Prop() private game!: Game;
  formatTime = formatTime;
  name: string = '';
  words: string = '';
  nameWarning: string = '';
  wordsWarning: string = '';
  showNameWarning: boolean = false;
  showWordsWarning: boolean = false;

  showAddToRankingWindow() {
    this.game.questionPad.changeDisplayAddToRankingWindow(true);
  }

  hideAddToRankingWindow() {
    this.game.questionPad.changeDisplayAddToRankingWindow(false);
  }

  addToRanking() {
    this.game.questionPad.changeDisplayAddToRankingWindow(false);
    // this.game.questionPad.changeDisplayWinWindow(false);
    this.$emit('routeChange', 'main-menu');
  }

  handleHomeClicked() {
    this.$emit('routeChange', 'main-menu');
    this.game.destroyGame();
  }

  emitRouteChange(route: string) {
    this.$emit('routeChange', route);
  }

  handleNameChange() {
    if (this.name.length > 20) {
      this.nameWarning = '名字不能超过20个字';
      this.showNameWarning = true;
    } else if (this.name.length === 0) {
      this.nameWarning = '名字不能为空';
      this.showNameWarning = true;
    } else {
      this.showNameWarning = false;
    }
  }

  handleWordsChange() {
    if (this.words.length > 50) {
      this.wordsWarning = '感想不能超过50个字';
      this.showWordsWarning = true;
    } else {
      this.showWordsWarning = false;
    }
  }
}
</script>

<style scoped lang="stylus">

.win_window
  color #000
  position fixed
  top 60%
  left 50%
  transform translate(-50%, 0%)
  width 70vw
  height max-content
  background-color #ffffffaa
  border-radius 10px
  padding 20px
  .win_window_title
    text-align center
    font-size 30px
  .win_window_time_used
    text-align center
    font-size 20px
    margin 10px 0
  .win_window_buttons_wrap
    display flex
    justify-content space-around
    margin-top 20px
    .win_window_button
      width 100px
      height 40px
      line-height 40px
      text-align center
      border-radius 10px
      background-color #fff
      cursor pointer
      &:hover
        background-color #ddd
.win_window_add_to_ranking_window
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 70vw
  height max-content
  background-color #fff
  border-radius 10px
  color #000
  display none
  padding 20px
  z-index 6

  &.win_window_add_to_ranking_window_show
    display block
  .win_window_add_to_ranking_window_title
    text-align center
    font-size 30px
    margin-top 20px
  .win_window_add_to_ranking_window_used_time
    text-align center
    font-size 20px
    margin 10px 0
  .win_window_add_to_ranking_window_input_wrap
    margin-top 10px
    .win_window_add_to_ranking_window_input
      margin-top 10px
      width 100%
      box-sizing border-box
      height 40px
      line-height 40px
      text-align center
      border-radius 10px
      background-color #fff
      cursor pointer
      // &:hover
      //   background-color #ddd
    .win_window_add_to_ranking_window_warning
      color #f00
      text-align left
      margin-top 5px
      transition all 0.5s
      opacity 0
      font-size 12px
      line-height 12px
      height 12px

    .win_window_add_to_ranking_window_warning_show
      opacity 1
  .win_window_add_to_ranking_window_buttons_wrap
    display flex
    justify-content space-around
    margin-top 20px
    .win_window_add_to_ranking_window_button
      width 100px
      height 40px
      line-height 40px
      text-align center
      border-radius 10px
      background-color #fff
      cursor pointer
      &:hover
        background-color #ddd
.win_window_add_to_ranking_window_mask
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  background-color #000000
  opacity 0
  transition opacity 0.5s
  z-index 5
  display none
  transform none
  &.win_window_add_to_ranking_window_mask_show
    opacity 0.5
    display block
</style>
