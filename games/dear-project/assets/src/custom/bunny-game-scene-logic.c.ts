import Scene from 'thing-editor/src/engine/lib/assets/src/basic/scene.c';
import { GAME_CONFIG } from './game-config';
import type Fill from 'thing-editor/src/engine/lib/assets/src/basic/fill.c';

export default class BunnyGameSceneLogic extends Scene {

	public score: number = 0;
	private scoreText: any = null;
	private gameOverText: any = null;

	init() {
		super.init();
		this.score = GAME_CONFIG.SCENE.INITIAL_SCORE;
		this.scoreText = this.findChildByName('counterText');
		this.gameOverText = this.findChildByName('GameOverText');
		this.updateScoreDisplay();
	}

	public setAdaptiveBackgroundProps(name:string, scaleW: number, scaleH: number, repeatX: number, repeatY: number) {
		const backgroundFill = this.findChildByName(name) as Fill;

		if (backgroundFill) {
			backgroundFill.scale.x = scaleW;
			backgroundFill.scale.y = scaleH;
			backgroundFill.xRepeat = repeatX;
			backgroundFill.yRepeat = repeatY;
		}
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
			this.gameOverText.alpha = GAME_CONFIG.SCENE.GAME_OVER_ALPHA;
		}
		this.onRemove();
	}

	onRemove() {
		super.onRemove();
	}
}
