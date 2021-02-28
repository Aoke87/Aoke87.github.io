import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {forkJoin, Observable, Subject, throwError} from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import {ChessPlayer, ChessPlayerProfileApiResponse} from '../../interface/player.interface';
import {PlayerStatsApiResponseInterface} from '../../interface/stats.interface';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  public friends = new Subject<ChessPlayer>();

  public playerUrl = 'https://api.chess.com/pub/player/';

  constructor(
    private http: HttpClient
  ) { }

  public fetchChessPlayerByName(name: string): any {
    const friend = this.http.get<ChessPlayerProfileApiResponse>(`${this.playerUrl}${name}`);
    const stats = this.http.get<PlayerStatsApiResponseInterface>(`${this.playerUrl}${name}/stats`);

    forkJoin([friend, stats]).pipe(
      catchError(this.handleError)
    ).subscribe(
      (results) => {
        this.friends.next({
          ...(results[0] as ChessPlayerProfileApiResponse),
          stats: {...(results[1] as PlayerStatsApiResponseInterface)}
        });
      });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
