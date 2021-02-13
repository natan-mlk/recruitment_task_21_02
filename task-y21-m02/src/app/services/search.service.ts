import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface SearchResult {
  data: Array<PlaylistItem>,
  next: string
}

export interface PlaylistItem {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  album: {
    cover_small: string
  }
}

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

  private options = {
    headers: {
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      "x-rapidapi-key": "2b8c48bfefmshdc5ae752139a51fp150905jsnd66c041066a9"
    },
    params: {
      "q": "",
      "limit": "5",
      "index": "0"
    }
  };

  private url = 'https://deezerdevs-deezer.p.rapidapi.com/search';

  constructor(private http: HttpClient) { }


  getData(param: string, index: number): Observable<SearchResult> {
    this.passQueryParams(param, index);
    return this.http.get<SearchResult>(this.url, this.options);
  }

  private passQueryParams(param: string, index: number) {
    this.options.params.q = param;
    this.options.params.index = index.toString();
  }

}
