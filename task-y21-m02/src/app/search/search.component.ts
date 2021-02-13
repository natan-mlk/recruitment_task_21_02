import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchService, SearchResult, PlaylistItem } from '../services/search.service';
import { debounceTime, mergeMap } from 'rxjs/operators';
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
  public loadedItems: PlaylistItem[] | any; // pozbyć się tego? Może jeszcze się przyda potem
  public isSearchLoading: boolean = false;

  private currentSearchQuery = '';
  private currentSearchIndex = 0;

  constructor(
    private searchService: SearchService,
    public playlistService: PlaylistStateService
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

        for (let sinleResult of resultsArray) {
          this.playlistService.addToSearchResults(sinleResult);
        }

        // resultsArray.forEach((element: PlaylistItem) => {
        //   this.loadedItems.push(element)
        // });
      }
    )
  }

  addToPlaylist(item: PlaylistItem): void {
    this.playlistService.addToPlaylist(
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
    this.playlistService.removeFromSearchResults(item.id);
  }

  private subscribeToFormValue() {
    this.reactiveForm.get('searchValue')!.valueChanges.pipe(
      debounceTime(1000), // to prevent too many requests on fast typing input
      mergeMap(
        (formValue: string) => {
          this.isSearchLoading = true;
          this.currentSearchIndex = 0;
          this.loadedItems = [];
          this.playlistService.clearSearchResults();
          this.currentSearchQuery = formValue;
          return this.searchService.getData(formValue, this.currentSearchIndex);
        }),
        debounceTime(750), // to pretend longer responce in order to see loading feature better
    )
      .subscribe(
        (searchResult: SearchResult) => {
          console.log('value of search', searchResult)
          this.loadedItems = searchResult.data;
          for (let singleResult of searchResult.data) {
            this.playlistService.addToSearchResults(singleResult);
          }
          this.isSearchLoading = false;
        },
        error => console.log('TU OBSŁUGA MOJEGO BŁĘDU', error)
      )
  }


}
