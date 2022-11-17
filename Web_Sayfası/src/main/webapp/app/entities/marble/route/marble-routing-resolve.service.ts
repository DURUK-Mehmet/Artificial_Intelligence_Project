import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMarble, Marble } from '../marble.model';
import { MarbleService } from '../service/marble.service';

@Injectable({ providedIn: 'root' })
export class MarbleRoutingResolveService implements Resolve<IMarble> {
  constructor(protected service: MarbleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMarble> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((marble: HttpResponse<Marble>) => {
          if (marble.body) {
            return of(marble.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Marble());
  }
}
