import { Confetto } from './confetti';

export class ConfettiRenderer {
  timer: any = undefined;
  frame: any = undefined;
  confetti: any = [];
  pointer = 0;
  particles = 10;
  spread = 120;
  // Create the overarching container
  container: HTMLDivElement = {} as HTMLDivElement;

  colorThemes: any[] = [
    () => {
      return [
        '#ff5252',
        '#ffa852',
        '#ffff52',
        '#a8ff52',
        '#52ff52',
        '#52ffa8',
        '#52ffff',
        '#52a8ff',
        '#5252ff',
        '#a852ff',
      ][(Math.random() * 10) | 0];
    },
  ];

  constructor() {
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top      = '0';
    this.container.style.left     = '0';
    this.container.style.width    = '100%';
    this.container.style.height   = '0';
    this.container.style.overflow = 'visible';
    this.container.style.zIndex   = '9999';
  }

  render() {
    const that = this;
    if (!this.frame) {
      // Append the container
      document.body.appendChild(this.container);

      // Add confetti
      let theme = this.colorThemes[0];
      (function addConfetto() {

        let confetto = new Confetto(theme);
        that.confetti.push(confetto);
        that.container.appendChild(confetto.outer);
        that.timer = setTimeout(addConfetto, that.spread * Math.random());
      // })(0);
      })();

      // Start the loop
      let prev: any;
      requestAnimationFrame(function loop(timestamp) {
        let delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        let height = (window as any).innerHeight;

        for (let i = that.confetti.length - 1; i >= 0; --i) {
          if (that.confetti[i].update(height, delta)) {
            that.container.removeChild(that.confetti[i].outer);
            that.confetti.splice(i, 1);
          }
        }
        if (that.timer || that.confetti.length) {
          return that.frame = requestAnimationFrame(loop);
        }
        // Cleanup
        document.body.removeChild(that.container);
        that.frame = undefined;
      });
    }
  }

  destroy() {
    clearTimeout(this.timer);
    this.timer = undefined;
    this.confetti = [];
    this.frame = undefined;
  }
}
