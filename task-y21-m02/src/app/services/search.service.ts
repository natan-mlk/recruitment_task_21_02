import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // options = {
  //   headers?: HttpHeaders | {[header: string]: string | string[]},
  //   observe?: 'body' | 'events' | 'response',
  //   params?: HttpParams|{[param: string]: string | string[]},
  //   reportProgress?: boolean,
  //   responseType?: 'arraybuffer'|'blob'|'json'|'text',
  //   withCredentials?: boolean,
  // }

  options = {
    headers: {
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      "x-rapidapi-key": "2b8c48bfefmshdc5ae752139a51fp150905jsnd66c041066a9"
    },
    params: { 
      "q": "",
      "limit": "5" }
  };

  url = 'https://deezerdevs-deezer.p.rapidapi.com/search';
  constructor(private http: HttpClient) { }


  getData(param: string): Observable<any> {
    this.passQueryParams(param);
    return this.http.get(this.url, this.options);
  }

  private passQueryParams(param: string) {
    this.options.params.q = param
  }

}
