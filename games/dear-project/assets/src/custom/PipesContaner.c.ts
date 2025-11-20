import Container from 'thing-editor/src/engine/lib/assets/src/basic/container.c';
import editable from 'thing-editor/src/editor/props-editor/editable';
import type PipeSpawner from './pipe-spawner.c.ts';
import type Bunny from './bunny.c';
import type BunnyGameSceneLogic from './BunnyGameSceneLogic.c';
import { GAME_CONFIG } from './game-config';

export default class PipesContainer extends Container {

	@editable()
	private speedX: number = GAME_CONFIG.PIPE.SPEED_X;

	@editable()
	private MIN: number = GAME_CONFIG.PIPE.MIN_Y;

	@editable()
	private MAX: number = GAME_CONFIG.PIPE.MAX_Y;

	public pipeId: number = 0;

	public bunny: Bunny | null = null;

	public scene: BunnyGameSceneLogic | null = null;

	public wasPassed: boolean = false;

	 init() {
    	super.init();
		this.wasPassed = false;
	 	this.y = Math.floor(Math.random() * (this.MAX - this.MIN + 1)) + this.MIN;
	 }

	update() {
		this.x += this.speedX;
		if (this.x <= GAME_CONFIG.PIPE.RETURN_TO_POOL_X) {
			(this.parent as PipeSpawner)?.registerInPool(this);
		}
		let isCollision = false;
		if (this.bunny) {
			const dx = Math.abs(this.getGlobalPosition().x - this.bunny.x);
			const collisionXThreshold = GAME_CONFIG.PIPE.OBSTACLE_WIDTH_HALF + GAME_CONFIG.PIPE.COLLISION_RADIUS;

			if (dx <= collisionXThreshold && this.getGlobalPosition().x > this.bunny.x) {
				const gapTop = (this.getGlobalPosition().y + GAME_CONFIG.PIPE.OFFSET_Y);
				const gapBottom = (this.getGlobalPosition().y + GAME_CONFIG.PIPE.OFFSET_Y) + GAME_CONFIG.PIPE.GAP_MULTIPLIER * GAME_CONFIG.PIPE.GAP_SIZE_HALF;

				if (this.bunny.getGlobalPosition().y < gapTop || this.bunny.getGlobalPosition().y > gapBottom) {
					const sceneLogic = this.getRootContainer() as BunnyGameSceneLogic;
					isCollision = true;
					sceneLogic?.gameOver();
					return;
				}
			}

			if (!isCollision && !this.wasPassed && (this.getGlobalPosition().x + GAME_CONFIG.PIPE.OBSTACLE_WIDTH_HALF) < this.bunny.x) {
				this.wasPassed = true;
				console.log('score increased for pipe=' + this.pipeId);
				this.scene?.increaseScore();
			}
		}
		super.update();
	}

	 onRemove() {
		this.bunny = null;
		this.scene = null;
		super.onRemove();
	 }
}
