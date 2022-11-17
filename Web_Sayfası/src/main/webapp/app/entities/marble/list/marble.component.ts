import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMarble } from '../marble.model';
import { MarbleService } from '../service/marble.service';
import { MarbleDeleteDialogComponent } from '../delete/marble-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-marble',
  templateUrl: './marble.component.html',
})
export class MarbleComponent implements OnInit {
  marbles?: IMarble[];
  isLoading = false;

  constructor(protected marbleService: MarbleService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.marbleService.query().subscribe({
      next: (res: HttpResponse<IMarble[]>) => {
        this.isLoading = false;
        this.marbles = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IMarble): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(marble: IMarble): void {
    const modalRef = this.modalService.open(MarbleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.marble = marble;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
