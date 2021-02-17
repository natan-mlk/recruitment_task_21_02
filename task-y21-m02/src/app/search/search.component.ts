import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchService, SearchResult, PlaylistItem } from '../services/search.service';
import { debounceTime, delay, mergeMap } from 'rxjs/operators';
import { PlaylistStateService } from '../services/playlist-state.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {


  public searchForm = new FormGroup({
    searchValue: new FormControl()
  })
  public isSearchLoading: boolean = false;

  private currentSearchQuery = '';
  private currentSearchIndex = 0;
  private searchFormSubsc: Subscription = Subscription.EMPTY;
  private activeRouteSubsc: Subscription = Subscription.EMPTY;

  constructor(
    private searchService: SearchService,
    public playlistService: PlaylistStateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.subscribeToFormValue();
    this.subscribeToRouteActivated();
  }

  loadMore(): void {
    // this can also use a link under key "next"
    this.currentSearchIndex += 5;
    this.isLoadingState(true);
    this.searchService.getData(this.currentSearchQuery, this.currentSearchIndex).pipe(
      delay(1000)
      ).subscribe(
      (searchResult: SearchResult) => {
        this.addToPlaylistConditionally(searchResult);
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

  private subscribeToRouteActivated() {
    this.activeRouteSubsc = this.route.queryParams.subscribe(
      queryParams => {
        if (queryParams.search) {
          this.searchForm.get('searchValue')!.setValue(queryParams.search)
        }
      }
    )
  }

  private subscribeToFormValue() {
    this.searchFormSubsc = this.searchForm.get('searchValue')!.valueChanges.pipe(
      debounceTime(750),
      mergeMap(
        (formValue: string) => {
          this.isLoadingState(true);
          this.currentSearchIndex = 0;
          this.playlistService.clearSearchResults();
          this.currentSearchQuery = formValue;
          this.updateQueryParameters(this.currentSearchQuery);
          return this.searchService.getData(formValue, this.currentSearchIndex);
        }),
      debounceTime(1000), // to pretend longer responce in order to see loading feature better
    )
      .subscribe(
        (searchResult: SearchResult) => {
          this.addToPlaylistConditionally(searchResult);
        },
        error => {
          this.isLoadingState(false);
          this.snackBar.open('Server problem. Please reload app', undefined, { duration: 3000 })
          console.log('error', error)
        }
      )
  }

  private updateQueryParameters(param: string) {
    this.router.navigate([],
      {
        queryParams: {
          search: param
        },
        queryParamsHandling: 'merge'
      }
    );
  }

  private addToPlaylistConditionally(searchResult: SearchResult) {
    const playlistItems = JSON.parse(localStorage.getItem('playlistItemsArray')!) || [];
    const searchResults: PlaylistItem[] = searchResult.data;

    for (let singleResult of searchResults) {
      if (playlistItems.length) {
        let testResult: boolean;
        testResult = playlistItems.some((elem: any) => elem.id === singleResult.id);
        if (!testResult) {
          this.playlistService.addToSearchResults(singleResult);
        }
      } else {
        this.playlistService.addToSearchResults(singleResult);
      }
    }
    this.isLoadingState(false);
  }

  private isLoadingState(state: boolean) {
    this.isSearchLoading = state;
  }

  ngOnDestroy(): void {
    this.searchFormSubsc.unsubscribe();
    this.activeRouteSubsc.unsubscribe();
  }

}
