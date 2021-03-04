import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendsService } from '../service/friends/friends.service';
import { ChessPlayer, ChessPlayerProfileApiResponse} from '../interface/player.interface';
import { MatchesService as MatchesDbService } from '../api/matches.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  public friends: ChessPlayer[] = [];

  constructor(
    private friendsService: FriendsService,
    private matchesDbService: MatchesDbService
  ) { }

  ngOnInit(): void {
    this.friendsService.loadFriends();
    this.friendsService.friends.subscribe((friend: ChessPlayer) => { this.friends.push({ ...friend }); });
    // this.matchesDbService.getMonthMatches('cyfer777');
  }

  public reload(): void {
    this.friendsService.loadFriends(true);
  }

}
