import { Scene } from 'phaser';
import { Color } from '../exports/color';
import { CENTER_X, CENTER_Y, HALF_HEIGHT, HALF_WIDTH } from '../exports/constants';

class ScoreScene extends Scene {
  private selector: Phaser.GameObjects.Image;
  private restart: boolean;

  constructor() {
    super('score-scene');
  }

  public init(): void {
    this.restart = true;
  }

  public preload(): void {
    this.load.image('selector', 'assets/images/selector.png');
    this.load.audio('switch', 'assets/sounds/switch.wav');
  }

  public create(data: any): void {
    this.add.rectangle(CENTER_X, CENTER_Y, HALF_WIDTH + 7, HALF_HEIGHT + 8, Color.Dark);
    this.add.rectangle(CENTER_X, CENTER_Y, HALF_WIDTH + 5, HALF_HEIGHT + 6, Color.Light);
    this.add.text(CENTER_X, CENTER_Y - 14, `Score: ${data.score}`, {fontFamily: 'nokia-font', fontSize: '16px', color: '#43523d'}).setOrigin(0.5).setResolution(3);
    this.add.text(CENTER_X, CENTER_Y - 7, `Best: ${localStorage.getItem('best') ?? data.score}`, {fontFamily: 'nokia-font', fontSize: '16px', color: '#43523d'}).setOrigin(0.5).setResolution(3);
    this.add.text(CENTER_X, CENTER_Y + 2, 'Restart', {fontFamily: 'nokia-font', fontSize: '16px', color: '#43523d'}).setOrigin(0.5).setResolution(3);
    this.add.text(CENTER_X, CENTER_Y + 9, 'Quit', {fontFamily: 'nokia-font', fontSize: '16px', color: '#43523d'}).setOrigin(0.5).setResolution(3);

    this.selector = this.add.image(CENTER_X - 19, CENTER_Y + 2, 'selector').setOrigin(0);

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).on('down', () => this.toggleOption());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).on('down', () => this.toggleOption());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.selectOption());
  }

  private toggleOption(): void {
    this.sound.play('switch');
    this.restart = !this.restart;

    if (this.restart) {
      this.selector.setPosition(CENTER_X - 19, CENTER_Y + 2);
    } else {
      this.selector.setPosition(CENTER_X - 13, CENTER_Y + 9);
    }
  }

  private selectOption(): void {
    if (this.restart) {
      this.restartGame();
    } else {
      this.quitGame();
    }
  }

  private restartGame(): void {
    this.scene.get('game-scene').input.keyboard.removeAllKeys();
    this.scene.stop('game-scene');
    this.input.keyboard.removeAllKeys();
    this.scene.start('game-scene');
  }

  private quitGame(): void {
    this.scene.get('game-scene').input.keyboard.removeAllKeys();
    this.scene.stop('game-scene');
    this.input.keyboard.removeAllKeys();
    this.scene.start('menu-scene');
  }
}
export default ScoreScene;
