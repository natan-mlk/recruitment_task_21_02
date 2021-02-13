import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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


  addToPlaylist(playlistItem: any) {
    this.playlistItems = [
      ...this.playlistItems, 
      playlistItem
    ];
  }

  removeFromPlaylist(id: number) {
    this.playlistItems = this.playlistItems.filter(todo => todo.id !== id);
  }

  constructor() { }
}
