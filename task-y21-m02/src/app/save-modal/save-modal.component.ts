import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-save-modal',
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.scss']
})
export class SaveModalComponent implements OnInit {

  public savePlaylistForm = new FormGroup({
    playlistName: new FormControl(),
    email: new FormControl()
  })
  
  constructor(
    public dialogRef: MatDialogRef<SaveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { playlist$: any }) { }

  ngOnInit(): void {

  }

  savePlaylist() {
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
}
