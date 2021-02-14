import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-save-modal',
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.scss']
})
export class SaveModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SaveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {album: string}) {}

  ngOnInit(): void {
  }

}
