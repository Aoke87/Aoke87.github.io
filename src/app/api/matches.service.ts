import { Injectable } from '@angular/core';
import { PlayerStatsApiResponseInterface} from '../interface/stats.interface';
import { retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ChessGamesApiResponseInterface, GameInterface } from '../interface/chessGames.interface';
import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  public playerUrl = 'https://api.chess.com/pub/player/';

  constructor(
    private http: HttpClient,
  ) {

  }

  public async getMonthlyMatches(playerName: string): Promise<ChessGamesApiResponseInterface> {
    const today = dayjs();
    let month: number|string = today.month() + 1;
    month = month < 10 ? '0' + month.toString() : month;
    return await this.http.get<ChessGamesApiResponseInterface>(
      `${this.playerUrl}${playerName}/games/${today.year()}/${month}`
    ).pipe(retry(2)).toPromise();
  }

  public async getDailyMatches(playerName: string): Promise<GameInterface[]> {
    const monthlyGames = await this.getMonthlyMatches(playerName);
    return monthlyGames.games.filter(game => this.isToday(game.end_time));
  }

  public getEloImprovement(dailyMatches: GameInterface[], playerName: string): any {
    const rating: { [key: string]: number[] } = {
      bullet: [],
      blitz: [],
      rapid: [],
      daily: [],
    };

    dailyMatches
      .sort((a: GameInterface, b: GameInterface) => a.end_time < b.end_time ? -1 : 1)
      .forEach((e: GameInterface) => {
        const elo = this.getPlayerEloFromMatch(playerName, e);
        if (elo) { rating[e.time_class].push(elo); }
      });

    return {
      bullet: rating.bullet.length >= 2 ? (rating.bullet[rating.bullet.length - 1] - rating.bullet[0]) : 0,
      blitz:  rating.blitz.length >= 2 ?  (rating.blitz[rating.blitz.length - 1] - rating.blitz[0]) : 0,
      rapid:  rating.rapid.length >= 2 ?  (rating.rapid[rating.rapid.length - 1] - rating.rapid[0]) : 0,
      daily:  rating.daily.length >= 2 ?  (rating.daily[rating.daily.length - 1] - rating.daily[0]) : 0,
    };
  }
  getPlayerEloFromMatch(playerName: string, game: GameInterface): number|null {
    if ( game.white.username.toLowerCase() === playerName.toLowerCase() ) {
      return game.white.rating;
    } else if (game.black.username.toLowerCase() === playerName.toLowerCase()) {
      return game.black.rating;
    }
    return null;
  }

  private isToday(timestamp: number): boolean {
    return dayjs().isSame(dayjs.unix(timestamp), 'day');
  }
}
