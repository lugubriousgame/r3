import { Game } from 'src/game';
import { GameState } from 'src/game-state';
import { Board } from 'src/board';
import { Square } from 'src/square';

const directions: Point[] = [
	{ x:  0, y: -1 },
	{ x:  1, y: -1 },
	{ x:  1, y:  0 },
	{ x:  1, y:  1 },
	{ x:  0, y:  1 },
	{ x: -1, y:  1 },
	{ x: -1, y:  0 },
	{ x: -1, y: -1 }
];

function getAffectedSquares( board: Board, position: Point, color: number ): Square[] {
	if( !board.boundsCheck( position ) ) { return []; }
	const square = board.get( position );
	if( !square || !square.empty || !square.enabled ) { return []; }
	function direction( { x, y }: Point, delta: Point ): Square[] {
		const squares = [] as Square[];
		for( ; ; ) {
			x += delta.x;
			y += delta.y;
			if( !board.boundsCheck( { x, y } ) ) { return []; }
			const square = board.get( { x, y } );
			if( !square || square.empty || !square.enabled ) { return []; }
			if( square.color === color ) { return squares; }
			squares.push( square );
		}
	}
	const squares = [ square ];
	for( const delta of directions ) {
		squares.splice( squares.length, 0, ...direction( position, delta ) );
	}
	if( squares.length <= 1 ) { return []; }
	return squares;
}

export class Rules {
	public isValid( board: Board, position: Point, color: number ) {
		return getAffectedSquares( board, position, color ).length > 0;
	}

	public getValidMoves( board: Board, color: number ) {
		const squares = [] as Square[];
		for( const square of board ) {
			if( this.isValid( board, square.position, color ) ) { squares.push( square ); }
		}
		return squares;
	}

	public getColors( board: Board ) {
		const colors = new Set<number>();
		for( const { color } of board ) {
			if( color !== null && Number.isSafeInteger( color ) ) {
				colors.add( color );
			}
		}
		return colors;
	}

	public isGameOver( board: Board ) {
		for( const color of this.getColors( board ) ) {
			if( this.getValidMoves( board, color ).length > 0 ) { return false; }
		}
		return true;
	}

	public makeMove( game: Game, position: Point ) {
		const { gameStates } = game;
		const gameState = gameStates[ gameStates.length - 1 ].clone();
		const { board, turn: color } = gameState,
			squares = getAffectedSquares( board, position, color );
		for( const square of squares ) {
			square.color = color;
		}
		const { length } = squares;
		if( length > 0 ) {
			if( !this.isGameOver( board ) ) {
				do {
					gameState.turn = ( gameState.turn + 1 ) % 2;
				} while( this.getValidMoves( board, gameState.turn ).length <= 0 );
			}
			gameStates.push( gameState );
			return true;
		} else {
			return false;
		}
	}

	public getScore( board: Board, color: number ) {
		let score = 0;
		for( const square of board ) {
			if( square && square.enabled && square.color === color ) {
				++score;
			}
		}
		return score;
	}

	public newGame( gameId: string ) {
		const game = new Game( gameId ),
			gameState = new GameState,
			{ board } = gameState;
		game.colors.splice( 0, 0, 0, 1 );
		gameState.turn = 0;
		board.reset( 8, 8 );
		board.get( { x: 3, y: 3 } ).color = 0;
		board.get( { x: 4, y: 3 } ).color = 1;
		board.get( { x: 3, y: 4 } ).color = 1;
		board.get( { x: 4, y: 4 } ).color = 0;
		game.gameStates.push( gameState );
		return game;
	}
}
