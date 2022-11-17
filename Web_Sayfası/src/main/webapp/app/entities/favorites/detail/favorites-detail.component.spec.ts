import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FavoritesDetailComponent } from './favorites-detail.component';

describe('Favorites Management Detail Component', () => {
  let comp: FavoritesDetailComponent;
  let fixture: ComponentFixture<FavoritesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoritesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ favorites: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FavoritesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FavoritesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load favorites on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.favorites).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
