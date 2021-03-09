import {PlayerStatsApiResponseInterface} from './stats.interface';
import {GameInterface} from './chessGames.interface';

export interface ChessPlayerProfileApiResponse {
    avatar: string;
    player_id: number;
    '@id': string;
    url: string;
    name: string;
    username: string;
    followers: number;
    country: string;
    location: string;
    last_online: number;
    joined: number;
    status: string;
    is_streamer: boolean;
}

export interface ChessPlayerOpponent {
    rating: number;
    result: string;
    '@id': string;
    username: string;
}


export interface ChessPlayer extends ChessPlayerProfileApiResponse {
  stats: PlayerStatsApiResponseInterface;
  dailyMatches?: GameInterface[];
  eloImprovement: any,
}
