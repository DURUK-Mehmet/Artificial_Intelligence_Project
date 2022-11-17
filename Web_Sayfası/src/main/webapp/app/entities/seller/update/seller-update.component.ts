import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISeller, Seller } from '../seller.model';
import { SellerService } from '../service/seller.service';
import { IMarble } from 'app/entities/marble/marble.model';
import { MarbleService } from 'app/entities/marble/service/marble.service';

@Component({
  selector: 'jhi-seller-update',
  templateUrl: './seller-update.component.html',
})
export class SellerUpdateComponent implements OnInit {
  isSaving = false;

  marblesSharedCollection: IMarble[] = [];

  editForm = this.fb.group({
    id: [],
    sellerName: [],
    company: [],
    name: [],
    lastName: [],
    adress: [],
    telephone: [],
    taxNumber: [],
    marbles: [],
  });

  constructor(
    protected sellerService: SellerService,
    protected marbleService: MarbleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seller }) => {
      this.updateForm(seller);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  

  save(): void {
    this.isSaving = true;
    const seller = this.createFromForm();
    if (seller.id !== undefined) {
      this.subscribeToSaveResponse(this.sellerService.update(seller));
    } else {
      this.subscribeToSaveResponse(this.sellerService.create(seller));
    }
  }

  trackMarbleById(_index: number, item: IMarble): number {
    return item.id!;
  }

  getSelectedMarble(option: IMarble, selectedVals?: IMarble[]): IMarble {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeller>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(seller: ISeller): void {
    this.editForm.patchValue({
      id: seller.id,
      sellerName: seller.sellerName,
      company: seller.company,
      name: seller.name,
      lastName: seller.lastName,
      adress: seller.adress,
      telephone: seller.telephone,
      taxNumber: seller.taxNumber,
      marbles: seller.marbles,
    });

    this.marblesSharedCollection = this.marbleService.addMarbleToCollectionIfMissing(
      this.marblesSharedCollection,
      ...(seller.marbles ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.marbleService
      .query()
      .pipe(map((res: HttpResponse<IMarble[]>) => res.body ?? []))
      .pipe(
        map((marbles: IMarble[]) =>
          this.marbleService.addMarbleToCollectionIfMissing(marbles, ...(this.editForm.get('marbles')!.value ?? []))
        )
      )
      .subscribe((marbles: IMarble[]) => (this.marblesSharedCollection = marbles));
  }

  protected createFromForm(): ISeller {
    return {
      ...new Seller(),
      id: this.editForm.get(['id'])!.value,
      sellerName: this.editForm.get(['sellerName'])!.value,
      company: this.editForm.get(['company'])!.value,
      name: this.editForm.get(['name'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      adress: this.editForm.get(['adress'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      taxNumber: this.editForm.get(['taxNumber'])!.value,
      marbles: this.editForm.get(['marbles'])!.value,
    };
  }
}
