import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaveModalComponent } from './save-modal/save-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'task-y21-m02';

  constructor(
    public dialog: MatDialog
    ) { }

  public showPlaylist(){
    
  }



  public savePlaylist(){
    // wziąć dane z playlisty
    // otworzyć modal i przekazać mu te dane
    this.openDialog();
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(SaveModalComponent, {
      width: 'auto',
      data: {album: 'test'},
      panelClass: 'save-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
