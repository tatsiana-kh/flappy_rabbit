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

const SPAWN_INTERVAL = 20;
const SPOWN_POINT_X = 800;

export default class PipeSpowner extends Container {

	@editable()
	spownTime: number = SPAWN_INTERVAL;

	@editable({ type: 'prefab'})
	pipePath: string | null = null;


	@editable()
	spownPointX: number = SPOWN_POINT_X;

	private pool: PipesContainer[] = [];

	private startTime: number = 0;
	private bunny: Bunny | undefined;
	private gameScene: BunnyGameSceneLogic | undefined;
	private pipeId: number = 0;

	init() {
		super.init();
		console.log('path = ' + this.pipePath + ' x=' + this.spownPointX);
		this.startTime = game.time;
		this.bunny = this.getRootContainer().findChildrenByType(Bunny)[0] as Bunny;
		this.gameScene = this.getRootContainer() as BunnyGameSceneLogic;
	}

	public registerInPool(pipe : PipesContainer) {
		pipe.parent?.removeChild(pipe);
		pipe.wasPassed = false;
		this.pool.push(pipe);
	}

	public spown() {
		if (this.pool.length == 0) {
			if (this.pipePath) {
				const pipe = Lib.loadPrefab(this.pipePath)! as PipesContainer;
				pipe.parent = this;
				pipe.bunny = this.bunny;
				pipe.pipeId = this.pipeId++;
				pipe.scene = this.gameScene;
				console.log('spown pipe=' + pipe.pipeId);
				//console.log('pipe.bunny = ' + pipe.bunny?.xSpeed);
				this.pool.push(pipe);
			}

		}
		const pipe = this.pool.pop()!;
		pipe.x = this.spownPointX;
		//pipe.parent = null;
		this.addChild(pipe);
	}

	update() {
		// Add your update code here

		const dtTime = game.time - this.startTime;
		//	console.log('dt time = ' + dtTime);
		if (dtTime == this.spownTime) {
			this.startTime = game.time;
			this.spown();
		}
		super.update();
	}

	onRemove() {
		// Add onRemove code here
		this.bunny = undefined;
		this.gameScene = undefined;
		super.onRemove();
	}
}
