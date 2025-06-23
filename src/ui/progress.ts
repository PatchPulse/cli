import chalk from 'chalk';

export class ProgressSpinner {
  private interval: ReturnType<typeof setInterval> | null = null;
  private currentIndex = 0;
  private readonly spinners = [
    '⠋',
    '⠙',
    '⠹',
    '⠸',
    '⠼',
    '⠴',
    '⠦',
    '⠧',
    '⠇',
    '⠏',
  ];
  private message = '';

  start(message: string): void {
    this.message = message;
    this.currentIndex = 0;
    this.interval = setInterval(() => {
      process.stdout.write(
        `\r${chalk.cyan(this.spinners[this.currentIndex])} ${this.message}`
      );
      this.currentIndex = (this.currentIndex + 1) % this.spinners.length;
    }, 80);
  }

  updateMessage(message: string): void {
    this.message = message;
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
  }
}
