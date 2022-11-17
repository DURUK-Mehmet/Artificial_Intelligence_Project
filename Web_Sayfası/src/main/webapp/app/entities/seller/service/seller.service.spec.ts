import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISeller, Seller } from '../seller.model';

import { SellerService } from './seller.service';

describe('Seller Service', () => {
  let service: SellerService;
  let httpMock: HttpTestingController;
  let elemDefault: ISeller;
  let expectedResult: ISeller | ISeller[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SellerService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      sellerName: 'AAAAAAA',
      company: 'AAAAAAA',
      name: 'AAAAAAA',
      lastName: 'AAAAAAA',
      adress: 'AAAAAAA',
      telephone: 'AAAAAAA',
      taxNumber: 'AAAAAAA',
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

    it('should create a Seller', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Seller()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Seller', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          sellerName: 'BBBBBB',
          company: 'BBBBBB',
          name: 'BBBBBB',
          lastName: 'BBBBBB',
          adress: 'BBBBBB',
          telephone: 'BBBBBB',
          taxNumber: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Seller', () => {
      const patchObject = Object.assign(
        {
          company: 'BBBBBB',
          taxNumber: 'BBBBBB',
        },
        new Seller()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Seller', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          sellerName: 'BBBBBB',
          company: 'BBBBBB',
          name: 'BBBBBB',
          lastName: 'BBBBBB',
          adress: 'BBBBBB',
          telephone: 'BBBBBB',
          taxNumber: 'BBBBBB',
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

    it('should delete a Seller', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSellerToCollectionIfMissing', () => {
      it('should add a Seller to an empty array', () => {
        const seller: ISeller = { id: 123 };
        expectedResult = service.addSellerToCollectionIfMissing([], seller);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(seller);
      });

      it('should not add a Seller to an array that contains it', () => {
        const seller: ISeller = { id: 123 };
        const sellerCollection: ISeller[] = [
          {
            ...seller,
          },
          { id: 456 },
        ];
        expectedResult = service.addSellerToCollectionIfMissing(sellerCollection, seller);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Seller to an array that doesn't contain it", () => {
        const seller: ISeller = { id: 123 };
        const sellerCollection: ISeller[] = [{ id: 456 }];
        expectedResult = service.addSellerToCollectionIfMissing(sellerCollection, seller);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(seller);
      });

      it('should add only unique Seller to an array', () => {
        const sellerArray: ISeller[] = [{ id: 123 }, { id: 456 }, { id: 7732 }];
        const sellerCollection: ISeller[] = [{ id: 123 }];
        expectedResult = service.addSellerToCollectionIfMissing(sellerCollection, ...sellerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const seller: ISeller = { id: 123 };
        const seller2: ISeller = { id: 456 };
        expectedResult = service.addSellerToCollectionIfMissing([], seller, seller2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(seller);
        expect(expectedResult).toContain(seller2);
      });

      it('should accept null and undefined values', () => {
        const seller: ISeller = { id: 123 };
        expectedResult = service.addSellerToCollectionIfMissing([], null, seller, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(seller);
      });

      it('should return initial array if no Seller is added', () => {
        const sellerCollection: ISeller[] = [{ id: 123 }];
        expectedResult = service.addSellerToCollectionIfMissing(sellerCollection, undefined, null);
        expect(expectedResult).toEqual(sellerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
