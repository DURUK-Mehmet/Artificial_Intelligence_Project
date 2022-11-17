import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISeller } from '../seller.model';
import { SellerService } from '../service/seller.service';

@Component({
  templateUrl: './seller-delete-dialog.component.html',
})
export class SellerDeleteDialogComponent {
  seller?: ISeller;

  constructor(protected sellerService: SellerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sellerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
