import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SellerComponent } from './list/seller.component';
import { SellerDetailComponent } from './detail/seller-detail.component';
import { SellerUpdateComponent } from './update/seller-update.component';
import { SellerDeleteDialogComponent } from './delete/seller-delete-dialog.component';
import { SellerRoutingModule } from './route/seller-routing.module';

@NgModule({
  imports: [SharedModule, SellerRoutingModule],
  declarations: [SellerComponent, SellerDetailComponent, SellerUpdateComponent, SellerDeleteDialogComponent],
  entryComponents: [SellerDeleteDialogComponent],
})
export class SellerModule {}
