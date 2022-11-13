<template>
  <div class="icon_wrap">
    <img
      class="icon_img"
      :style="iconStyle"
      :src="iconSrc"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Icon extends Vue {
  @Prop() private iconSrc!: string;
  @Prop() private size!: string;

  get iconStyle() {
    return `width: ${this.size}px; height: ${this.size}px;`;
  }

}
</script>

<style scoped lang="stylus">
</style>
