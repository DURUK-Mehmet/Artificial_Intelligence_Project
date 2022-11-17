import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISeller, getSellerIdentifier } from '../seller.model';

export type EntityResponseType = HttpResponse<ISeller>;
export type EntityArrayResponseType = HttpResponse<ISeller[]>;

@Injectable({ providedIn: 'root' })
export class SellerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sellers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(seller: ISeller): Observable<EntityResponseType> {
    return this.http.post<ISeller>(this.resourceUrl, seller, { observe: 'response' });
  }

  update(seller: ISeller): Observable<EntityResponseType> {
    return this.http.put<ISeller>(`${this.resourceUrl}/${getSellerIdentifier(seller) as number}`, seller, { observe: 'response' });
  }

  partialUpdate(seller: ISeller): Observable<EntityResponseType> {
    return this.http.patch<ISeller>(`${this.resourceUrl}/${getSellerIdentifier(seller) as number}`, seller, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISeller>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeller[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSellerToCollectionIfMissing(sellerCollection: ISeller[], ...sellersToCheck: (ISeller | null | undefined)[]): ISeller[] {
    const sellers: ISeller[] = sellersToCheck.filter(isPresent);
    if (sellers.length > 0) {
      const sellerCollectionIdentifiers = sellerCollection.map(sellerItem => getSellerIdentifier(sellerItem)!);
      const sellersToAdd = sellers.filter(sellerItem => {
        const sellerIdentifier = getSellerIdentifier(sellerItem);
        if (sellerIdentifier == null || sellerCollectionIdentifiers.includes(sellerIdentifier)) {
          return false;
        }
        sellerCollectionIdentifiers.push(sellerIdentifier);
        return true;
      });
      return [...sellersToAdd, ...sellerCollection];
    }
    return sellerCollection;
  }
}
