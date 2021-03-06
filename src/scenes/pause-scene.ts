import { Scene } from 'phaser';
import { Color } from '../exports/color';
import { CENTER_X, CENTER_Y, HALF_HEIGHT, HALF_WIDTH } from '../exports/constants';

class PauseScene extends Scene {
  private selector: Phaser.GameObjects.Image;
  private resume: boolean;

  constructor() {
    super('pause-scene');
  }

  public init(): void {
    this.resume = true;
  }

  public preload(): void {
    this.load.image('selector', 'assets/images/selector.png');
    this.load.audio('switch', 'assets/sounds/switch.wav');
  }

  public create(): void {
    this.add.rectangle(CENTER_X, CENTER_Y, HALF_WIDTH + 7, HALF_HEIGHT + 8, Color.Dark);
    this.add.rectangle(CENTER_X, CENTER_Y, HALF_WIDTH + 5, HALF_HEIGHT + 6, Color.Light);
    this.add.text(CENTER_X, CENTER_Y - 12, 'Paused', {fontFamily: 'nokia-font', fontSize: '16px', color: '#43523d'}).setOrigin(0.5).setResolution(3);
    this.add.text(CENTER_X, CENTER_Y + 1, 'Resume', {fontFamily: 'nokia-font', fontSize: '16px', color: '#43523d'}).setOrigin(0.5).setResolution(3);
    this.add.text(CENTER_X, CENTER_Y + 8, 'Quit', {fontFamily: 'nokia-font', fontSize: '16px', color: '#43523d'}).setOrigin(0.5).setResolution(3);

    this.selector = this.add.image(CENTER_X - 20, CENTER_Y + 1, 'selector').setOrigin(0);

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).on('down', () => this.toggleOption());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).on('down', () => this.toggleOption());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.selectOption());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => this.resumeGame());
  }

  private toggleOption(): void {
    this.sound.play('switch');
    this.resume = !this.resume;

    if (this.resume) {
      this.selector.setPosition(CENTER_X - 20, CENTER_Y + 1);
    } else {
      this.selector.setPosition(CENTER_X - 13, CENTER_Y + 8);
    }
  }

  private selectOption(): void {
    if (this.resume) {
      this.resumeGame();
    } else {
      this.quitGame();
    }
  }

  private resumeGame(): void {
    this.input.keyboard.removeAllKeys();
    this.scene.stop();
    this.scene.resume('game-scene');
  }

  private quitGame(): void {
    this.scene.get('game-scene').input.keyboard.removeAllKeys();
    this.scene.stop('game-scene');
    this.input.keyboard.removeAllKeys();
    this.scene.start('menu-scene');
  }
}
export default PauseScene;
