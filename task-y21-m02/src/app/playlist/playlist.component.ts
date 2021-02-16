import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardsVisibilityMobileService } from '../services/panels-visibility-mobile.service';
import { PlaylistStateService } from '../services/playlist-state.service';
import { PlaylistItem } from '../services/search.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  // private playlistSubsc: Subscription = Subscription.EMPTY;

  constructor(
    public playlistService: PlaylistStateService,
    private cardsVisibilityService: CardsVisibilityMobileService

  ) { }

  public closeOnMobileView(): void {
    this.cardsVisibilityService.openPlaylist(false);
  }

  ngOnInit(): void {
    // this.playlistSubsc = this.playlistService.playlist$.subscribe(
    //   playlistValue => {
    //     // console.log('laylistVal', playlistValue)
    //   }
    // )
  }



  ngOnDestroy(): void {
    // this.playlistSubsc.unsubscribe();
  }

}
