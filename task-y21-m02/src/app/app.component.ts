import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private playlistStateService: PlaylistStateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.playlistStateService.initPlaylistFromSessionStorage();
    this.playlistSubsc = this.playlistStateService.playlist$.subscribe(
      playlistValue => {
        this.playlistLength = playlistValue.length;
      }
    )
  }

  public showPlaylist() {
    // musi śledzić ilość pozycji w playliście
  }

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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Successfully saved playlist', undefined, { duration: 3000 })
      }
    });
  }

  ngOnDestroy(): void {
    this.playlistSubsc.unsubscribe();
  }

}
