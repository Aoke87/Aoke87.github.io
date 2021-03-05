import {HttpClient, HttpResponse} from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChessPlayer, ChessPlayerProfileApiResponse} from '../interface/player.interface';
import { MatchesService as MatchesDbService } from '../api/matches.service';
import {Observable, Subject} from 'rxjs';
import { NgxIndexedDBService} from 'ngx-indexed-db';
import { FriendsService as FriendsDbService} from '../database/friends.service';
import { LastRefreshService} from '../database/last-refresh.service';
import { retry} from 'rxjs/operators';
import { PlayerStatsApiResponseInterface} from '../interface/stats.interface';
import * as moment from 'moment';

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

  constructor(
    private http: HttpClient,
    private dbService: NgxIndexedDBService,
    private friendsDbService: FriendsDbService,
    private lastRefreshService: LastRefreshService,
    private matchesDbService: MatchesDbService
  ) { }

  ngOnInit(): void {
    this.friendsSubject.subscribe((friend: ChessPlayer) => {
      this.matchesDbService.getDailyMatches(friend.username).then(
        matches => { this.friends.push({ ...friend, dailyMatches: matches }); }
      );
    });
    this.loadFriends();
  }

  /**
   * Load either:
   * initially preset of friends from api -> save to db
   * all friends from database
   */
  public async loadFriends(fromApi = false): Promise<void> {
    const lastRefresh = await this.lastRefreshService.getLastUpdate();

    if (!lastRefresh || fromApi || moment().diff(lastRefresh, 'minutes') > 20) {
      // Initially load players from Api
      console.log('🛑 No Date found, requesting from chess.com api');
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
