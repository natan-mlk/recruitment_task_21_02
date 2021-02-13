import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchService, SearchResult, PlaylistItem } from '../services/search.service';
import { mergeMap } from 'rxjs/operators';
import { PlaylistStateService } from '../services/playlist-state.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


  public reactiveForm = new FormGroup({
    searchValue: new FormControl()
  })
  public loadedItems: PlaylistItem[] | any;

  private currentSearchQuery = '';
  private currentSearchIndex = 0;

  constructor(
    private searchService: SearchService,
    private playlistService: PlaylistStateService
  ) {

  }

  ngOnInit(): void {
    this.subscribeToFormValue();
  }

  loadMore(): void {
    // to też może korzystać z linka pod kluczem "next"
    this.currentSearchIndex += 5;
    this.searchService.getData(this.currentSearchQuery, this.currentSearchIndex).subscribe(
      (searchVal: SearchResult) => {
        console.log('value of search', searchVal);
        const resultsArray: PlaylistItem[] = searchVal.data;
        resultsArray.forEach((element: PlaylistItem) => {
          this.loadedItems.push(element)
        });
      }
    )
  }

  addToPlaylist(item: PlaylistItem): void{
    this.playlistService.addToPlaylist(
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

  private subscribeToFormValue(){
    this.reactiveForm.get('searchValue')!.valueChanges.pipe(
      mergeMap(
        (formValue: string) => {
          this.currentSearchIndex = 0;
          this.loadedItems = [];
          this.currentSearchQuery = formValue;
          return this.searchService.getData(formValue, this.currentSearchIndex);
        })
    )
      .subscribe(
        (searchVal: SearchResult) => {
          console.log('value of search', searchVal)
          this.loadedItems= searchVal.data;
          console.log('this.loadedItems', this.loadedItems)
        },
        error => console.log('TU OBSŁUGA MOJEGO BŁĘDU', error)
      )
  }


}
