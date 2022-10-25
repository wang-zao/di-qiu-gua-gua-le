<template>
  <div class="confetti_wrap">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import { renderConfetti } from '@/utils/confetti';
import { ConfettiRenderer } from '@/utils/confettiRenderer';


@Component
export default class Confetti extends Vue {
  @Prop() private msg!: string;
  renderer: ConfettiRenderer = {} as ConfettiRenderer;

  mounted() {
    this.renderConfetti();
  }

  renderConfetti() {
    this.renderer = new ConfettiRenderer();
    this.renderer.render();
  }

  beforeDestroy() {
    this.renderer.destroy();
  }
}
</script>

<style scoped lang="stylus">
</style>
