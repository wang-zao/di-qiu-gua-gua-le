<template>
  <div class="hello">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class LostWindow extends Vue {
  @Prop() private msg!: string;
}
</script>

<style scoped lang="stylus">
</style>
