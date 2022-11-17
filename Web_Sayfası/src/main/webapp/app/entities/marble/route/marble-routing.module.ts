import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MarbleComponent } from '../list/marble.component';
import { MarbleDetailComponent } from '../detail/marble-detail.component';
import { MarbleUpdateComponent } from '../update/marble-update.component';
import { MarbleRoutingResolveService } from './marble-routing-resolve.service';

const marbleRoute: Routes = [
  {
    path: '',
    component: MarbleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MarbleDetailComponent,
    resolve: {
      marble: MarbleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MarbleUpdateComponent,
    resolve: {
      marble: MarbleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MarbleUpdateComponent,
    resolve: {
      marble: MarbleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(marbleRoute)],
  exports: [RouterModule],
})
export class MarbleRoutingModule {}
