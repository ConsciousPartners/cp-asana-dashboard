import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { ITasks } from './tasks';

@Injectable({
  providedIn: 'root'
})

export class TasksService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + environment.apikey
    })
  };

  private _asanaBaseUrl = 'https://app.asana.com/api/1.0/projects/';
  private _asanaUrl = '/tasks?opt_expand=completed,name,due_on,due_at&limit=100';

  constructor(private _http: HttpClient) { }

  getTasks(projectId): Observable<ITasks[]> {
    return this._http.get<ITasks[]>(this._asanaBaseUrl + projectId + this._asanaUrl, this.httpOptions);
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `An error occurred: ${err.error.message}`;
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}
