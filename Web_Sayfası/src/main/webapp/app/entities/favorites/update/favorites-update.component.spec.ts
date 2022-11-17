import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FavoritesService } from '../service/favorites.service';
import { IFavorites, Favorites } from '../favorites.model';
import { IMarble } from 'app/entities/marble/marble.model';
import { MarbleService } from 'app/entities/marble/service/marble.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { FavoritesUpdateComponent } from './favorites-update.component';

describe('Favorites Management Update Component', () => {
  let comp: FavoritesUpdateComponent;
  let fixture: ComponentFixture<FavoritesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let favoritesService: FavoritesService;
  let marbleService: MarbleService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FavoritesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FavoritesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FavoritesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    favoritesService = TestBed.inject(FavoritesService);
    marbleService = TestBed.inject(MarbleService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call marble query and add missing value', () => {
      const favorites: IFavorites = { id: 456 };
      const marble: IMarble = { id: 57903 };
      favorites.marble = marble;

      const marbleCollection: IMarble[] = [{ id: 51382 }];
      jest.spyOn(marbleService, 'query').mockReturnValue(of(new HttpResponse({ body: marbleCollection })));
      const expectedCollection: IMarble[] = [marble, ...marbleCollection];
      jest.spyOn(marbleService, 'addMarbleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ favorites });
      comp.ngOnInit();

      expect(marbleService.query).toHaveBeenCalled();
      expect(marbleService.addMarbleToCollectionIfMissing).toHaveBeenCalledWith(marbleCollection, marble);
      expect(comp.marblesCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const favorites: IFavorites = { id: 456 };
      const user: IUser = { id: 55601 };
      favorites.user = user;

      const userCollection: IUser[] = [{ id: 68719 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ favorites });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const favorites: IFavorites = { id: 456 };
      const marble: IMarble = { id: 65448 };
      favorites.marble = marble;
      const user: IUser = { id: 73351 };
      favorites.user = user;

      activatedRoute.data = of({ favorites });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(favorites));
      expect(comp.marblesCollection).toContain(marble);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Favorites>>();
      const favorites = { id: 123 };
      jest.spyOn(favoritesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favorites });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: favorites }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(favoritesService.update).toHaveBeenCalledWith(favorites);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Favorites>>();
      const favorites = new Favorites();
      jest.spyOn(favoritesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favorites });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: favorites }));
      saveSubject.complete();

      // THEN
      expect(favoritesService.create).toHaveBeenCalledWith(favorites);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Favorites>>();
      const favorites = { id: 123 };
      jest.spyOn(favoritesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favorites });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(favoritesService.update).toHaveBeenCalledWith(favorites);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackMarbleById', () => {
      it('Should return tracked Marble primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackMarbleById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
