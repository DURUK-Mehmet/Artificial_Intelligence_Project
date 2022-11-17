import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MarbleService } from '../service/marble.service';
import { IMarble, Marble } from '../marble.model';
import { ISeller } from 'app/entities/seller/seller.model';
import { SellerService } from 'app/entities/seller/service/seller.service';

import { MarbleUpdateComponent } from './marble-update.component';

describe('Marble Management Update Component', () => {
  let comp: MarbleUpdateComponent;
  let fixture: ComponentFixture<MarbleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let marbleService: MarbleService;
  let sellerService: SellerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MarbleUpdateComponent],
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
      .overrideTemplate(MarbleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MarbleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    marbleService = TestBed.inject(MarbleService);
    sellerService = TestBed.inject(SellerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Seller query and add missing value', () => {
      const marble: IMarble = { id: 456 };
      const seller: ISeller = { id: 59616 };
      marble.seller = seller;

      const sellerCollection: ISeller[] = [{ id: 97447 }];
      jest.spyOn(sellerService, 'query').mockReturnValue(of(new HttpResponse({ body: sellerCollection })));
      const additionalSellers = [seller];
      const expectedCollection: ISeller[] = [...additionalSellers, ...sellerCollection];
      jest.spyOn(sellerService, 'addSellerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ marble });
      comp.ngOnInit();

      expect(sellerService.query).toHaveBeenCalled();
      expect(sellerService.addSellerToCollectionIfMissing).toHaveBeenCalledWith(sellerCollection, ...additionalSellers);
      expect(comp.sellersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const marble: IMarble = { id: 456 };
      const seller: ISeller = { id: 93678 };
      marble.seller = seller;

      activatedRoute.data = of({ marble });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(marble));
      expect(comp.sellersSharedCollection).toContain(seller);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Marble>>();
      const marble = { id: 123 };
      jest.spyOn(marbleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ marble });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: marble }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(marbleService.update).toHaveBeenCalledWith(marble);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Marble>>();
      const marble = new Marble();
      jest.spyOn(marbleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ marble });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: marble }));
      saveSubject.complete();

      // THEN
      expect(marbleService.create).toHaveBeenCalledWith(marble);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Marble>>();
      const marble = { id: 123 };
      jest.spyOn(marbleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ marble });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(marbleService.update).toHaveBeenCalledWith(marble);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSellerById', () => {
      it('Should return tracked Seller primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSellerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
