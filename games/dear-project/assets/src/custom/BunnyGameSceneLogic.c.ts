import Scene from 'thing-editor/src/engine/lib/assets/src/basic/scene.c';
import { GAME_CONFIG } from './game-config';
import game from 'thing-editor/src/engine/game';

export default class BunnyGameSceneLogic extends Scene {

	public score: number = 0;
	private scoreText: any = null;
	private gameOverText: any = null;

	init() {
		super.init();
		console.log('logic init');
		//`	this.width = game.W;
		//	this.height = game.H;
		this.score = GAME_CONFIG.SCENE.INITIAL_SCORE;
		this.scoreText = this.findChildByName('counterText');
		this.gameOverText = this.findChildByName('GameOverText');
		if (this.gameOverText && this.gameOverText.text) {
		}
		this.updateScoreDisplay();
	}

	public increaseScore() {
		this.score++;
		this.updateScoreDisplay();
	}

	private updateScoreDisplay() {
		if (this.scoreText) {
			this.scoreText.text = `${this.score}`;
		}
	}

	update() {
		if (this.gameOverText.alpha == GAME_CONFIG.SCENE.GAME_OVER_ALPHA) {
			return;
		} else {
			super.update();
		}
	}

	gameOver() {
		if (this.gameOverText) {
			console.log('gameOverText');
			this.gameOverText.alpha = GAME_CONFIG.SCENE.GAME_OVER_ALPHA;
		}
		this.onRemove();
	}

	onRemove() {
		super.onRemove();
	}
}
