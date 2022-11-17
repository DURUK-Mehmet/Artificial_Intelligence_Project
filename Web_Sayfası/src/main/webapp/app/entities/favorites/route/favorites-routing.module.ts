import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FavoritesComponent } from '../list/favorites.component';
import { FavoritesDetailComponent } from '../detail/favorites-detail.component';
import { FavoritesUpdateComponent } from '../update/favorites-update.component';
import { FavoritesRoutingResolveService } from './favorites-routing-resolve.service';

const favoritesRoute: Routes = [
  {
    path: '',
    component: FavoritesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FavoritesDetailComponent,
    resolve: {
      favorites: FavoritesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FavoritesUpdateComponent,
    resolve: {
      favorites: FavoritesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FavoritesUpdateComponent,
    resolve: {
      favorites: FavoritesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(favoritesRoute)],
  exports: [RouterModule],
})
export class FavoritesRoutingModule {}
