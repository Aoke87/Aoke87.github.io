import { Injectable } from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const DATA_BASE_NAME_UPDATE = 'updates';

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
    console.log('Last Database update has been', dayjs(lastUpdate.date).fromNow());
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
