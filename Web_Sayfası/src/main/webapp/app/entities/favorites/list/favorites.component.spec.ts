import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FavoritesService } from '../service/favorites.service';

import { FavoritesComponent } from './favorites.component';

describe('Favorites Management Component', () => {
  let comp: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FavoritesComponent],
    })
      .overrideTemplate(FavoritesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FavoritesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.favorites?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
