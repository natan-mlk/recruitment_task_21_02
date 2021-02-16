import { Component, Input, OnInit } from '@angular/core';
import { PlaylistStateService } from 'src/app/services/playlist-state.service';
import { PlaylistItem } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.scss']
})
export class SearchResultItemComponent implements OnInit {

  @Input() item: PlaylistItem;
  @Input() isSearchResult: boolean;

  constructor(
    public playlistService: PlaylistStateService
  ) {
    this.isSearchResult = false;
    this.item = {
      id: 0,
      title: 'string',
      artist: {
        name: 'string',
      },
      album: {
        cover_small: 'string'
      }
    };
  }

  ngOnInit(): void {
  }

  removeFromList(): void {
    const item = this.item;
    this.playlistService.removeFromPlaylist(item.id);
    this.playlistService.addToSearchResults(
      {
        title: item.title,
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
}
