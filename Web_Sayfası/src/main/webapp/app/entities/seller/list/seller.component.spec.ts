import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SellerService } from '../service/seller.service';

import { SellerComponent } from './seller.component';

describe('Seller Management Component', () => {
  let comp: SellerComponent;
  let fixture: ComponentFixture<SellerComponent>;
  let service: SellerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SellerComponent],
    })
      .overrideTemplate(SellerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SellerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SellerService);

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
    expect(comp.sellers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
