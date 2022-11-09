<template>
  <div class="audio_wrapper">
    <audio class="audio_game_over" hidden src="@/assets/audios/game_over.mp3" ref="audio_game_over"></audio>
    <audio class="audio_game_win" hidden src="@/assets/audios/game_win.mp3" ref="audio_game_win"></audio>
    <audio class="audio_select_correct" hidden src="@/assets/audios/select_correct.mp3" ref="audio_select_correct"></audio>
    <audio class="audio_select_wrong" hidden src="@/assets/audios/select_wrong.mp3" ref="audio_select_wrong"></audio>
    <audio class="audio_btn" hidden src="@/assets/audios/btn.mp3" ref="audio_btn"></audio>
    <audio class="audio_fly" hidden src="@/assets/audios/fly.mp3" ref="audio_fly"></audio>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { EventBus } from '@/utils/eventBus';

@Component
export default class MusicPlayer extends Vue {
  isBackgroundMusicPlaying: boolean = false;

  mounted() {
    this.adjustVolume();
    this.watchAllAudios();
  }

  adjustVolume() {
    const audio_game_over = this.$refs.audio_game_over as HTMLAudioElement;
    const audio_game_win = this.$refs.audio_game_win as HTMLAudioElement;
    const audio_select_correct = this.$refs.audio_select_correct as HTMLAudioElement;
    const audio_select_wrong = this.$refs.audio_select_wrong as HTMLAudioElement;
    const audio_btn = this.$refs.audio_btn as HTMLAudioElement;
    const audio_fly = this.$refs.audio_fly as HTMLAudioElement;


    audio_game_over.volume = 0.5;
    audio_game_win.volume = 0.5;
    audio_select_correct.volume = 0.3;
    audio_select_wrong.volume = 1;
    audio_btn.volume = 0.3;
    audio_fly.volume = 0.7;
  }

  watchAllAudios() {
    EventBus.$on('playAudio', (audioName: string) => {
      const audio = this.$refs[`audio_${audioName}`] as HTMLAudioElement;
      console.log('get refs here', this.$refs)
      console.log('get audioName here', audioName)
      console.log('get audio here', audio)
      audio.currentTime = 0;
      audio.play();
    });
  }
}
</script>

<style scoped lang="stylus">
</style>
