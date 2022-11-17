import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMarble } from '../marble.model';
import { MarbleService } from '../service/marble.service';

@Component({
  templateUrl: './marble-delete-dialog.component.html',
})
export class MarbleDeleteDialogComponent {
  marble?: IMarble;

  constructor(protected marbleService: MarbleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.marbleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
