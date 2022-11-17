import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CommentService } from '../service/comment.service';

import { CommentComponent } from './comment.component';

describe('Comment Management Component', () => {
  let comp: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let service: CommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CommentComponent],
    })
      .overrideTemplate(CommentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CommentService);

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
    expect(comp.comments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
