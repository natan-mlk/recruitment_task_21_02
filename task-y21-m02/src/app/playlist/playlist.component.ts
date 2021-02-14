import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlaylistStateService } from '../services/playlist-state.service';
import { PlaylistItem } from '../services/search.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  private playlistSubsc: Subscription = Subscription.EMPTY;

  constructor(
    public playlistService: PlaylistStateService

  ) { }

  ngOnInit(): void {
    this.playlistSubsc = this.playlistService.playlist$.subscribe(
      playlistValue => {
        // console.log('laylistVal', playlistValue)
      }
    )
  }

  removeFromList(id: number, item: PlaylistItem){
      this.playlistService.removeFromPlaylist(id);
      this.playlistService.addToSearchResults(
        { title: item.title,
          artist: {
            name: item.artist.name,
          },
          album: {
            cover_small: item.album.cover_small
          },
          id: item.id
        }
      );
  }

  ngOnDestroy(): void{
    this.playlistSubsc.unsubscribe();
  }

}
