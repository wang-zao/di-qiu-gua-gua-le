<template>
  <div class="question_pad_wrap">
    <div class="question"
      :class="{
        'options_wrap_displaying': questionPad.displayingCurrent,
        'question_removing': questionPad.removingCurrent,
        'question_adding': questionPad.addingCurrent,
      }"
    >{{ slicedAbstract }}</div>
    <div class="options_wrap"
      :class="{
        'options_wrap_displaying': questionPad.displayingCurrent,
        'options_wrap_removing': questionPad.removingCurrent,
        'options_wrap_adding': questionPad.addingCurrent,
      }"
    >
      <div class="option_item"
        :class="{
          'option_item_wrong': questionPad.displayingAnswerColor && idx === clickedIdx && !(option === correctAnswer),
          'option_item_correct': questionPad.displayingAnswerColor && option === correctAnswer,
        }"
        v-for="(option, idx) in options"
        :key="idx"
        @click="handleOptionClick(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Game from '@/utils/game';

@Component
export default class QuestionPad extends Vue {
  @Prop() private game!: Game;
  clickedIdx: number = -1;

  get questionPad() {
    return this.game.questionPad;
  }
  
  get options() {
    try {
      return this.game.questionPad.questionList[0].options
        .sort(() => Math.random() - 0.5);
    } catch (e) {
      return [];
    }
  }

  get correctAnswer() {
    try {
      return this.game.questionPad.questionList[0].name_chn;
    } catch (e) {
      return '';
    }
  }

  get slicedAbstract() {
    try {
      const cityName = this.game.questionPad.questionList[0].name_chn;
      const sentences = this.game.questionPad.questionList[0].abs_chn.split('。');
      const selectedSentence = sentences[Math.floor(Math.random() * (sentences.length - 1))];
      console.log('sentences', sentences);
      console.log('selectedSentence', selectedSentence);
      const otherWords = selectedSentence.split(cityName)
      if (otherWords.length === 1) {
        return `${'__'.repeat(cityName.length)}这座城市，${selectedSentence}。`;
      } else {
        return otherWords.join('__'.repeat(cityName.length)) + '。';
      }
    } catch (e) {
      return '';
    }
  }

  get allowClicking() {
    return this.game.questionPad.allowClicking;
  }

  mounted() {
    console.log('game', this.game);
  }

  handleOptionClick(option: string) {
    if (!this.allowClicking) {
      return;
    }
    console.log('option', option);
    this.clickedIdx = this.options.indexOf(option);
    this.game.selectAnswer(option);
  } 
}
</script>

<style scoped lang="stylus">
$universal-border-radius = 20px;

@keyframes fadeIn
  from
    opacity 0
    transform translateX(20px)
  to
    opacity 1
    transform translateX(0)

@keyframes fadeOut
  from
    opacity 1
    transform translateX(0)
  to
    opacity 0
    transform translateX(-20px)

.question_pad_wrap
  // color #fff
  color #000
  background #ffffff99
  height 30vh
  width 70vw
  display flex
  flex-direction column
  justify-content space-between
  align-items center
  padding 20px 20px 10px
  border-radius $universal-border-radius
  .question
    text-align left
    justify-self start
    background #ffffff
    border-radius $universal-border-radius
    padding 10px 20px
    max-height 35%
    overflow-y scroll
    font-size 1rem
    line-height 1.5rem
    opacity 0
    width 100%
    box-sizing border-box
  .question_displaying
    opacity 1
  .question_removing
    animation fadeOut 0.5s ease-in-out forwards
  .question_adding
    animation fadeIn 0.5s ease-in-out forwards
  .options_wrap
    display flex
    flex-wrap wrap
    justify-content space-between
    align-items center
    width 100%
    height 60%
    opacity 0
    .option_item
      cursor pointer
      width 45%
      height 30%
      display flex
      border-radius $universal-border-radius
      justify-content center
      align-items center
      background #ffffff
      border 2px solid #000
      font-size 1.2rem
    .option_item_wrong
      background #ff0000
    .option_item_correct
      background #00ff00
  .options_wrap_displaying
    opacity 1
  .options_wrap_removing
    // time here should be same as removingTime in QuestionPad.ts
    animation fadeOut 0.3s ease-in-out forwards
  .options_wrap_adding
    // time here should be same as addingTime in QuestionPad.ts
    animation fadeIn 0.3s ease-in-out forwards



</style>
