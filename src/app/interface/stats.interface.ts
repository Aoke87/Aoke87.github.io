export interface LastInterface {
    rating: number;
    date: number;
    rd: number;
}

export interface BestInterface {
    rating: number;
    date: number;
    game: string;
}

export interface RecordInterface {
    win: number;
    loss: number;
    draw: number;
}

interface GameModeInterface {
    last: LastInterface;
    best: BestInterface;
    record: RecordInterface;
}

export interface RatingDateInterface {
    rating: number;
    date: number;
}

export interface TacticsInterface {
    highest: RatingDateInterface;
    lowest: RatingDateInterface;
}

export interface LessonsInterface {
    highest: RatingDateInterface;
    lowest: RatingDateInterface;
}

export interface PuzzleRushInterface {
    best: {
        total_attempts: number;
        score: number;
    };
}

export interface PlayerStatsApiResponseInterface {
    chess_rapid: GameModeInterface;
    chess_bullet: GameModeInterface;
    chess_blitz: GameModeInterface;
    tactics: TacticsInterface;
    lessons: LessonsInterface;
    puzzle_rush: PuzzleRushInterface;
}

