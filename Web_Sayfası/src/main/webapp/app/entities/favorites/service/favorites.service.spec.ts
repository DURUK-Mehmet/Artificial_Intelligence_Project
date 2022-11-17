import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFavorites, Favorites } from '../favorites.model';

import { FavoritesService } from './favorites.service';

describe('Favorites Service', () => {
  let service: FavoritesService;
  let httpMock: HttpTestingController;
  let elemDefault: IFavorites;
  let expectedResult: IFavorites | IFavorites[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FavoritesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      userName: 'AAAAAAA',
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

    it('should create a Favorites', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Favorites()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Favorites', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          userName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Favorites', () => {
      const patchObject = Object.assign({}, new Favorites());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Favorites', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          userName: 'BBBBBB',
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

    it('should delete a Favorites', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFavoritesToCollectionIfMissing', () => {
      it('should add a Favorites to an empty array', () => {
        const favorites: IFavorites = { id: 123 };
        expectedResult = service.addFavoritesToCollectionIfMissing([], favorites);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(favorites);
      });

      it('should not add a Favorites to an array that contains it', () => {
        const favorites: IFavorites = { id: 123 };
        const favoritesCollection: IFavorites[] = [
          {
            ...favorites,
          },
          { id: 456 },
        ];
        expectedResult = service.addFavoritesToCollectionIfMissing(favoritesCollection, favorites);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Favorites to an array that doesn't contain it", () => {
        const favorites: IFavorites = { id: 123 };
        const favoritesCollection: IFavorites[] = [{ id: 456 }];
        expectedResult = service.addFavoritesToCollectionIfMissing(favoritesCollection, favorites);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(favorites);
      });

      it('should add only unique Favorites to an array', () => {
        const favoritesArray: IFavorites[] = [{ id: 123 }, { id: 456 }, { id: 53093 }];
        const favoritesCollection: IFavorites[] = [{ id: 123 }];
        expectedResult = service.addFavoritesToCollectionIfMissing(favoritesCollection, ...favoritesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const favorites: IFavorites = { id: 123 };
        const favorites2: IFavorites = { id: 456 };
        expectedResult = service.addFavoritesToCollectionIfMissing([], favorites, favorites2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(favorites);
        expect(expectedResult).toContain(favorites2);
      });

      it('should accept null and undefined values', () => {
        const favorites: IFavorites = { id: 123 };
        expectedResult = service.addFavoritesToCollectionIfMissing([], null, favorites, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(favorites);
      });

      it('should return initial array if no Favorites is added', () => {
        const favoritesCollection: IFavorites[] = [{ id: 123 }];
        expectedResult = service.addFavoritesToCollectionIfMissing(favoritesCollection, undefined, null);
        expect(expectedResult).toEqual(favoritesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
