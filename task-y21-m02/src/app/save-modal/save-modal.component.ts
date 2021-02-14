import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-save-modal',
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.scss']
})
export class SaveModalComponent implements OnInit, OnDestroy {

  public savePlaylistForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  })

  get name() { return this.savePlaylistForm.get('name'); }
  get email() { return this.savePlaylistForm.get('email'); }

  private formSubsc: Subscription = Subscription.EMPTY;

  constructor(
    public dialogRef: MatDialogRef<SaveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { playlist$: any },
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this.subscribeToFormValue();
    console.log('THIS FORM', this.savePlaylistForm)
  }

  savePlaylist() {
    console.log('FORM VLUE',this.savePlaylistForm.value)
    let playlistJsonData='';
    this.data.playlist$.pipe(
      debounceTime(1500)
    )
    .subscribe(
      (playlist: any) => {
        playlistJsonData = JSON.stringify(playlist);
        console.log('jsonData', playlistJsonData)
        const blob = new Blob([playlistJsonData], { type: "text/plain;charset=utf-8" });
        // saveAs(blob, "playlist.txt");
        this.dialogRef.close();
      }
    )
  }

  // private subscribeToFormValue() {
  //   this.formSubsc = this.savePlaylistForm.get('searchValue')!.valueChanges.pipe(
  //     debounceTime(1000), // to prevent too many requests on fast typing input
  //     mergeMap(
  //       (formValue: string) => {
  //         this.isSearchLoading = true;
  //         this.currentSearchIndex = 0;
  //         this.loadedItems = [];
  //         this.playlistService.clearSearchResults();
  //         this.currentSearchQuery = formValue;
  //         return this.searchService.getData(formValue, this.currentSearchIndex);
  //       }),
  //       debounceTime(750), // to pretend longer responce in order to see loading feature better
  //   )
  //     .subscribe(
  //       (searchResult: SearchResult) => {
  //         console.log('value of search', searchResult)
  //         this.loadedItems = searchResult.data;
  //         for (let singleResult of searchResult.data) {
  //           this.playlistService.addToSearchResults(singleResult);
  //         }
  //         this.isSearchLoading = false;
  //       },
  //       error => console.log('TU OBSŁUGA MOJEGO BŁĘDU', error)
  //     )
  // }

  ngOnDestroy(): void{
    this.formSubsc.unsubscribe();
  }
}
