import {HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChessPlayer, ChessPlayerProfileApiResponse} from '../interface/player.interface';
import { MatchesService as MatchesApiService } from '../api/matches.service';
import { Subject } from 'rxjs';
import { NgxIndexedDBService} from 'ngx-indexed-db';
import { FriendsService as FriendsDbService} from '../database/friends.service';
import { LastRefreshService} from '../database/last-refresh.service';
import { retry} from 'rxjs/operators';
import { PlayerStatsApiResponseInterface} from '../interface/stats.interface';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  public friends: ChessPlayer[] = [];

  public friendsSubject = new Subject<ChessPlayer>();

  public PRESET_FRIENDS = ['ProfGurke', 'Kong1436', 'strike_777', 'cyfer777', 'Mathino', 'bolli8'];

  public playerUrl = 'https://api.chess.com/pub/player/';

  public isLoading = false;

  public refreshTimerMinutes = 10;

  constructor(
    private http: HttpClient,
    private dbService: NgxIndexedDBService,
    private friendsDbService: FriendsDbService,
    private lastRefreshService: LastRefreshService,
    private matchesApiService: MatchesApiService
  ) { }

  ngOnInit(): void {
    this.friendsSubject.subscribe((friend: ChessPlayer) => {
      this.matchesApiService.getDailyMatches(friend.username).then(
        matches => {
          friend = {
            ...friend,
            dailyMatches: matches,
            eloImprovement: this.matchesApiService.getEloImprovement(matches, friend.username)
          };
          this.friends.push(friend);
          console.log(friend);
        }
      );
    });
    this.loadFriends();
  }

  /**0
   * Load either:
   * initially preset of friends from api -> save to db
   * all friends from database
   */
  public async loadFriends(fromApi = false): Promise<void> {
    const lastRefresh = await this.lastRefreshService.getLastUpdate();

    if (!lastRefresh || fromApi || dayjs().subtract(this.refreshTimerMinutes, 'minutes').isAfter(dayjs(lastRefresh))) {
      // Initially load players from Api
      console.log('🛑 Date old -> requesting from chess.com api');
      return await this.loadPresetFriendsFromApi();
    } else {
      // Load Players from Database
      const dbFriends = await this.friendsDbService.getAll();
      dbFriends.forEach(friend =>  this.friendsSubject.next({... friend }));
    }
  }

  private async loadPresetFriendsFromApi(): Promise<void>
  {
    this.isLoading = true;
    for await (const friend of this.PRESET_FRIENDS) {
      const apiFriend: ChessPlayer|null = await this.fetchChessPlayerFromApi(friend);
      if (!apiFriend) { return; }
      this.friendsSubject.next({... apiFriend });
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
