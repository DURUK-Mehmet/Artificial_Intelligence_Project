import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISeller } from '../seller.model';

@Component({
  selector: 'jhi-seller-detail',
  templateUrl: './seller-detail.component.html',
})
export class SellerDetailComponent implements OnInit {
  seller: ISeller | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seller }) => {
      this.seller = seller;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
