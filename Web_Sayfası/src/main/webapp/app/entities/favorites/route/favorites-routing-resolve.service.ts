import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFavorites, Favorites } from '../favorites.model';
import { FavoritesService } from '../service/favorites.service';

@Injectable({ providedIn: 'root' })
export class FavoritesRoutingResolveService implements Resolve<IFavorites> {
  constructor(protected service: FavoritesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFavorites> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((favorites: HttpResponse<Favorites>) => {
          if (favorites.body) {
            return of(favorites.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Favorites());
  }
}
