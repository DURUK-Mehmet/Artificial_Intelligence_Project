import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFavorites, Favorites } from '../favorites.model';
import { FavoritesService } from '../service/favorites.service';
import { IMarble } from 'app/entities/marble/marble.model';
import { MarbleService } from 'app/entities/marble/service/marble.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-favorites-update',
  templateUrl: './favorites-update.component.html',
})
export class FavoritesUpdateComponent implements OnInit {
  isSaving = false;

  marblesCollection: IMarble[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    userName: [],
    marble: [],
    user: [],
  });

  constructor(
    protected favoritesService: FavoritesService,
    protected marbleService: MarbleService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ favorites }) => {
      this.updateForm(favorites);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const favorites = this.createFromForm();
    if (favorites.id !== undefined) {
      this.subscribeToSaveResponse(this.favoritesService.update(favorites));
    } else {
      this.subscribeToSaveResponse(this.favoritesService.create(favorites));
    }
  }

  trackMarbleById(_index: number, item: IMarble): number {
    return item.id!;
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFavorites>>): void {
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

  protected updateForm(favorites: IFavorites): void {
    this.editForm.patchValue({
      id: favorites.id,
      userName: favorites.userName,
      marble: favorites.marble,
      user: favorites.user,
    });

    this.marblesCollection = this.marbleService.addMarbleToCollectionIfMissing(this.marblesCollection, favorites.marble);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, favorites.user);
  }

  protected loadRelationshipsOptions(): void {
    this.marbleService
      .query({ filter: 'favorites-is-null' })
      .pipe(map((res: HttpResponse<IMarble[]>) => res.body ?? []))
      .pipe(map((marbles: IMarble[]) => this.marbleService.addMarbleToCollectionIfMissing(marbles, this.editForm.get('marble')!.value)))
      .subscribe((marbles: IMarble[]) => (this.marblesCollection = marbles));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IFavorites {
    return {
      ...new Favorites(),
      id: this.editForm.get(['id'])!.value,
      userName: this.editForm.get(['userName'])!.value,
      marble: this.editForm.get(['marble'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
