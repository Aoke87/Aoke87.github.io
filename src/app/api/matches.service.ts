import { Injectable } from '@angular/core';
import {PlayerStatsApiResponseInterface} from '../interface/stats.interface';
import {retry} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {ChessGamesApiResponseInterface, GameInterface} from '../interface/chessGames.interface';

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
    const year = moment().format('YYYY');
    const month = moment().format('MM');
    return await this.http.get<ChessGamesApiResponseInterface>(
      `${this.playerUrl}${playerName}/games/${year}/${month}`
    ).pipe(retry(2)).toPromise();
  }

  public async getDailyMatches(playerName: string): Promise<GameInterface[]> {
    const monthlyGames = await this.getMonthlyMatches(playerName);
    return monthlyGames.games.filter(game => this.isToday(game.end_time));
  }

  private isToday(timestamp: number): boolean {
    const matchTime = moment.unix(timestamp).utc();
    // console.log(matchTime.format('DD/MM/YYYY'));
    // console.log(matchTime.isSame(new Date(), 'day'));
    return matchTime.isSame(new Date(), 'day');
  }
}
