// this class generated with Thing-Editor's component's Wizard,
// and contain basic game-object's methods.
// For details: https://github.com/Megabyteceer/thing-editor/wiki/Custom-Components#custom-component-methods

import editable from 'thing-editor/src/editor/props-editor/editable';
import Container from 'thing-editor/src/engine/lib/assets/src/basic/container.c';
import type PipesContainer from './pipes-contaner.c';
import Lib from 'thing-editor/src/engine/lib';
import game from 'thing-editor/src/engine/game';
import Bunny from './bunny.c';
import type BunnyGameSceneLogic from './bunny-game-scene-logic.c';
import { GAME_CONFIG } from './game-config';

export default class PipeSpawner extends Container {

    @editable()
    spawnTime: number = GAME_CONFIG.PIPE.SPAWN_INTERVAL;

    @editable({ type: 'prefab'})
    pipePath: string | null = null;

    @editable()
    spawnPointX: number = GAME_CONFIG.PIPE.SPAWN_POINT_X;

    @editable()
    public speedX: number = GAME_CONFIG.PIPE.SPEED_X;

    @editable()
    private pipesRange: number = GAME_CONFIG.PIPE.PIPE_RANGE;


    private pool: PipesContainer[] = [];

    private startTime: number = 0;
    private bunny: Bunny | null = null;
    private gameScene: BunnyGameSceneLogic | null = null;
    private pipeId: number = 0;
	private centerY: number = 0;

	init() {
    	super.init();
    	this.startTime = game.time;
    	this.bunny = this.getRootContainer().findChildrenByType(Bunny)[0] as Bunny;
    	this.gameScene = this.getRootContainer() as BunnyGameSceneLogic;
	}

	public registerInPool(pipe : PipesContainer) {
    	this.pool.push(pipe);
	}

	public spawn() {
    	let pipe: PipesContainer;

    	if (this.pool.length > 0) {
    		pipe = this.pool.pop()!;
    	} else if (this.pipePath) {
    		pipe = Lib.loadPrefab(this.pipePath)! as PipesContainer;
    		this.addChild(pipe);
    	} else {
    		return;
    	}

		pipe.y = Math.floor(Math.random() * this.pipesRange) + (game.H / 2 - this.pipesRange / 2);
    	pipe.parent = this;
    	pipe.visible = true;
    	pipe.speedX = this.speedX;
    	pipe.bunny = this.bunny;
    	pipe.pipeId = this.pipeId++;
    	pipe.scene = this.gameScene;

    	pipe.wasPassed = false;
    	pipe.lastCheckX = 0;
    	pipe.x = this.spawnPointX;

    	if (!this.children.includes(pipe)) {
    		this.addChild(pipe);
    	}
	}


	public recalculateAllPipesPositions() {
		const newCenterY = game.H / 2;
		if (this.centerY !== newCenterY) {
			const offsetY = newCenterY - this.centerY;

			for (const child of this.children) {
				if (child instanceof Container && (child as any).pipeId !== undefined) {
					const pipe = child as PipesContainer;
					if (pipe.visible && pipe.parent === this) {
						pipe.y += offsetY ;
					}
				}
			}
			this.centerY = newCenterY;
		}
	}

	update() {
    	const dtTime = game.time - this.startTime;
    	if (dtTime == this.spawnTime) {
    		this.startTime = game.time;
    		this.spawn();
    	}
    	super.update();
	}

	onRemove() {
    	this.bunny = null;
    	this.gameScene = null;
    	this.pool = [];
    	super.onRemove();
	}
}
