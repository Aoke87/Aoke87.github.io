import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChessPlayer, ChessPlayerProfileApiResponse} from '../../interface/player.interface';
import { PlayerStatsApiResponseInterface} from '../../interface/stats.interface';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import * as moment from 'moment';
import { FriendsService as FriendsDbService } from '../../database/friends.service';
import {LastRefreshService} from '../../database/last-refresh.service';
import {retry} from 'rxjs/operators';

export const DATA_BASE_NAME_FRIENDS = 'friends';

export const DATA_BASE_NAME_UPDATE = 'updates';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  public friends = new Subject<ChessPlayer>();

  public PRESET_FRIENDS = ['ProfGurke', 'Kong1436', 'strike_777', 'cyfer777', 'Mathino', 'bolli8'];

  public playerUrl = 'https://api.chess.com/pub/player/';

  public isLoading = false;

  constructor(
    private http: HttpClient,
    private dbService: NgxIndexedDBService,
    private friendsDbService: FriendsDbService,
    private lastRefreshService: LastRefreshService
  ) {  }

  /**
   * Load either:
   * initially preset of friends from api -> save to db
   * all friends from database
   */
  public async loadFriends(fromApi = false): Promise<void> {
    const lastRefresh = await this.lastRefreshService.getLastUpdate();
    console.log(lastRefresh);
    console.log(moment(lastRefresh?.toString()).fromNow());
    if (!lastRefresh || fromApi) {
      // Initially load players from Api
      console.log('🛑 No Date found, requesting from chess.com api');
      return await this.loadPresetFriendsFromApi();
    } else {
      // Load Players from Database
      const dbFriends = await this.friendsDbService.getAll();
      dbFriends.forEach(friend =>  this.friends.next({... friend }));
    }
  }

  private async loadPresetFriendsFromApi(): Promise<void>
  {
    this.isLoading = true;
    for await (const friend of this.PRESET_FRIENDS) {
      const apiFriend: ChessPlayer|null = await this.fetchChessPlayerFromApi(friend);
      if (!apiFriend) { return; }
      this.friends.next({... apiFriend });
      await this.friendsDbService.add(apiFriend);
    }
    this.isLoading = false;
  }

  private async fetchChessPlayerFromApi(name: string): Promise<ChessPlayer|null> {
    const friend = this.http.get<ChessPlayerProfileApiResponse>(`${this.playerUrl}${name}`).pipe(retry(2)).toPromise();
    const stats = this.http.get<PlayerStatsApiResponseInterface>(`${this.playerUrl}${name}/stats`).pipe(retry(2)).toPromise();

    try {
      const response = await Promise.all([friend, stats]);
      return {
        ...(response[0] as ChessPlayerProfileApiResponse),
        stats: {...(response[1] as PlayerStatsApiResponseInterface)}
      } as ChessPlayer;
    } catch (e) {
      await this.fetchChessPlayerFromApi(name);
      return null;
    }
  }
}
