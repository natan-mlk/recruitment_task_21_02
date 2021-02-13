import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlaylistItem } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistStateService {

  private readonly playlist: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  readonly playlist$ = this.playlist.asObservable();

  get playlistItems(): any[] {
    return this.playlist.getValue();
  }
  set playlistItems(val: any[]) {
    this.playlist.next(val);
  }


  addToPlaylist(playlistItem: PlaylistItem): void {
    this.playlistItems = [
      ...this.playlistItems, 
      playlistItem
    ];
  }

  removeFromPlaylist(id: number): void {
    this.playlistItems = this.playlistItems.filter(item => item.id !== id);
  }

  constructor() { }
}
