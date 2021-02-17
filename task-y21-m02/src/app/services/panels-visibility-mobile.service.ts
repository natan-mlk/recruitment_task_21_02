import { Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardsVisibilityMobileService {

  private readonly isPlaylistVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() change$: Observable<boolean> = this.isPlaylistVisible.asObservable();
  public openPlaylist(isPlaylistVisible: boolean) {
    this.isPlaylistVisible.next(isPlaylistVisible);
  }

  constructor() { }
}
