import QuestionPad from './questionPad';
import { EventBus } from './eventBus';

type GameConfig = {
  cityData: any[];
  blood: number;
}

class Game {
  cityData: any[];
  usedTime: number;
  blood: number;
  currentCity: any;
  questionPad: QuestionPad;

  constructor(config: GameConfig) {
    this.usedTime = 0;
    const {
      cityData,
      blood,
    } = config;
    this.cityData = cityData;
    this.blood = blood;
    this.currentCity = null;
    this.questionPad = new QuestionPad({
      removingTime: 300,
      addingTime: 300,
      gapTime: 100,
      answerDisplayTime: 600,
    });
  }

  play() {
    this.currentCity = this.getNextCurrentCityCandidate();
    this.questionPad.addOneQuestion(this.currentCity);
  }

  selectAnswer(answer: string) {
    this.questionPad.allowClicking = false;
    this.judgeAnswer(answer);
  }

  judgeAnswer(answer: string) {
    if (answer === this.currentCity.name_chn) {
      this.ifAnswerCorrect();
    } else {
      this.ifAnswerWrong();
    }
  }

  ifAnswerCorrect() {
    // 1.display answer on the pad
    this.questionPad.displayAnswer();
    // 2.scratch off of the correspond city
    EventBus.$emit('scratchOff', this.currentCity.id);
    // 3.check if win
    if (this.checkIfWin()) {
      this.gameWin();
    } else {
      // 4.if not win, add a new question
      this.updateCurrentCity();
    }
  }

  ifAnswerWrong() {
    // 1.display answer on the pad
    this.questionPad.displayAnswer();
    // 2.blood - 1
    this.blood -= 1;
    // 3.scratch down
    EventBus.$emit('scratchDown', this.currentCity.id);
    // 4.check if game over
    if (this.checkIfLost()) {
      this.gameOver();
    } else {
      // 5.if not game over, push current city back to the dataQueue.
      this.cityData.push(this.currentCity);
      // 6.if not game over, add a new question
      this.updateCurrentCity();
    }
  }

  async updateCurrentCity() {
    // 1. get nextCurrentCityCandidate
    const nextCurrentCity = this.getNextCurrentCityCandidate();
    await this.questionPad.displayAnswer();
    this.questionPad.removeAndAddQuestion(nextCurrentCity);
    this.currentCity = nextCurrentCity;

  }

  getNextCurrentCityCandidate() {
    const nextCurrentCityCandidate = this.cityData.shift();
    return nextCurrentCityCandidate;
  }

  checkIfWin() {
    return this.cityData.length === 0;
  }

  checkIfLost() {
    return this.blood === 0;
  }

  gameOver() {

  }

  gameWin() {

  }


}

export default Game;