import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SellerDetailComponent } from './seller-detail.component';

describe('Seller Management Detail Component', () => {
  let comp: SellerDetailComponent;
  let fixture: ComponentFixture<SellerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ seller: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SellerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SellerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load seller on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.seller).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
