// this class generated with Thing-Editor's component's Wizard,
// and contain basic game-object's methods.
// For details: https://github.com/Megabyteceer/thing-editor/wiki/Custom-Components#custom-component-methods

import editable from 'thing-editor/src/editor/props-editor/editable';
import Container from 'thing-editor/src/engine/lib/assets/src/basic/container.c';
import type PipesContainer from './PipesContaner.c';
import Lib from 'thing-editor/src/engine/lib';
import game from 'thing-editor/src/engine/game';
import Bunny from './bunny.c';
import type BunnyGameSceneLogic from './BunnyGameSceneLogic.c';
import { GAME_CONFIG } from './game-config';

export default class PipeSpawner extends Container {

	@editable()
	spawnTime: number = GAME_CONFIG.PIPE.SPAWN_INTERVAL;

	@editable({ type: 'prefab'})
	pipePath: string | null = null;

	@editable()
	spawnPointX: number = GAME_CONFIG.PIPE.SPAWN_POINT_X;

	@editable()
	private speedX: number = GAME_CONFIG.PIPE.SPEED_X;

	@editable()
	isDynamicPosition: boolean = true;

	@editable()
	private pipesRange: number = GAME_CONFIG.PIPE.PIPE_RANGE;

	@editable()
	private MIN: number = GAME_CONFIG.PIPE.MIN_Y;

	@editable()
	private MAX: number = GAME_CONFIG.PIPE.MAX_Y;

	private pool: PipesContainer[] = [];

	private startTime: number = 0;
	private bunny: Bunny | null = null;
	private gameScene: BunnyGameSceneLogic | null = null;
	private pipeId: number = 0;

	init() {
		super.init();
		this.startTime = game.time;
		this.bunny = this.getRootContainer().findChildrenByType(Bunny)[0] as Bunny;
		this.gameScene = this.getRootContainer() as BunnyGameSceneLogic;
	}

	public registerInPool(pipe : PipesContainer) {
		pipe.parent?.removeChild(pipe);
		pipe.x = 0;
		this.pool.push(pipe);
	}

	public spawn() {
		if (this.pool.length == 0) {
			if (this.pipePath) {
				const pipe = Lib.loadPrefab(this.pipePath)! as PipesContainer;
				if (this.isDynamicPosition) {
					pipe.y = Math.floor(Math.random() * this.pipesRange) + (game.H / 2 - this.pipesRange / 2);
				} else {
					pipe.y = Math.floor(Math.random() * (this.MAX - this.MIN + 1)) + this.MIN;
				}
				pipe.speedX = this.speedX;
				pipe.parent = this;
				pipe.bunny = this.bunny;
				pipe.pipeId = this.pipeId++;
				pipe.scene = this.gameScene;
				this.pool.push(pipe);
			}
		}
		const pipe = this.pool.pop()!;
		pipe.wasPassed = false;
		pipe.lastCheckX = 0;
		pipe.x = this.spawnPointX;
		this.addChild(pipe);
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
		while (this.children.length > 0) {
			this.removeChild(this.children[0]);
		}
		this.bunny = null;
		this.gameScene = null;
		this.pool = [];
		super.onRemove();
	}
}
