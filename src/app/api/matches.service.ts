import { Injectable } from '@angular/core';
import {PlayerStatsApiResponseInterface} from '../interface/stats.interface';
import {retry} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import { ChessGamesApiResponseInterface } from '../interface/chessGames.interface';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  public playerUrl = 'https://api.chess.com/pub/player/';

  constructor(
    private http: HttpClient,
  ) {

  }

  public async getMonthMatches(playerName: string): Promise<ChessGamesApiResponseInterface> {
    const year = moment().format('YYYY');
    const month = moment().format('MM');
    return await this.http.get<ChessGamesApiResponseInterface>(
      `${this.playerUrl}${playerName}/games/${year}/${month}`
    ).pipe(retry(2)).toPromise();
  }
}
