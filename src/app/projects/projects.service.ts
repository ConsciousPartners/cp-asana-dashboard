import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { IProjects } from './projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + environment.apikey
    })
  };

  private _asanaBaseUrl = 'https://app.asana.com/api/1.0';
  private _asanaUrl = '/teams/' + environment.teamId + '/projects?opt_expand=owner&limit=100';

  constructor(private _http: HttpClient) { }

  getProjects(): Observable<IProjects[]> {
    return this._http.get<IProjects[]>(this._asanaBaseUrl + this._asanaUrl, this.httpOptions)
    .pipe(
      tap(projects => console.log('Fetched projects'))
    );
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
