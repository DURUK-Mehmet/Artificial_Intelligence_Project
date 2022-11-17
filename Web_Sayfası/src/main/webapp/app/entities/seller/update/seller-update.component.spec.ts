import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SellerService } from '../service/seller.service';
import { ISeller, Seller } from '../seller.model';
import { IMarble } from 'app/entities/marble/marble.model';
import { MarbleService } from 'app/entities/marble/service/marble.service';

import { SellerUpdateComponent } from './seller-update.component';

describe('Seller Management Update Component', () => {
  let comp: SellerUpdateComponent;
  let fixture: ComponentFixture<SellerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sellerService: SellerService;
  let marbleService: MarbleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SellerUpdateComponent],
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
      .overrideTemplate(SellerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SellerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sellerService = TestBed.inject(SellerService);
    marbleService = TestBed.inject(MarbleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Marble query and add missing value', () => {
      const seller: ISeller = { id: 456 };
      const marbles: IMarble[] = [{ id: 86011 }];
      seller.marbles = marbles;

      const marbleCollection: IMarble[] = [{ id: 41519 }];
      jest.spyOn(marbleService, 'query').mockReturnValue(of(new HttpResponse({ body: marbleCollection })));
      const additionalMarbles = [...marbles];
      const expectedCollection: IMarble[] = [...additionalMarbles, ...marbleCollection];
      jest.spyOn(marbleService, 'addMarbleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ seller });
      comp.ngOnInit();

      expect(marbleService.query).toHaveBeenCalled();
      expect(marbleService.addMarbleToCollectionIfMissing).toHaveBeenCalledWith(marbleCollection, ...additionalMarbles);
      expect(comp.marblesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const seller: ISeller = { id: 456 };
      const marbles: IMarble = { id: 47170 };
      seller.marbles = [marbles];

      activatedRoute.data = of({ seller });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(seller));
      expect(comp.marblesSharedCollection).toContain(marbles);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Seller>>();
      const seller = { id: 123 };
      jest.spyOn(sellerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seller });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: seller }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sellerService.update).toHaveBeenCalledWith(seller);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Seller>>();
      const seller = new Seller();
      jest.spyOn(sellerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seller });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: seller }));
      saveSubject.complete();

      // THEN
      expect(sellerService.create).toHaveBeenCalledWith(seller);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Seller>>();
      const seller = { id: 123 };
      jest.spyOn(sellerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seller });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sellerService.update).toHaveBeenCalledWith(seller);
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
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedMarble', () => {
      it('Should return option if no Marble is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedMarble(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Marble for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedMarble(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Marble is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedMarble(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
