import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SaveModalComponent } from './save-modal/save-modal.component';
import { PlaylistStateService } from './services/playlist-state.service';
import { CardsVisibilityMobileService } from './services/panels-visibility-mobile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public playlistLength: number = 0;
  private playlistSubsc: Subscription = Subscription.EMPTY;
  private panelsVisibilitySubsc: Subscription = Subscription.EMPTY;


  @ViewChild('playlistComponent', { read: ElementRef }) playlistComponent: ElementRef;
  @ViewChild('searchComponent', { read: ElementRef }) searchComponent: ElementRef;
  @ViewChild('showButton', { read: ElementRef }) showButton: ElementRef;

  constructor(
    public dialog: MatDialog,
    private playlistStateService: PlaylistStateService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    private cardsVisibilityService: CardsVisibilityMobileService
  ) {

  }

  ngOnInit(): void {
    this.playlistStateService.initPlaylistFromSessionStorage();
    this.playlistSubsc = this.playlistStateService.playlist$.subscribe(
      playlistValue => {
        this.playlistLength = playlistValue.length;
      }
    )
    this.panelsVisibilitySubsc = this.cardsVisibilityService.change$.subscribe(
      (isPlaylistVisible: boolean) => {
        this.setVisibilityOfCards(isPlaylistVisible);
      }
    )
  }

  public showPlaylist() {
    this.cardsVisibilityService.openPlaylist(true);
  }

  public savePlaylist() {
    const playlist = this.playlistStateService.playlist$;
    this.openDialog(playlist);
  }

  private setVisibilityOfCards(isPlaylistVisible: boolean) {
    if (isPlaylistVisible) {
      this.renderer.addClass(
        this.playlistComponent.nativeElement, 'mobile-visible'
      )
      this.renderer.addClass(
        this.searchComponent.nativeElement, 'mobile-hidden'
      )
      this.renderer.addClass(
        this.showButton.nativeElement, 'mobile-hidden'
      )
    } else {
      if (this.playlistComponent) {
        this.renderer.removeClass(
          this.playlistComponent.nativeElement, 'mobile-visible'
        )
        this.renderer.removeClass(
          this.searchComponent.nativeElement, 'mobile-hidden'
        )
        this.renderer.removeClass(
          this.showButton.nativeElement, 'mobile-hidden'
        )
      }
    }
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
    this.panelsVisibilitySubsc.unsubscribe();
  }

}
