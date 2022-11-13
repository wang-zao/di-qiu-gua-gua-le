<template>
  <div class="win_window_wrap"
  >
    <div class="win_window" >
      <div 
        class="win_window_showing_before"
        :class="{
          'win_window_showing': game.questionPad.displayingWinWindow,
        }">
        <div class="win_window_title">地球，刮出来了!</div>
        <div class="win_window_buttons_wrap">
          <div class="win_window_button"
            @click="handleHomeClicked"
          >主页</div>
          <div class="win_window_button"
            @click="showAddToRankingWindow"
          >加入排行榜</div>
        </div>
      </div>
    </div>
    <div class="win_window_add_to_ranking_window"
      :class="{
        'win_window_add_to_ranking_window_show': game.questionPad.displayingAddToRankingWindow,
      }"
    >
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
    <notification
      ref="notification"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Game from '@/utils/game';
import { formatTime } from '@/utils/helper';
import { EventBus } from '@/utils/eventBus';
import API from '@/api';
import Notification from './Notification.vue';

@Component({
  components: {
    Notification,
  },
})
export default class WinWindow extends Vue {
  @Prop() private game!: Game;
  formatTime = formatTime;
  name: string = '';
  words: string = '';
  nameWarning: string = '';
  wordsWarning: string = '';
  showNameWarning: boolean = false;
  showWordsWarning: boolean = false;
  alreadyAdded: boolean = false;

  showAddToRankingWindow() {
    if (this.alreadyAdded) {
      (this.$refs.notification as any).showNotification('你已经加入过排行榜了');
      return;
    }
    this.game.questionPad.changeDisplayAddToRankingWindow(true);
    // play button music
    EventBus.$emit('playAudio', 'btn');
  }

  hideAddToRankingWindow() {
    this.game.questionPad.changeDisplayAddToRankingWindow(false);
    // play button music
    EventBus.$emit('playAudio', 'btn');
  }

  async addToRanking() {
    // play button music
    EventBus.$emit('playAudio', 'btn');
    // check input
    this.handleNameChange();
    this.handleWordsChange();
    // check input
    if (this.showNameWarning || this.showWordsWarning) {
      return;
    }
    // add to ranking
    await API.addRankItem({
      name: this.name,
      words: this.words,
      usedTime: this.game.usedTime,
    });
    // change state
    this.alreadyAdded = true;
    // show notification
    (this.$refs.notification as any).showNotification('加入排行榜成功');
    // hide window
    this.game.questionPad.changeDisplayAddToRankingWindow(false);
  }

  handleHomeClicked() {
    this.$emit('routeChange', 'main-menu');
    this.game.destroyGame();
    // play button music
    EventBus.$emit('playAudio', 'btn');

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

@keyframes zoomInWithOffset
  0%
    opacity 0
    transform scale(5)
  100%
    opacity 1
    transform scale(1)

.win_window
  color #000
  position fixed
  top 70%
  left 50%
  transform translate(-50%, 0%)
  width 70vw
  height max-content
  border-radius 10px
  padding 20px
  .win_window_title
    text-align center
    color #fff
    font-size 30px
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
      background-color #ffffff44
      color #fff
      cursor pointer
      &:hover
        background-color #ffffff22
.win_window_showing_before
  opacity 0
.win_window_showing
  animation zoomInWithOffset 0.5s forwards
  animation-delay 1s
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
      cursor pointer
      background-color #eee
      border-radius 10px
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
