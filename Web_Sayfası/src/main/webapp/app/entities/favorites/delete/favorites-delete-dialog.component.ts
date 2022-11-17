import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFavorites } from '../favorites.model';
import { FavoritesService } from '../service/favorites.service';

@Component({
  templateUrl: './favorites-delete-dialog.component.html',
})
export class FavoritesDeleteDialogComponent {
  favorites?: IFavorites;

  constructor(protected favoritesService: FavoritesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.favoritesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
