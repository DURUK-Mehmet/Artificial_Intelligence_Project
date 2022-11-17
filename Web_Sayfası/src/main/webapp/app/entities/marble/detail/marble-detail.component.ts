import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMarble } from '../marble.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-marble-detail',
  templateUrl: './marble-detail.component.html',
})
export class MarbleDetailComponent implements OnInit {
  marble: IMarble | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ marble }) => {
      this.marble = marble;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
