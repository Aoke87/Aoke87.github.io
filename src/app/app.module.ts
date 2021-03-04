import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FriendsComponent } from './friends/friends.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { DATA_BASE_NAME_UPDATE, DATA_BASE_NAME_FRIENDS } from './service/friends/friends.service';

const dbConfig: DBConfig  = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [{
    store: DATA_BASE_NAME_FRIENDS,
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'avatar', keypath: 'avatar', options: { unique: false } },
      { name: 'player_id', keypath: 'player_id', options: { unique: true } },
      { name: 'url', keypath: 'url', options: { unique: false } },
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'username', keypath: 'username', options: { unique: true } },
      { name: 'followers', keypath: 'followers', options: { unique: false } },
      { name: 'country', keypath: 'country', options: { unique: false } },
      { name: 'location', keypath: 'location', options: { unique: false } },
      { name: 'last_online', keypath: 'last_online', options: { unique: false } },
      { name: 'joined', keypath: 'joined', options: { unique: false } },
      { name: 'status', keypath: 'status', options: { unique: false } },
      { name: 'is_streamer', keypath: 'is_streamer', options: { unique: false } },
    ]
  },
    {
      store: DATA_BASE_NAME_UPDATE,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'date', keypath: 'date', options: { unique: false } },
      ]
    }]
};

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FriendsComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
