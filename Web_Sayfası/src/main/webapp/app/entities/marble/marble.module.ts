import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MarbleComponent } from './list/marble.component';
import { MarbleDetailComponent } from './detail/marble-detail.component';
import { MarbleUpdateComponent } from './update/marble-update.component';
import { MarbleDeleteDialogComponent } from './delete/marble-delete-dialog.component';
import { MarbleRoutingModule } from './route/marble-routing.module';

@NgModule({
  imports: [SharedModule, MarbleRoutingModule],
  declarations: [MarbleComponent, MarbleDetailComponent, MarbleUpdateComponent, MarbleDeleteDialogComponent],
  entryComponents: [MarbleDeleteDialogComponent],
})
export class MarbleModule {}
