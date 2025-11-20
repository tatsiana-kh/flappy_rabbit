import Container from 'thing-editor/src/engine/lib/assets/src/basic/container.c';
import type Sprite from 'thing-editor/src/engine/lib/assets/src/basic/sprite.c';
import Lib from 'thing-editor/src/engine/lib';
import game from 'thing-editor/src/engine/game';
import type BackgroundSpawner from './background-spawner.c';
import { GAME_CONFIG } from './game-config';

export default class BackgroundPiece extends Container {

	public speedX: number = 0;
	public imageName: string | null = null;
	public sprite: Sprite | null = null;
	public pieceId: number = 0;
	private sprites: Sprite[] = [];

	init() {
		super.init();
	}

	update() {
		this.x += this.speedX;

		const pieceWidth = this.sprite?.width || this.width || 0;
		if (this.x <= -pieceWidth) {
			(this.parent as BackgroundSpawner)?.registerInPool(this);
		}

		super.update();
	}

	public setImage(imageName: string | null) {
		this.imageName = imageName;

		if (this.sprites.length === 0 && imageName && Lib.hasTexture(imageName)) {
			const texture = Lib.getTexture(imageName);
			const imageHeight = texture.height;
			const sceneHeight = game.H;

			const spritesNeeded = Math.ceil(sceneHeight / imageHeight);

			for (let i = 0; i < spritesNeeded; i++) {
				const sprite = Lib._loadClassInstanceById('Sprite') as Sprite;
				sprite.image = imageName;
				sprite.y = i * imageHeight;
				sprite.x = GAME_CONFIG.BACKGROUND.SPRITE_INITIAL_X;
				this.addChild(sprite);
				this.sprites.push(sprite);

				if (i === 0) {
					this.sprite = sprite;
				}
			}
		}
	}

	onRemove() {
		for (const sprite of this.sprites) {
			this.removeChild(sprite);
		}
		this.sprites = [];
		this.sprite = null;
		super.onRemove();
	}
}

