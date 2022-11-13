<template>
  <div class="lost_wrap">
    <div class="lost_window_showing_before"
      :class="{
        'lost_window_showing': game.questionPad.displayingLostWindow,
      }">
      <div class="lost_title">地球，刮不开了...</div>
      <div class="lost_buttons_wrap">
        <div class="lost_button"
          @click="handleHomeClicked"
        >主页</div>
        <div class="lost_button"
          @click="handleRestartClicked"
        >重来</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { EventBus } from '@/utils/eventBus';

@Component
export default class LostWindow extends Vue {
  @Prop() private game!: string;

  handleHomeClicked() {
    this.$emit('routeChange', 'main-menu');
    // play button music
    EventBus.$emit('playAudio', 'btn');
  }

  handleRestartClicked() {
    this.$emit('restartGame');
    // play button music
    EventBus.$emit('playAudio', 'btn');
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

.lost_wrap
  position fixed
  top 70%
  left 50%
  transform translate(-50%, 0%)
  width 70vw
  height max-content
  border-radius 10px
  padding 20px
  .lost_window_showing_before
    opacity 0
  .lost_window_showing
    animation zoomInWithOffset 0.5s forwards
    animation-delay 1s

  .lost_title
    font-size 30px
    text-align center
    color #fff
    margin-bottom 20px
  .lost_buttons_wrap
    display flex
    justify-content space-around
    .lost_button
      width 100px
      height 40px
      line-height 40px
      border-radius 10px
      background-color #ffffff44
      color #fff
      text-align center
      cursor pointer
      &:hover
        background-color #ffffff22

</style>
