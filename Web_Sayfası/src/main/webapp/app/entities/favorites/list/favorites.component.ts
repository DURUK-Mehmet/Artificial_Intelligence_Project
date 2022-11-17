import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFavorites } from '../favorites.model';
import { FavoritesService } from '../service/favorites.service';
import { FavoritesDeleteDialogComponent } from '../delete/favorites-delete-dialog.component';

@Component({
  selector: 'jhi-favorites',
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent implements OnInit {
  favorites?: IFavorites[];
  isLoading = false;

  constructor(protected favoritesService: FavoritesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.favoritesService.query().subscribe({
      next: (res: HttpResponse<IFavorites[]>) => {
        this.isLoading = false;
        this.favorites = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFavorites): number {
    return item.id!;
  }

  delete(favorites: IFavorites): void {
    const modalRef = this.modalService.open(FavoritesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.favorites = favorites;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
