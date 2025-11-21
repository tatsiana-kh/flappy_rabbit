import editable from 'thing-editor/src/editor/props-editor/editable';
import Container from 'thing-editor/src/engine/lib/assets/src/basic/container.c';
import Lib from 'thing-editor/src/engine/lib';
import game from 'thing-editor/src/engine/game';
import BackgroundPiece from './background-piece.c';
import { GAME_CONFIG } from './game-config';

export default class BackgroundSpawner extends Container {

	@editable({ type: 'image'})
	image: string | null = null;

	@editable()
	speedX: number = GAME_CONFIG.BACKGROUND.SPEED_X;

	private pool: BackgroundPiece[] = [];
	private lastPiece: BackgroundPiece | null = null;
	private imageWidth: number = 0;
	private pieceId: number = 0;

	init() {
		super.init();

		if (this.image && Lib.hasTexture(this.image)) {
			const texture = Lib.getTexture(this.image);
			this.imageWidth = texture.width;
		}

		this.spawnInitialPieces();
	}

	private spawnInitialPieces() {
		if (!this.image || !Lib.hasTexture(this.image)) {
			return;
		}

		const screenWidth = game.W;
		const piecesNeeded = Math.ceil(screenWidth / this.imageWidth) + GAME_CONFIG.BACKGROUND.INITIAL_PIECES_EXTRA;
		for (let i = 0; i < piecesNeeded; i++) {
			const x = i * this.imageWidth;
			const piece = this.spawn(x);
			if (!this.lastPiece || piece.x > this.lastPiece.x) {
				this.lastPiece = piece;
			}
		}
	}

	public spawn(x?: number): BackgroundPiece {
		let piece: BackgroundPiece;

		if (this.pool.length == 0) {
			piece = Lib._loadClassInstanceById((BackgroundPiece as any).__className || 'BackgroundPiece') as BackgroundPiece;
			piece.speedX = this.speedX;
			piece.pieceId = this.pieceId++;
			piece.setImage(this.image);
		} else {
			piece = this.pool.pop()!;
		}

		if (x !== undefined) {
			piece.x = x;
		}
		piece.speedX = this.speedX;
		this.addChild(piece);

		return piece;
	}

	public registerInPool(piece: BackgroundPiece) {
		piece.parent?.removeChild(piece);
		this.pool.push(piece);
	}

	update() {
		if (this.lastPiece) {
			const lastPieceRightEdge = this.lastPiece.x + (this.lastPiece.sprite?.width || this.imageWidth);
			if (lastPieceRightEdge <= game.W + GAME_CONFIG.BACKGROUND.CHECK_DISTANCE) {
				const newPiece = this.spawn(lastPieceRightEdge);
				this.lastPiece = newPiece;
			}
		} else {
			const newPiece = this.spawn(GAME_CONFIG.BACKGROUND.INITIAL_X);
			this.lastPiece = newPiece;
		}

		super.update();
	}

	onRemove() {
		this.pool = [];
		this.lastPiece = null;
		super.onRemove();
	}
}
