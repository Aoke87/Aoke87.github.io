import { ChessPlayerOpponent } from "./player.interface";

export interface ChessGamesApiResponseInterface {
    games: GameInterface[];
}

export interface GameInterface {
    url: string;
    pgn: string|null;
    time_control: string;
    end_time: number;
    rated: boolean;
    fen: string;
    time_class: string;
    rules: string;
    white: ChessPlayerOpponent;
    black: ChessPlayerOpponent;
}
