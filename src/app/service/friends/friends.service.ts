import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FriendI } from 'src/app/interface/friend';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(
    private http: HttpClient
  ) { }

  getChessPlayer(name: string) {
    this.fetchChessPlayerByName(name);
  }

  public fetchChessPlayerByName(name: string): Observable<FriendI> {
    return this.http.get<FriendI>(`https://api.chess.com/pub/player/${name}`)
    .pipe(
      tap(        
        data => console.log('tap', data),
        error => console.log('error: ', error)
      ),
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
