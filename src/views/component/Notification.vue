<template>
  <div class="notification_wrap" 
  :class="{
    'notification_show': displaying,
    'notification_hide': hiding,
  }">
    <div class="notification"
    >
      <div class="notification_content">{{ msg }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Notification extends Vue {
  msg: string = '';
  displaying: boolean = false;
  hiding: boolean = false;

  showNotification(msg: string) {
    this.msg = msg;
    this.displaying = true;
    setTimeout(() => {
      this.displaying = false;
      this.hiding = true;
      setTimeout(() => {
        this.hiding = false;
      }, 500);
    }, 2000);
  }


}
</script>

<style scoped lang="stylus">

@keyframes fadeInDown
  0%
    opacity 0
    transform translate(-50%, -100%)
  100%
    opacity 1 
    transform translate(-50%, 0)

@keyframes fadeOutUp
  0%
    opacity 1
    transform translate(-50%, 0)
  100%
    opacity 0
    transform translate(-50%, -100%)

.notification_wrap
  background #fff
  color #000
  position fixed
  top 60px
  left 50%
  width max-content
  height 40px
  z-index 100
  border-radius 15px
  line-height 40px
  padding 0 20px
  text-align center
  opacity 0
  transform translateX(-50%)
.notification_show
  animation fadeInDown 0.3s forwards
.notification_hide
  animation fadeOutUp 0.3s forwards


</style>
