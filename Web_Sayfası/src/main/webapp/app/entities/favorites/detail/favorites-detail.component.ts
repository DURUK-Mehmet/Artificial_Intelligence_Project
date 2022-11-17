import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFavorites } from '../favorites.model';

@Component({
  selector: 'jhi-favorites-detail',
  templateUrl: './favorites-detail.component.html',
})
export class FavoritesDetailComponent implements OnInit {
  favorites: IFavorites | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ favorites }) => {
      this.favorites = favorites;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
