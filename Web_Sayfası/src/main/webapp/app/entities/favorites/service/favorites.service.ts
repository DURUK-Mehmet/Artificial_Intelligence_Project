import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFavorites, getFavoritesIdentifier } from '../favorites.model';

export type EntityResponseType = HttpResponse<IFavorites>;
export type EntityArrayResponseType = HttpResponse<IFavorites[]>;

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/favorites');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(favorites: IFavorites): Observable<EntityResponseType> {
    return this.http.post<IFavorites>(this.resourceUrl, favorites, { observe: 'response' });
  }

  update(favorites: IFavorites): Observable<EntityResponseType> {
    return this.http.put<IFavorites>(`${this.resourceUrl}/${getFavoritesIdentifier(favorites) as number}`, favorites, {
      observe: 'response',
    });
  }

  partialUpdate(favorites: IFavorites): Observable<EntityResponseType> {
    return this.http.patch<IFavorites>(`${this.resourceUrl}/${getFavoritesIdentifier(favorites) as number}`, favorites, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFavorites>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFavorites[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFavoritesToCollectionIfMissing(
    favoritesCollection: IFavorites[],
    ...favoritesToCheck: (IFavorites | null | undefined)[]
  ): IFavorites[] {
    const favorites: IFavorites[] = favoritesToCheck.filter(isPresent);
    if (favorites.length > 0) {
      const favoritesCollectionIdentifiers = favoritesCollection.map(favoritesItem => getFavoritesIdentifier(favoritesItem)!);
      const favoritesToAdd = favorites.filter(favoritesItem => {
        const favoritesIdentifier = getFavoritesIdentifier(favoritesItem);
        if (favoritesIdentifier == null || favoritesCollectionIdentifiers.includes(favoritesIdentifier)) {
          return false;
        }
        favoritesCollectionIdentifiers.push(favoritesIdentifier);
        return true;
      });
      return [...favoritesToAdd, ...favoritesCollection];
    }
    return favoritesCollection;
  }
}
