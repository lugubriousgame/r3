declare interface SerializedBoard {
	width: number;
	height: number;
	data: string;
}

declare interface SerializedGameState {
	board: SerializedBoard;
	turn: number;
}

declare interface SerializedGame {
	gameId: number;
	colors: number[];
	gameStates: SerializedGameState[];
}
