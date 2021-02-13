import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


  public reactiveForm = new FormGroup({
    searchValue: new FormControl()
  })

  public loadedItems: any;

  constructor(
    private searchService: SearchService
  ) {

  }

  ngOnInit(): void {
    this.reactiveForm.get('searchValue')!.valueChanges.pipe(
      mergeMap(
        (formValue: string) => {
          return this.searchService.getData(formValue);
        })
    )
      .subscribe(
        searchVal => {
          console.log('value of search', searchVal)
          this.loadedItems= searchVal.data;
        }
      )
  }


}

// album: {id: 58954762, title: "Platinum", cover: "https://api.deezer.com/album/58954762/image", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/5c465…9550bf102026bcacfc67f6dac/56x56-000000-80-0-0.jpg", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/5c465…50bf102026bcacfc67f6dac/250x250-000000-80-0-0.jpg", …}
// artist: {id: 1479842, name: "PLK", link: "https://www.deezer.com/artist/1479842", picture: "https://api.deezer.com/artist/1479842/image", picture_small: "https://e-cdns-images.dzcdn.net/images/artist/b846…7886351fd9ca74b9802239b8e/56x56-000000-80-0-0.jpg", …}
// duration: 198
// explicit_content_cover: 2
// explicit_content_lyrics: 1
// explicit_lyrics: true
// id: 472899552
// link: "https://www.deezer.com/track/472899552"
// md5_image: "5c4650e9550bf102026bcacfc67f6dac"
// preview: "https://cdns-preview-7.dzcdn.net/stream/c-7fd754d6172ab19e9d3e8a7496f0c061-5.mp3"
// rank: 667322
// readable: true
// title: "A A A"
// title_short: "A A A"
// title_version: ""
// type: "track"
