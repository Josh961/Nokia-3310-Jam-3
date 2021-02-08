import { Scene } from 'phaser';
import { Color } from '../exports/color';
import { GAME_HEIGHT, GAME_WIDTH, HALF_HEIGHT } from '../exports/constants';

class GameScene extends Scene {
  private MAX_WALL_VELOCITY = -150;
  private MAX_COLLISIONS = 1;
  private leftBounds: Phaser.GameObjects.Rectangle;
  private walls: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
  private farthestWall: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private characterOnBottom: boolean;
  private wallVelocity: number;
  private score: number;
  private collisions: number;

  constructor() {
    super('game-scene');
  }

  public init(): void {
    this.walls = [];
    this.farthestWall = undefined;
    this.characterOnBottom = true;
    this.wallVelocity = -40;
    this.score = 0;
    this.collisions = 0;
  }

  public preload(): void {
    this.load.spritesheet('character', 'assets/sprites/character.png', {frameWidth: 5, frameHeight: 5});
    this.load.spritesheet('wall', 'assets/sprites/wall.png', {frameWidth: 8, frameHeight: 24});
    this.load.audio('switch', 'assets/sounds/switch.wav');
    this.load.audio('collision', 'assets/sounds/collision.wav');
  }

  public create(): void {
    this.createControls();
    this.createBorders();
    this.createAnimations();
    this.createCharacter();
    this.createLeftBounds();
  }

  private createControls(): void {
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
      this.sound.play('switch');
      if (this.characterOnBottom) {
        this.character.setY(1);
      } else {
        this.character.setY(GAME_HEIGHT - 6);
      }
      this.character.toggleFlipY();
      this.characterOnBottom = !this.characterOnBottom;
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => this.pauseGame());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.pauseGame());
  }

  private pauseGame(): void {
    this.scene.pause();
    this.input.keyboard.resetKeys();
    this.scene.launch('pause-scene');
  }

  private createBorders(): void {
    this.add.rectangle(0, 0, GAME_WIDTH, 1, Color.Dark).setOrigin(0);
    this.add.rectangle(0, GAME_HEIGHT - 1, GAME_WIDTH, 2, Color.Dark).setOrigin(0);
  }

  private createAnimations(): void {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('character', {start: 0, end: 1}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'wall-collapse',
      frames: this.anims.generateFrameNumbers('wall', {start: 1, end: 4}),
      frameRate: 10,
      repeat: 0
    });
  }

  private createCharacter(): void {
    this.character = this.physics.add.sprite(4, GAME_HEIGHT - 6, 'character').setOrigin(0);
    this.character.body.setSize(4);
    this.character.setImmovable(true);
    this.character.anims.play('run');
  }

  private createLeftBounds(): void {
    this.leftBounds = this.add.rectangle(-3, 0, 1, GAME_HEIGHT, Color.Dark).setOrigin(0);
    this.physics.add.existing(this.leftBounds);
    (this.leftBounds.body as Phaser.Physics.Arcade.Body).immovable = true;
  }

  public update(): void {
    if (!this.farthestWall) {
      this.createWall();
    } else if (this.farthestWall.x < (GAME_WIDTH * 0.6)) {
      this.createWall();
    }
  }

  private createWall(): void {
    let wall: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    if (this.characterOnBottom) {
      wall = this.physics.add.sprite(GAME_WIDTH, Math.random() >= 0.4 ? GAME_HEIGHT - HALF_HEIGHT : 0, 'wall').setOrigin(0);
    } else {
      wall = this.physics.add.sprite(GAME_WIDTH, Math.random() >= 0.4 ? 0 : GAME_HEIGHT - HALF_HEIGHT, 'wall').setOrigin(0);
    }

    if (wall.y === 0) {
      wall.toggleFlipY();
    }

    wall.body.setSize(2);
    wall.body.velocity.x = this.wallVelocity;
    this.walls.push(wall);
    this.farthestWall = wall;

    this.physics.add.collider(wall, this.leftBounds, () => {
      if (this.wallVelocity >= this.MAX_WALL_VELOCITY) { this.wallVelocity -= 1; }
      this.score++;
      this.walls.shift();
      wall.destroy();
    });

    this.physics.add.collider(wall, this.character, () => {
      this.collisions++;
      if (this.collisions <= this.MAX_COLLISIONS) {
        this.sound.stopAll();
        this.freezeGame();
        this.sound.play('collision');
        this.anims.play('wall-collapse', wall);
        wall.on('animationcomplete', () => this.gameOver());
      }
    });
  }

  private freezeGame(): void {
    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.character.setActive(false);
    for (const wall of this.walls) {
      wall.setVelocity(0);
    }
  }

  private gameOver(): void {
    this.scene.pause();
    if (localStorage.getItem('best') && this.score > +localStorage.getItem('best')) {
      localStorage.setItem('best', this.score.toString());
    } else if (!localStorage.getItem('best')) {
      localStorage.setItem('best', this.score.toString());
    }
    this.scene.launch('score-scene', {score: this.score});
  }
}
export default GameScene;
