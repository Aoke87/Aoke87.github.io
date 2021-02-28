import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendI } from '../interface/friend';
import { FriendsService } from '../service/friends/friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  public friends: FriendI[] = [];

  constructor(
    private friendsService: FriendsService
  ) { }

  ngOnInit(): void {
    this.friendsService.fetchChessPlayerByName('cyfer777')
      .subscribe(
        (friend: FriendI) => { 
          // const headers = response.headers.keys().map(
          //   key => `${key}: ${response.headers.get(key)}`
          // );
          // const friend: FriendI|null = response.body;

          // console.log(headers);
          // if ( !friend ) { return };
          this.friends.push({ ...friend });
        }
      )
  }

  getChessPlayer(name: string) {

  }

}
