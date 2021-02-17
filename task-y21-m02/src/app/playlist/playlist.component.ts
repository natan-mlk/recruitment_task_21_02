import { Component, OnInit } from '@angular/core';
import { CardsVisibilityMobileService } from '../services/panels-visibility-mobile.service';
import { PlaylistStateService } from '../services/playlist-state.service';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html'
})
export class PlaylistComponent implements OnInit {

  constructor(
    public playlistService: PlaylistStateService,
    private cardsVisibilityService: CardsVisibilityMobileService
  ) { }

  public closeOnMobileView(): void {
    this.cardsVisibilityService.openPlaylist(false);
  }

  ngOnInit(): void { }

}
