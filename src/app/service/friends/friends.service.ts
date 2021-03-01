import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {forkJoin, Observable, Subject, throwError} from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { ChessPlayer, ChessPlayerProfileApiResponse} from '../../interface/player.interface';
import { PlayerStatsApiResponseInterface} from '../../interface/stats.interface';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  public friends = new Subject<ChessPlayer>();

  public PRESET_FRIENDS = ['ProfGurke', 'Kong1436', 'strike_777', 'cyfer777', 'Mathino', 'bolli8'];

  public playerUrl = 'https://api.chess.com/pub/player/';

  constructor(
    private http: HttpClient,
    private dbService: NgxIndexedDBService
  ) {  }

  private addFriendToSubject(friendWithStats: ChessPlayer): void {
    this.friends.next({... friendWithStats });
  }

  public async loadFriends(): Promise<void> {
    const dbFriends = await this.fetchFriendsFromDb();
    if (dbFriends.length > 0) {
      dbFriends.forEach(friend => this.addFriendToSubject(friend));
      return;
    }

    for await (const friend of this.PRESET_FRIENDS) {
      const apiFriend: ChessPlayer = await this.fetchChessPlayerFromApi(friend);
      this.addFriendToSubject(apiFriend);
      this.dbService.add('friends', {...apiFriend});
    }
  }

  private async fetchFriendsFromDb(): Promise<ChessPlayer[]> {
    return this.dbService.getAll('friends').toPromise();
  }

  private async fetchChessPlayerFromApi(name: string): Promise<ChessPlayer> {
    const friend = this.http.get<ChessPlayerProfileApiResponse>(`${this.playerUrl}${name}`).toPromise();
    const stats = this.http.get<PlayerStatsApiResponseInterface>(`${this.playerUrl}${name}/stats`).toPromise();

    const response = await Promise.all([friend, stats]);
    return {
      ...(response[0] as ChessPlayerProfileApiResponse),
      stats: {...(response[1] as PlayerStatsApiResponseInterface)}
    } as ChessPlayer;
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
