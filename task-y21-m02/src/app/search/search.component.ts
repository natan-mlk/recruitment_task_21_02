import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchService, SearchResult, PlaylistItem } from '../services/search.service';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { PlaylistStateService } from '../services/playlist-state.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {


  public searchForm = new FormGroup({
    searchValue: new FormControl()
  })
  public loadedItems: PlaylistItem[] | any; // pozbyć się tego? Może jeszcze się przyda potem
  public isSearchLoading: boolean = false;

  private currentSearchQuery = '';
  private currentSearchIndex = 0;
  private searchFormSubsc: Subscription = Subscription.EMPTY;
  private activeRouteSubsc: Subscription = Subscription.EMPTY;

  constructor(
    private searchService: SearchService,
    public playlistService: PlaylistStateService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscribeToFormValue();
    this.subscribeToRouteActivated();
  }

  loadMore(): void {
    // to też może korzystać z linka pod kluczem "next"
    this.currentSearchIndex += 5;
    this.searchService.getData(this.currentSearchQuery, this.currentSearchIndex).subscribe(
      (searchVal: SearchResult) => {
        const resultsArray: PlaylistItem[] = searchVal.data;
        for (let sinleResult of resultsArray) {
          this.playlistService.addToSearchResults(sinleResult);
        }
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
      debounceTime(750), // to prevent too many requests on fast typing input
      mergeMap(
        (formValue: string) => {
          this.isSearchLoading = true;
          this.currentSearchIndex = 0;
          this.loadedItems = [];
          this.playlistService.clearSearchResults();
          this.currentSearchQuery = formValue;
          this.updateQueryParameters(this.currentSearchQuery);
          return this.searchService.getData(formValue, this.currentSearchIndex);
        }),
      debounceTime(1000), // to pretend longer responce in order to see loading feature better
    )
      .subscribe(
        (searchResult: SearchResult) => {
          this.loadedItems = searchResult.data;
          for (let singleResult of searchResult.data) {
            this.playlistService.addToSearchResults(singleResult);
          }
          this.isSearchLoading = false;
        },
        error => console.log('error', error)
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

  ngOnDestroy(): void {
    this.searchFormSubsc.unsubscribe();
    this.activeRouteSubsc.unsubscribe();
  }

}
