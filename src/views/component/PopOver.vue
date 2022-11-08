<template>
  <div class="pop_over_wrap">
    <div class="pop_over_body"
      :class="{
        'pop_over_body_smaller': text.length < 10,
      }"
      v-show="showingPopOver"
    >{{ text }}</div>
    <div class="pop_over_arrow"
      v-show="showingPopOver"
    ></div>
    <div class="pop_over_content"
      @mouseover="handleHover"
      @mouseout="handleLeave"
    >{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PopOver extends Vue {
  @Prop() private text!: string;
  showingPopOver: boolean = false;

  showPopOver() {
    this.showingPopOver = true;
  }

  hidePopOver() {
    this.showingPopOver = false;
  }

  handleHover() {
    this.showPopOver();
  }

  handleLeave() {
    this.hidePopOver();
  }
}
</script>

<style scoped lang="stylus">

.pop_over_wrap
  position relative
  text-align left
  width 100%
  height 100%
  .pop_over_body
    position fixed
    padding 10px 10px
    transform translate(0, -100%)
    width fit-content
    width 144px
    height min-content
    background-color #fff
    z-index 3
    border-radius 15px
    font-size 12px
    white-space pre-wrap
    box-sizing border-box
  .pop_over_body_smaller
    width auto
  .pop_over_arrow
    position absolute
    top 5px
    left 15px
    transform translate(-50%, -100%)
    width 0
    height 0
    border-left 10px solid transparent
    border-right 10px solid transparent
    border-top 10px solid #fff
    z-index 3
  .pop_over_content
    width 100%
    height min-content
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  
</style>
