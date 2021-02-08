import { Scene } from 'phaser';

class MenuScene extends Scene {
  private selector: Phaser.GameObjects.Image;
  private soundIcon: Phaser.GameObjects.Image;
  private start: boolean;
  private muted: boolean;

  constructor() {
    super('menu-scene');
  }

  public init(): void {
    this.start = true;
    this.muted = this.game.sound.mute;
  }

  public preload(): void {
    this.load.image('title', 'assets/images/title.png');
    this.load.image('selector', 'assets/images/selector.png');
    this.load.image('sound-on', 'assets/images/sound-on.png');
    this.load.image('sound-off', 'assets/images/sound-off.png');
    this.load.audio('switch', 'assets/sounds/switch.wav');
  }

  public create(): void {
    this.add.image(0, 0, 'title').setOrigin(0);

    // Prevents font from being expanded on first load
    this.add.text(0, 0, '', {fontFamily: 'nokia-font', fontSize: '1px'});

    this.selector = this.add.image(7, 15, 'selector').setOrigin(0);
    this.soundIcon = this.add.image(36, 25, !this.game.sound.mute ? 'sound-on' : 'sound-off');

    this.game.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).on('down', () => this.toggleOption());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).on('down', () => this.toggleOption());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.selectOption());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.selectOption());
  }

  private toggleOption(): void {
    this.sound.play('switch');
    this.start = !this.start;

    if (this.start) {
      this.selector.setPosition(7, 15);
    } else {
      this.selector.setPosition(7, 22);
    }
  }

  private selectOption(): void {
    if (this.start) {
      this.startGame();
    } else {
      this.toggleSound();
    }
  }

  private startGame(): void {
    this.input.keyboard.removeAllKeys();
    this.scene.start('game-scene');
  }

  private toggleSound(): void {
    if (this.muted) {
      this.game.sound.mute = false;
      this.sound.play('switch');
      this.soundIcon.setTexture('sound-on');
    } else {
      this.game.sound.mute = true;
      this.soundIcon.setTexture('sound-off');
    }
    this.muted = !this.muted;
  }
}
export default MenuScene;
