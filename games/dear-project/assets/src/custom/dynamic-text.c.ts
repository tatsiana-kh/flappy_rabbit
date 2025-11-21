// this class generated with Thing-Editor's component's Wizard,
// and contain basic game-object's methods.
// For details: https://github.com/Megabyteceer/thing-editor/wiki/Custom-Components#custom-component-methods

import editable from 'thing-editor/src/editor/props-editor/editable';
import game from 'thing-editor/src/engine/game';
import Text from 'thing-editor/src/engine/lib/assets/src/basic/text.c';

export default class DynamicText extends Text {


	@editable()
	isDynamicXPosition: boolean = true;

	@editable()
	isDynamicYPosition: boolean = true;

	init() {
		super.init();
		if (this.isDynamicXPosition) {
			this.x = game.W / 2 - this.width / 2;
		}
		if (this.isDynamicYPosition) {
			this.y = game.H / 2 - this.height / 2;
		}
	}

	update() {
		super.update();
	}

	onRemove() {
		super.onRemove();
	}
}
