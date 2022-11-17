import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SellerComponent } from '../list/seller.component';
import { SellerDetailComponent } from '../detail/seller-detail.component';
import { SellerUpdateComponent } from '../update/seller-update.component';
import { SellerRoutingResolveService } from './seller-routing-resolve.service';

const sellerRoute: Routes = [
  {
    path: '',
    component: SellerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SellerDetailComponent,
    resolve: {
      seller: SellerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SellerUpdateComponent,
    resolve: {
      seller: SellerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SellerUpdateComponent,
    resolve: {
      seller: SellerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sellerRoute)],
  exports: [RouterModule],
})
export class SellerRoutingModule {}
