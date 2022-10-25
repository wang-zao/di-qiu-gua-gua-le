import { EventBus } from './eventBus';

type QuestionPadConfig = {
  removingTime: number;
  addingTime: number;
  gapTime: number;
  answerDisplayTime: number;
}

class QuestionPad {
  // questionList should always be kept with length of 1
  questionList: any[];
  addingCurrent: boolean;
  removingCurrent: boolean;
  displayingCurrent: boolean;
  displayingAnswerColor: boolean;
  displayingWinWindow: boolean;
  displayingLostWindow: boolean;
  displayingAddToRankingWindow: boolean;
  displayingConfetti: boolean;
  allowClicking: boolean;
  config: QuestionPadConfig;

  constructor(config: QuestionPadConfig) {
    this.config = config;
    this.questionList = [];
    this.addingCurrent = false;
    this.removingCurrent = false;
    this.displayingCurrent = false;
    this.displayingAnswerColor = false;
    this.displayingWinWindow = true;
    this.displayingLostWindow = false;
    this.displayingConfetti = true;
    this.displayingAddToRankingWindow = false;
    this.allowClicking = false;
  }

  async addOneQuestion(question: any) {
    this.addingCurrent = true;
    this.questionList.push(question);
    EventBus.$emit('scratchUp', question.id);
    EventBus.$emit('flyTo', question);
    await new Promise<void>((resolve) => setTimeout(() => {
      this.addingCurrent = false;
      this.displayingCurrent = true;
      this.allowClicking = true;
      resolve();
    }, this.config.addingTime));
  }

  async removeOneQuestion() {
    this.removingCurrent = true;
    await new Promise<void>((resolve) => setTimeout(() => {
      this.questionList.pop();
      this.removingCurrent = false;
      this.displayingCurrent = false;
      resolve();
    }, this.config.removingTime));
  }

  async removeAndAddQuestion(question: any) {
    await this.removeOneQuestion();
    await new Promise<void>((resolve) => setTimeout(async () => {
      await this.addOneQuestion(question);
      resolve();
    }, this.config.gapTime));
  }

  async displayAnswer() {
    this.displayingAnswerColor = true;
    await new Promise<void>((resolve) => setTimeout(() => {
      this.displayingAnswerColor = false;
      resolve();
    }, this.config.answerDisplayTime));
  }

  changeLostWindowDisplay(display: boolean) {
    this.displayingLostWindow = display;
  }

  changeWinWindowDisplay(display: boolean) {
    this.displayingWinWindow = display;
  }

  changeDisplayAddToRankingWindow(display: boolean) {
    this.displayingAddToRankingWindow = display;
  }

  displayLostCities(lostCities: any[]) {
    // EventBus.$emit('displayLostCities', lostCities);
  }
}

export default QuestionPad;