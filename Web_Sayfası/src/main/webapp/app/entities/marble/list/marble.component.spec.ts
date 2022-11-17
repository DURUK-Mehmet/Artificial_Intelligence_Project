import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MarbleService } from '../service/marble.service';

import { MarbleComponent } from './marble.component';

describe('Marble Management Component', () => {
  let comp: MarbleComponent;
  let fixture: ComponentFixture<MarbleComponent>;
  let service: MarbleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MarbleComponent],
    })
      .overrideTemplate(MarbleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MarbleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MarbleService);

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
    expect(comp.marbles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
