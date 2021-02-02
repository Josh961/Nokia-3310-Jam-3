import Phaser, { Game } from 'phaser';
import { Color } from './exports/color';
import { GAME_HEIGHT, GAME_WIDTH } from './exports/constants';
import GameScene from './scenes/game-scene';
import MenuScene from './scenes/menu-scene';
import PauseScene from './scenes/pause-scene';
import './styles/main.css';
import './styles/normalize.css';

export const config: any = {
  type: Phaser.WEBGL,
  canvas: document.getElementById('canvas'),
  parent: document.getElementById('canvas-wrapper'),
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  backgroundColor: Color.Dark,
  scene: [
    MenuScene,
    GameScene,
    PauseScene
  ]
};

const game = new Game(config);
