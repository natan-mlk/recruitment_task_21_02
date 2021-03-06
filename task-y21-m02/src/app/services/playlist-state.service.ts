import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlaylistItem } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistStateService {

  private readonly playlist: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private readonly searchResultsList: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  readonly playlist$ = this.playlist.asObservable();
  readonly searchResultsList$ = this.searchResultsList.asObservable();


  get playlistItems(): PlaylistItem[] {
    return this.playlist.getValue();
  }
  set playlistItems(val: PlaylistItem[]) {
    this.playlist.next(val);
  }

  get searchListItems(): PlaylistItem[] {
    return this.searchResultsList.getValue();
  }
  set searchListItems(val: PlaylistItem[]) {
    this.searchResultsList.next(val);
  }

  addToPlaylist(playlistItem: PlaylistItem): void {
    this.playlistItems = [
      ...this.playlistItems,
      playlistItem
    ];
    localStorage.setItem('playlistItemsArray', JSON.stringify(this.playlistItems));
  }

  initPlaylistFromSessionStorage() {
    const oldItemsArray = JSON.parse(localStorage.getItem('playlistItemsArray')!) || [];
    console.log('Storage State after parse', oldItemsArray)
    this.playlistItems = oldItemsArray;
  }

  removeFromPlaylist(id: number): void {
    this.playlistItems = this.playlistItems.filter(item => item.id !== id);
    localStorage.clear();
    localStorage.setItem('playlistItemsArray', JSON.stringify(this.playlistItems));
  }

  addToSearchResults(singleResult: PlaylistItem): void {
    this.searchListItems = [
      ...this.searchListItems,
      singleResult
    ]
  }

  removeFromSearchResults(id: number): void {
    this.searchListItems = this.searchListItems.filter(item => item.id !== id);
  }

  clearSearchResults(): void {
    this.searchListItems = [];
  }

  constructor() { }
}
