import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMarble, getMarbleIdentifier } from '../marble.model';

export type EntityResponseType = HttpResponse<IMarble>;
export type EntityArrayResponseType = HttpResponse<IMarble[]>;

@Injectable({ providedIn: 'root' })
export class MarbleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/marbles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(marble: IMarble): Observable<EntityResponseType> {
    return this.http.post<IMarble>(this.resourceUrl, marble, { observe: 'response' });
  }

  update(marble: IMarble): Observable<EntityResponseType> {
    return this.http.put<IMarble>(`${this.resourceUrl}/${getMarbleIdentifier(marble) as number}`, marble, { observe: 'response' });
  }

  partialUpdate(marble: IMarble): Observable<EntityResponseType> {
    return this.http.patch<IMarble>(`${this.resourceUrl}/${getMarbleIdentifier(marble) as number}`, marble, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMarble>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMarble[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMarbleToCollectionIfMissing(marbleCollection: IMarble[], ...marblesToCheck: (IMarble | null | undefined)[]): IMarble[] {
    const marbles: IMarble[] = marblesToCheck.filter(isPresent);
    if (marbles.length > 0) {
      const marbleCollectionIdentifiers = marbleCollection.map(marbleItem => getMarbleIdentifier(marbleItem)!);
      const marblesToAdd = marbles.filter(marbleItem => {
        const marbleIdentifier = getMarbleIdentifier(marbleItem);
        if (marbleIdentifier == null || marbleCollectionIdentifiers.includes(marbleIdentifier)) {
          return false;
        }
        marbleCollectionIdentifiers.push(marbleIdentifier);
        return true;
      });
      return [...marblesToAdd, ...marbleCollection];
    }
    return marbleCollection;
  }
}
