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

	private pool: PipesContainer[] = [];

	private startTime: number = 0;
	private bunny: Bunny | null = null;
	private gameScene: BunnyGameSceneLogic | null = null;
	private pipeId: number = 0;

	init() {
		super.init();
		//	console.log('path = ' + this.pipePath + ' x=' + this.spownPointX);
		this.startTime = game.time;
		this.bunny = this.getRootContainer().findChildrenByType(Bunny)[0] as Bunny;
		this.gameScene = this.getRootContainer() as BunnyGameSceneLogic;
	}

	public registerInPool(pipe : PipesContainer) {
		pipe.parent?.removeChild(pipe);
		pipe.wasPassed = false;
		this.pool.push(pipe);
	}

	public spawn() {
		if (this.pool.length == 0) {
			if (this.pipePath) {
				const pipe = Lib.loadPrefab(this.pipePath)! as PipesContainer;
				pipe.parent = this;
				pipe.bunny = this.bunny;
				pipe.pipeId = this.pipeId++;
				pipe.scene = this.gameScene;
				//	console.log('spown pipe=' + pipe.pipeId);
				this.pool.push(pipe);
			}

		}
		const pipe = this.pool.pop()!;
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
		this.bunny = null;
		this.gameScene = null;
		super.onRemove();
	}
}
