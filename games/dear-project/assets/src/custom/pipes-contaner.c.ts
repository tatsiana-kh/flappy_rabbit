import Container from 'thing-editor/src/engine/lib/assets/src/basic/container.c';
import type PipeSpawner from './pipe-spawner.c.ts';
import type Bunny from './bunny.c.ts';
import type BunnyGameSceneLogic from './bunny-game-scene-logic.c.ts';
import { GAME_CONFIG } from './game-config.ts';

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
    	if (!this.parent || !this.visible) {
    		return;
    	}

    	this.x += this.speedX;

    	const RETURN_LIMIT = GAME_CONFIG.PIPE.RETURN_TO_POOL_X - GAME_CONFIG.PIPE.OBSTACLE_WIDTH_HALF;

    	if (this.x <= RETURN_LIMIT) {
    		this.visible = false;
    		this.x = GAME_CONFIG.PIPE.FAR_AWAY_X;
    		(this.parent as PipeSpawner)?.registerInPool(this);
    		return;
    	}


    	if (this.wasPassed) {
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
    			}
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
