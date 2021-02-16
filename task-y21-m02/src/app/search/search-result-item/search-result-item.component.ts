import { Component, Input, OnInit } from '@angular/core';
import { PlaylistItem } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.scss']
})
export class SearchResultItemComponent implements OnInit {

  @Input() item: PlaylistItem; 
  @Input() isSearchResult: boolean;
  
  constructor() { 
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

  removeItem():void {}

}
