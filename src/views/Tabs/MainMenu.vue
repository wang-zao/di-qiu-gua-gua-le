<template>
  <div class="main_wrapper">
    <div class="title_wrapper">
      <div class="tittle_letter"
        v-for="value, key in titleTextList"
        :key="key"
        :style="getLetterStyle(key)"
      >
        {{value}}
      </div>
    </div>
    <div class="btn_wrapper">
      <div class="btn" @click="goToPlaying">开始刮刮</div>
      <div class="btn_rank" @click="goToRank">排行</div>
    </div>
    <div class="btm_icon"  @click="showAboutWindow = true">
      <icon class="btm_icon_body" iconSrc="./svg/about.svg" size="20"/>
      <div class="btm_icon_text">关于</div>
    </div>
    <about-window
      v-if="showAboutWindow"
      @hideAboutWindow="showAboutWindow = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { EventBus } from '@/utils/eventBus';
import Icon from '@/views/component/Icon.vue';
import AboutWindow from '@/views/component/AboutWindow.vue';

@Component({
  components: {
    Icon,
    AboutWindow,
  }
})
export default class MainMenu extends Vue {
  @Prop() private msg!: string;
  showAboutWindow = false;
  title = '地球刮刮乐';
  letterColorList = [
    '#3b3b3b',
    '#0a4c89',
    '#5d8e61',
    '#a68c76',
    '#09508f',
  ]

  get titleTextList() {
    return this.title.split('');
  }


  getLetterStyle(key: number) {
    const color = this.letterColorList[key % this.letterColorList.length];
    return `background: ${color}`
  }

  goToPlaying() {
    this.$emit('routeChange', 'playing');
    // play button music
    EventBus.$emit('playAudio', 'btn');
  }

  goToRank() {
    this.$emit('routeChange', 'rank');
    // play button music
    EventBus.$emit('playAudio', 'btn');
  }
}
</script>

<style scoped lang="stylus">

.title_wrapper
  user-select none
  position fixed
  left 5vh
  top 5vh
  font-size 1.5rem
  color #fff
  display flex
  .tittle_letter
    width 2.3rem
    height 2.3rem
    line-height 2.3rem
    margin 0 5px
    display flex
    justify-content center
    align-items center
    border-radius 50%
    box-shadow 0 0 0 2px #ffffff88
    transition all 0.3s ease-in-out
    &:hover
      background #ffffff !important
      color #888 !important
  

.btn_wrapper
  user-select none
  position fixed
  left 50%
  transform translate(-50%, 0)
  bottom 10vh
  margin auto
  display flex
  justify-content center
  flex-direction column
  .btn
    padding 10px 20px
    border-radius 15px
    border 2px solid #000
    font-size 1.2rem
    color #000
    background #fff
    cursor pointer
    margin 10px
    white-space nowrap
    &:hover
      background #eee
    &:active
      background #000
      color #fff
  .btn_rank
    color #fff
    white-space nowrap
    cursor pointer
    font-size 1rem
    padding 5px 20px

.btm_icon
  position fixed
  bottom 40px
  right 40px
  font-size 12px
  display flex
  align-items top
  cursor pointer
  padding 20px 0 0 20px
  .btm_icon_text
    margin 2.5px 0 0 3px
    color #fff

</style>
