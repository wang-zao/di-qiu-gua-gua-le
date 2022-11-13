<template>
  <div class="about_window_wrapper">
    <div class="about_window_mask" @click="hideAboutWindow" />
    <div class="about_window_body">
      <div class="about_window_content">
        <div class="about_window_content_item">
          <div class="about_window_content_item_title">
            <icon class="btm_icon_body" iconSrc="./svg/share.svg" size="25"/>
          </div>
          <div class="about_window_content_item_content" @click="copyUrlToPasteBoard(urls.share)">
            <div class="url_content">{{urls.share}}</div>
            <icon class="btm_icon_body" iconSrc="./svg/copy.svg" size="20"/>
            
          </div>
        </div>
        <div class="about_window_content_item">
          <div class="about_window_content_item_title">
            <icon class="btm_icon_body" iconSrc="./svg/github.svg" size="25"/>
          </div>
          <div class="about_window_content_item_content" @click="copyUrlToPasteBoard(urls.github)">
            <div class="url_content">{{urls.github}}</div>
            <icon class="btm_icon_body" iconSrc="./svg/copy.svg" size="20"/>
              
          </div>
        </div>
      </div>
      <div class="back_button" @click="hideAboutWindow">返回</div>
    </div>
    <notification
      ref="notification"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Icon from './Icon.vue';
import Notification from './Notification.vue';

@Component({
  components: {
    Icon,
    Notification,
  },
})
export default class AboutWindow extends Vue {
  @Prop() private msg!: string;
  urls = {
    github: 'https://github.com/wang-zao/di-qiu-gua-gua-le',
    share: 'https://zao-lab.com/#/di-qiu-gua-gua-le',
  }

  hideAboutWindow() {
    this.$emit('hideAboutWindow');
  }

  copyUrlToPasteBoard(url: string) {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', url);
    document.body.appendChild(input);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      (this.$refs.notification as any).showNotification(`已复制到剪贴板`);
    }
    document.body.removeChild(input);
  }
}
</script>

<style scoped lang="stylus">

.about_window_body
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  background #fff
  width 40vw
  height fit-content
  border-radius 15px
  border 2px solid #000
  padding 20px
  z-index 2
  .about_window_content_item
    margin-bottom 20px
    display flex
    justify-content center
    align-items center
    .about_window_content_item_title
      font-size 16px
      margin-right 10px
    .about_window_content_item_content
      font-size 14px
      padding 5px 10px
      width 80%
      border-radius 15px
      background #eee
      display flex
      justify-content space-between
      cursor pointer
      &:hover
        background #ddd
      .url_content
        word-break break-all
        text-align left
  .back_button
    margin-left 50%
    transform translateX(-50%)
    width 100px
    margin-top 20px
    height 40px
    line-height 40px
    text-align center
    border-radius 15px
    background-color #eee
    color #000
    cursor pointer
    &:hover
      background-color #ddd
  
.about_window_mask
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  background rgba(0, 0, 0, 0.3)
  z-index 1

</style>
