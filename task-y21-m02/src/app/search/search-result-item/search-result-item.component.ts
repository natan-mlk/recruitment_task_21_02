import { Component, Input, OnInit } from '@angular/core';
import { PlaylistItem } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.scss']
})
export class SearchResultItemComponent implements OnInit {

  @Input() item: any; 
  constructor() { }

  ngOnInit(): void {
  }

}
