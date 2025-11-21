import editable from 'thing-editor/src/editor/props-editor/editable';
import game from 'thing-editor/src/engine/game';
import DSprite from 'thing-editor/src/engine/lib/assets/src/basic/d-sprite.c';
import type BunnyGameSceneLogic from './bunny-game-scene-logic.c';
import { GAME_CONFIG } from './game-config';

export default class Bunny extends DSprite {

	@editable()
	gravity = GAME_CONFIG.BUNNY.GRAVITY;

	@editable()
	jumpVelocity: number = GAME_CONFIG.BUNNY.JUMP_VELOCITY;

	@editable()
	forwardSpeed: number = GAME_CONFIG.BUNNY.FORWARD_SPEED;

	private isAlive: boolean = true;

	init() {
		super.init();

		this.x = GAME_CONFIG.BUNNY.INITIAL_X;

		if (game.isPortrait) {
			this.y = game.W / 2;
		} else {
			this.y = game.H / 2;
		}

		this.xSpeed = GAME_CONFIG.BUNNY.INITIAL_X_SPEED;
		this.ySpeed = GAME_CONFIG.BUNNY.INITIAL_Y_SPEED;
		this.isAlive = true;

		const stage = this.getRootContainer() as BunnyGameSceneLogic;

		if (stage) {
			stage.interactive = true;
		}
		stage.onMouseDown = this.onJump.bind(this);
	}

	onJump() {
		if (this.isAlive) {
			this.ySpeed += GAME_CONFIG.BUNNY.JUMP_VELOCITY;
		}
	}

	update() {
		if (!this.isAlive) {
			return;
		}

		this.ySpeed += this.gravity * GAME_CONFIG.BUNNY.GRAVITY_MULTIPLIER;
		const TARGET_X = game.W * GAME_CONFIG.BUNNY.TARGET_X_MULTIPLIER;

		if (this.x >= TARGET_X) {
			this.xSpeed = GAME_CONFIG.BUNNY.INITIAL_X_SPEED;
			this.x = TARGET_X;
		} else {
			this.xSpeed = GAME_CONFIG.BUNNY.FORWARD_SPEED;
		}

		super.update();
	}

	onRemove() {
		const stage = this.getRootContainer();
		if (stage) {
			stage.off('click', this.onJump, this);
		}
		super.onRemove();
	}
}
