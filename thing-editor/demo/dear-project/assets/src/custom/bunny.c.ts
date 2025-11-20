

// import editable from 'thing-editor/src/editor/props-editor/editable';
// import game from 'thing-editor/src/engine/game';
// import DSprite from 'thing-editor/src/engine/lib/assets/src/basic/d-sprite.c';

// let FLOOR_Y = 0;

// export default class Bunny extends DSprite {

// 	@editable()
// 	gravity = 2;

// 	init() {
// 		super.init();
// 		this.xSpeed = (Math.random() - 0.5) * 40;
// 		this.ySpeed = (Math.random() - 0.5) * 40;
// 		FLOOR_Y = game.H - 25;
// 	}
// 	_onRenderResize() {
// 		FLOOR_Y = game.H - 25;
// 	}

// 	update() {
// 		if (this.y >= FLOOR_Y) {
// 			this.ySpeed *= -1;
// 		} else {
// 			this.ySpeed += Math.min(this.gravity, FLOOR_Y - this.y);
// 		}

// 		if (this.x < 0) {
// 			this.x = 0;
// 			this.xSpeed *= -1.0;
// 		}

// 		if (this.x > game.W) {
// 			this.x = game.W;
// 			this.xSpeed *= -1.0;
// 		}

// 		this.scale.x = this.xSpeed > 0 ? 1 : -1;
// 		super.update();
// 	}
// }

import editable from 'thing-editor/src/editor/props-editor/editable';
import game from 'thing-editor/src/engine/game';
import DSprite from 'thing-editor/src/engine/lib/assets/src/basic/d-sprite.c';
import { ƒ } from 'thing-editor/js/engine/utils'; // Импортируем утилиты для ƒ.delta и ƒ.clamp

// --- КОНСТАНТЫ ДЛЯ FLAPPY МЕХАНИКИ ---
const GAME_GRAVITY = 1200; // Ускорение гравитации (пикселей/сек^2). Сделаем чуть сильнее.
const JUMP_VELOCITY = -500; // Скорость прыжка (отрицательное значение - вверх)

export default class Bunny extends DSprite {

    // Добавляем наши переменные для физики и состояния
    private velocityY: number = 0;
    private isAlive: boolean = true;

    // В init() устанавливаем начальные условия и привязываем ввод
    init() {
    	super.init();

    	// Устанавливаем начальную позицию и скорость
    	this.x = game.W * 0.2; // Заяц находится слева
    	this.y = game.H / 2;
    	this.velocityY = 0;
    	this.isAlive = true;

    	// Привязываем обработчик клика/касания ко всей сцене для прыжка
    	const stage = game.getCurrentContainer();
    	if (stage) {
    		stage.interactive = true;
    		stage.on('pointerdown', this.onJump, this);
    	}
    }

    // Метод, вызываемый при клике/касании
    onJump() {
    	if (this.isAlive) {
    		this.velocityY = JUMP_VELOCITY;
    	}
    }

    // Метод для обработки проигрыша
    gameOver() {
    	if (!this.isAlive) return;
    	this.isAlive = false;
    	console.log('Заяц разбился! Game Over.');
    	// Здесь можно остановить движение препятствий
    	// game.editor.stop();
    }

    // Главный цикл логики
    update() {
    	if (!this.isAlive) {
    		return;
    	}

    	// 1. Применяем гравитацию
    	// ƒ.delta - это время, прошедшее с предыдущего кадра, в секундах.
    	this.velocityY += GAME_GRAVITY * ƒ.delta;

    	// 2. Изменяем вертикальную позицию
    	this.y += this.velocityY * ƒ.delta;

    	// 3. Добавляем поворот спрайта (Визуальный эффект)
    	// Заяц наклоняется вниз при падении
    	this.rotation = ƒ.clamp(
    		this.velocityY / 800 * (Math.PI / 2),
    		-Math.PI / 6, // Максимальный подъем
    		Math.PI / 2 // Максимальный наклон вниз
    	);

    	// 4. Проверка на Game Over (падение ниже экрана или полет выше)
    	if (this.y > game.H || this.y < 0) {
    		this.gameOver();
    	}

    	super.update(); // Вызов родительского update (важно для DSprite)
    }

    // Очистка слушателей при удалении объекта
    onRemove() {
    	const stage = game.getCurrentContainer();
    	if (stage) {
    		stage.off('pointerdown', this.onJump, this);
    	}
    	super.onRemove();
    }
}
