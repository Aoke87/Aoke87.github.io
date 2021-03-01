import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendsService } from '../service/friends/friends.service';
import {ChessPlayer, ChessPlayerProfileApiResponse} from '../interface/player.interface';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  public friends: ChessPlayer[] = [];

  constructor(
    private friendsService: FriendsService
  ) { }

  ngOnInit(): void {
    this.friendsService.loadFriends();
    this.friendsService.friends
      .subscribe((friend: ChessPlayer) => { this.friends.push({ ...friend }); });
  }

  public reload(): void {
    this.friendsService.loadFriends(true);
  }

}
