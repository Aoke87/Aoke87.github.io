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
    this.friendsService.friends
      .subscribe((friend: ChessPlayer) => {
        console.log(friend);
        this.friends.push({ ...friend });
      });

    this.friendsService.fetchChessPlayerByName('ProfGurke');
    this.friendsService.fetchChessPlayerByName('Kong1436');
    this.friendsService.fetchChessPlayerByName('strike_777');
    this.friendsService.fetchChessPlayerByName('cyfer777');
    this.friendsService.fetchChessPlayerByName('Mathino');
    this.friendsService.fetchChessPlayerByName('bolli8');
  }

}
