import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISeller } from '../seller.model';
import { SellerService } from '../service/seller.service';
import { SellerDeleteDialogComponent } from '../delete/seller-delete-dialog.component';

@Component({
  selector: 'jhi-seller',
  templateUrl: './seller.component.html',
})
export class SellerComponent implements OnInit {
  sellers?: ISeller[];
  isLoading = false;

  constructor(protected sellerService: SellerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sellerService.query().subscribe({
      next: (res: HttpResponse<ISeller[]>) => {
        this.isLoading = false;
        this.sellers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISeller): number {
    return item.id!;
  }

  delete(seller: ISeller): void {
    const modalRef = this.modalService.open(SellerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.seller = seller;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
