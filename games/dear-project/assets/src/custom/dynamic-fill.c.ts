// this class generated with Thing-Editor's component's Wizard,
// and contain basic game-object's methods.
// For details: https://github.com/Megabyteceer/thing-editor/wiki/Custom-Components#custom-component-methods

import editable from 'thing-editor/src/editor/props-editor/editable';
import Fill from 'thing-editor/src/engine/lib/assets/src/basic/fill.c';
import game from 'thing-editor/src/engine/game';

export default class DynamicFill extends Fill {


	@editable()
	isDynamic = false;


	init() {
		super.init();
		if (this.isDynamic) {
			this.updateScaleAndRepeat();
		}
	}

	private updateScaleAndRepeat() {
		if (!this.texture) {
			return;
		}

		const textureWidth = this.texture.width;
		const textureHeight = this.texture.height;

		if (textureWidth <= 0 || textureHeight <= 0) {
			return;
		}

		let viewportWidth: number;
		let viewportHeight: number;

		if (game.isPortrait) {
			viewportWidth = game.W;
			viewportHeight = game.H;
		} else {
			viewportWidth = game.W;
			viewportHeight = game.H;
		}

		const scaleX = viewportWidth / textureWidth;
		const scaleY = viewportHeight / textureHeight;

		this.scale.x = scaleX;
		this.scale.y = scaleY;
		this.xRepeat = scaleX;
		this.yRepeat = scaleY;
	}

	update() {
		super.update();
	}

	onRemove() {
		super.onRemove();
	}
}
