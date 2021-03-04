import { Injectable } from '@angular/core';
import {DATA_BASE_NAME_UPDATE} from '../service/friends/friends.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class LastRefreshService {

  constructor(
    private dbService: NgxIndexedDBService
  ) { }

  public async getLastUpdate(): Promise<Date|null>
  {
    const lastUpdate = await this.dbService.getByKey(DATA_BASE_NAME_UPDATE, 1).toPromise();
    if (!lastUpdate) { return null; }
    return lastUpdate.date;
  }

  public async refresh(): Promise<void>
  {
    try {
      const lastUpdate = await this.getLastUpdate();
      if (lastUpdate) {
        await this.dbService.update(DATA_BASE_NAME_UPDATE, { date: new Date(), id: 1 });
      } else {
        await this.dbService.add(DATA_BASE_NAME_UPDATE, { date: new Date()});
      }
      console.log('✅ Database refreshed');
    } catch (e) {
      console.log('‼️ An Error occured updating Date', e);
    }
  }
}
