import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMarble, Marble } from '../marble.model';
import { MarbleService } from '../service/marble.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ISeller } from 'app/entities/seller/seller.model';
import { SellerService } from 'app/entities/seller/service/seller.service';

@Component({
  selector: 'jhi-marble-update',
  templateUrl: './marble-update.component.html',
})
export class MarbleUpdateComponent implements OnInit {
  isSaving = false;

  sellersSharedCollection: ISeller[] = [];

  editForm = this.fb.group({
    id: [],
    image: [],
    imageContentType: [],
    colour: [],
    pattern: [],
    homogeneous: [],
    vein: [],
    stratification: [],
    crack: [],
    crackStatus: [],
    quality: [],
    price: [],
    seller: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected marbleService: MarbleService,
    protected sellerService: SellerService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ marble }) => {
      this.updateForm(marble);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('marbleApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const marble = this.createFromForm();
    if (marble.id !== undefined) {
      this.subscribeToSaveResponse(this.marbleService.update(marble));
    } else {
      this.subscribeToSaveResponse(this.marbleService.create(marble));
    }
  }

  trackSellerById(_index: number, item: ISeller): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMarble>>): void {
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

  protected updateForm(marble: IMarble): void {
    this.editForm.patchValue({
      id: marble.id,
      image: marble.image,
      imageContentType: marble.imageContentType,
      colour: marble.colour,
      pattern: marble.pattern,
      homogeneous: marble.homogeneous,
      vein: marble.vein,
      stratification: marble.stratification,
      crack: marble.crack,
      crackStatus: marble.crackStatus,
      quality: marble.quality,
      price: marble.price,
      seller: marble.seller,
    });

    this.sellersSharedCollection = this.sellerService.addSellerToCollectionIfMissing(this.sellersSharedCollection, marble.seller);
  }

  protected loadRelationshipsOptions(): void {
    this.sellerService
      .query()
      .pipe(map((res: HttpResponse<ISeller[]>) => res.body ?? []))
      .pipe(map((sellers: ISeller[]) => this.sellerService.addSellerToCollectionIfMissing(sellers, this.editForm.get('seller')!.value)))
      .subscribe((sellers: ISeller[]) => (this.sellersSharedCollection = sellers));
  }

  protected createFromForm(): IMarble {
    return {
      ...new Marble(),
      id: this.editForm.get(['id'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      colour: this.editForm.get(['colour'])!.value,
      pattern: this.editForm.get(['pattern'])!.value,
      homogeneous: this.editForm.get(['homogeneous'])!.value,
      vein: this.editForm.get(['vein'])!.value,
      stratification: this.editForm.get(['stratification'])!.value,
      crack: this.editForm.get(['crack'])!.value,
      crackStatus: this.editForm.get(['crackStatus'])!.value,
      quality: this.editForm.get(['quality'])!.value,
      price: this.editForm.get(['price'])!.value,
      seller: this.editForm.get(['seller'])!.value,
    };
  }
}
