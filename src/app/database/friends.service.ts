import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ChessPlayer } from '../interface/player.interface';
import { DATA_BASE_NAME_FRIENDS } from '../service/friends/friends.service';
import {LastRefreshService} from './last-refresh.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(
    private dbService: NgxIndexedDBService,
    private lastRefreshService: LastRefreshService
  ) { }

  public async getAll(): Promise<ChessPlayer[]> {
    return this.dbService.getAll(DATA_BASE_NAME_FRIENDS).toPromise();
  }

  public async add(apiFriend: ChessPlayer): Promise<void>
  {
    const friend = await this.dbService.getByIndex(DATA_BASE_NAME_FRIENDS, 'username', apiFriend.username).toPromise();
    if (friend) {
      await this.dbService.update(DATA_BASE_NAME_FRIENDS, { id: friend.id, ...apiFriend }).toPromise();
    } else {
      this.dbService.add(DATA_BASE_NAME_FRIENDS, { ...apiFriend });
    }
    this.lastRefreshService.refresh();
  }
}
