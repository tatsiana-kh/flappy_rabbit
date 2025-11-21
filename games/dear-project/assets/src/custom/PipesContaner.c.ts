import Container from 'thing-editor/src/engine/lib/assets/src/basic/container.c';
import type PipeSpawner from './pipe-spawner.c.ts';
import type Bunny from './bunny.c';
import type BunnyGameSceneLogic from './BunnyGameSceneLogic.c';
import { GAME_CONFIG } from './game-config';

export default class PipesContainer extends Container {

	public speedX: number = GAME_CONFIG.PIPE.SPEED_X;

	public pipeId: number = 0;

	public bunny: Bunny | null = null;

	public scene: BunnyGameSceneLogic | null = null;

	public wasPassed: boolean = false;
	public lastCheckX: number = 0;

	 init() {
    	super.init();
	 }

	update() {
		if (!this.parent) {
			return;
		}
		this.x += this.speedX;

		if (this.wasPassed) {
			if (this.getGlobalPosition().x + GAME_CONFIG.PIPE.OBSTACLE_WIDTH_HALF <= GAME_CONFIG.PIPE.RETURN_TO_POOL_X) {
				(this.parent as PipeSpawner)?.registerInPool(this);
			}
			return;
		} else {
			let isCollision = false;
			if (this.bunny) {
				const dx = Math.abs(this.getGlobalPosition().x - this.bunny.x);
				const collisionXThreshold = GAME_CONFIG.PIPE.OBSTACLE_WIDTH_HALF + GAME_CONFIG.PIPE.COLLISION_RADIUS;

				if (dx <= collisionXThreshold && this.getGlobalPosition().x > this.bunny.x) {
					const gapTop = this.getGlobalPosition().y - GAME_CONFIG.PIPE.GAP_SIZE_HALF;
					const gapBottom = this.getGlobalPosition().y + GAME_CONFIG.PIPE.GAP_SIZE_HALF;

					if (this.bunny.getGlobalPosition().y < gapTop || this.bunny.getGlobalPosition().y > gapBottom) {
						const sceneLogic = this.getRootContainer() as BunnyGameSceneLogic;
						isCollision = true;
						sceneLogic?.gameOver();
						return;
					}
				}
				if (!isCollision && !this.wasPassed && (this.getGlobalPosition().x + GAME_CONFIG.PIPE.OBSTACLE_WIDTH_HALF) < this.bunny.x) {
			    	this.wasPassed = true;
			    	this.scene?.increaseScore();
					console.log('score increased for pipe=' + this.pipeId);
				}
				// 	if (!isCollision && !this.wasPassed) {
				// 		const pipeRightEdge = this.getGlobalPosition().x + GAME_CONFIG.PIPE.OBSTACLE_WIDTH_HALF;
				// 		const bunnyX = this.bunny.x;

				// 		if (pipeRightEdge < bunnyX) {
				// 			const wasPipeOnRight = this.lastCheckX >= bunnyX;
				// 			if (wasPipeOnRight) {
				// 				this.wasPassed = true;
				// 				console.log('score increased for pipe=' + this.pipeId);
				// 				this.scene?.increaseScore();
				// 			}
				// 		}
				// 		this.lastCheckX = pipeRightEdge;
				// 	}
			} }
		super.update();
	}

	 onRemove() {
		this.bunny = null;
		this.scene = null;
		super.onRemove();
	 }
}
