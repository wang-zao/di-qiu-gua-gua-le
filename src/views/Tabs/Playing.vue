<template>
  <div class="hello">
    <div>playing</div>
    <div
      @click="emitRouteChange('main-menu')"
    >go back</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  emitRouteChange(route: string) {
    this.$emit('routeChange', route);
  }
}
</script>

<style scoped lang="stylus">
</style>
