import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SaveModalComponent } from './save-modal/save-modal.component';
import { PlaylistStateService } from './services/playlist-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public playlistLength: number = 0;
  private playlistSubsc: Subscription = Subscription.EMPTY;

  constructor(
    public dialog: MatDialog,
    private playlistStateService: PlaylistStateService
  ) { }

  ngOnInit(): void {
    this.playlistSubsc = this.playlistStateService.playlist$.subscribe(
      playlistValue => {
        console.log('playlistValue', playlistValue);
        this.playlistLength = playlistValue.length;
      }
    )
  }

  public showPlaylist() {

  }
  // musi śledzić ilość pozycji w playliście



  public savePlaylist() {
    const playlist = this.playlistStateService.playlist$;
    this.openDialog(playlist);
  }

  private openDialog(playlist: any): void {
    const dialogRef = this.dialog.open(SaveModalComponent, {
      width: 'auto',
      data: { playlist$: playlist },
      panelClass: 'save-dialog'
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  ngOnDestroy(): void {
    this.playlistSubsc.unsubscribe();
  }

}
