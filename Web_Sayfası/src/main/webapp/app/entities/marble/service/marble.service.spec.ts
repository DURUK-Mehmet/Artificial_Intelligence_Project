import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMarble, Marble } from '../marble.model';

import { MarbleService } from './marble.service';

describe('Marble Service', () => {
  let service: MarbleService;
  let httpMock: HttpTestingController;
  let elemDefault: IMarble;
  let expectedResult: IMarble | IMarble[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MarbleService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      imageContentType: 'image/png',
      image: 'AAAAAAA',
      colour: 'AAAAAAA',
      pattern: 'AAAAAAA',
      homogeneous: 'AAAAAAA',
      vein: 'AAAAAAA',
      stratification: 'AAAAAAA',
      crack: 'AAAAAAA',
      crackStatus: 'AAAAAAA',
      quality: 'AAAAAAA',
      price: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Marble', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Marble()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Marble', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          image: 'BBBBBB',
          colour: 'BBBBBB',
          pattern: 'BBBBBB',
          homogeneous: 'BBBBBB',
          vein: 'BBBBBB',
          stratification: 'BBBBBB',
          crack: 'BBBBBB',
          crackStatus: 'BBBBBB',
          quality: 'BBBBBB',
          price: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Marble', () => {
      const patchObject = Object.assign(
        {
          colour: 'BBBBBB',
          pattern: 'BBBBBB',
          homogeneous: 'BBBBBB',
          vein: 'BBBBBB',
          stratification: 'BBBBBB',
          crack: 'BBBBBB',
          crackStatus: 'BBBBBB',
          price: 'BBBBBB',
        },
        new Marble()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Marble', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          image: 'BBBBBB',
          colour: 'BBBBBB',
          pattern: 'BBBBBB',
          homogeneous: 'BBBBBB',
          vein: 'BBBBBB',
          stratification: 'BBBBBB',
          crack: 'BBBBBB',
          crackStatus: 'BBBBBB',
          quality: 'BBBBBB',
          price: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Marble', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMarbleToCollectionIfMissing', () => {
      it('should add a Marble to an empty array', () => {
        const marble: IMarble = { id: 123 };
        expectedResult = service.addMarbleToCollectionIfMissing([], marble);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(marble);
      });

      it('should not add a Marble to an array that contains it', () => {
        const marble: IMarble = { id: 123 };
        const marbleCollection: IMarble[] = [
          {
            ...marble,
          },
          { id: 456 },
        ];
        expectedResult = service.addMarbleToCollectionIfMissing(marbleCollection, marble);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Marble to an array that doesn't contain it", () => {
        const marble: IMarble = { id: 123 };
        const marbleCollection: IMarble[] = [{ id: 456 }];
        expectedResult = service.addMarbleToCollectionIfMissing(marbleCollection, marble);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(marble);
      });

      it('should add only unique Marble to an array', () => {
        const marbleArray: IMarble[] = [{ id: 123 }, { id: 456 }, { id: 51151 }];
        const marbleCollection: IMarble[] = [{ id: 123 }];
        expectedResult = service.addMarbleToCollectionIfMissing(marbleCollection, ...marbleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const marble: IMarble = { id: 123 };
        const marble2: IMarble = { id: 456 };
        expectedResult = service.addMarbleToCollectionIfMissing([], marble, marble2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(marble);
        expect(expectedResult).toContain(marble2);
      });

      it('should accept null and undefined values', () => {
        const marble: IMarble = { id: 123 };
        expectedResult = service.addMarbleToCollectionIfMissing([], null, marble, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(marble);
      });

      it('should return initial array if no Marble is added', () => {
        const marbleCollection: IMarble[] = [{ id: 123 }];
        expectedResult = service.addMarbleToCollectionIfMissing(marbleCollection, undefined, null);
        expect(expectedResult).toEqual(marbleCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
