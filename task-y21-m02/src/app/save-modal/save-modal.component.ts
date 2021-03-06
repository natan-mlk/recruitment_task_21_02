import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { PlaylistItem } from '../services/search.service';

interface exportedFileData {
  name: string,
  email: string,
  playlist: PlaylistItem[]
}

@Component({
  selector: 'app-save-modal',
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.scss']
})
export class SaveModalComponent implements OnInit {

  public savePlaylistForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
    email: ['', [Validators.required, Validators.email]],
  })

  get name() { return this.savePlaylistForm.get('name'); }
  get email() { return this.savePlaylistForm.get('email'); }

  public isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SaveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { playlist$: any },
    private formBuilder: FormBuilder) { }

  ngOnInit(): void { }

  savePlaylist(): void {
    this.isLoading = true;
    this.savePlaylistForm.disable();
    let playlistJsonData = '';
    this.data.playlist$.pipe(
      debounceTime(1500)
    )
      .subscribe(
        (playlist: PlaylistItem[]) => {
          playlistJsonData = JSON.stringify(playlist);
          const exportedFileData: exportedFileData = {
            name: this.savePlaylistForm.get('name')!.value,
            email: this.savePlaylistForm.get('email')!.value,
            playlist: playlist
          };
          const exportedFileDataJson = JSON.stringify(exportedFileData);
          const blob = new Blob([exportedFileDataJson], { type: "text/plain;charset=utf-8" });
          saveAs(blob, exportedFileData.name + ".txt");
          this.isLoading = false;
          this.dialogRef.close(true);
        }
      )
  }

  closeModal() {
    this.dialogRef.close(false);
  }
}
