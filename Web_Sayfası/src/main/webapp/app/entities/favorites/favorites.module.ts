import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FavoritesComponent } from './list/favorites.component';
import { FavoritesDetailComponent } from './detail/favorites-detail.component';
import { FavoritesUpdateComponent } from './update/favorites-update.component';
import { FavoritesDeleteDialogComponent } from './delete/favorites-delete-dialog.component';
import { FavoritesRoutingModule } from './route/favorites-routing.module';

@NgModule({
  imports: [SharedModule, FavoritesRoutingModule],
  declarations: [FavoritesComponent, FavoritesDetailComponent, FavoritesUpdateComponent, FavoritesDeleteDialogComponent],
  entryComponents: [FavoritesDeleteDialogComponent],
})
export class FavoritesModule {}
