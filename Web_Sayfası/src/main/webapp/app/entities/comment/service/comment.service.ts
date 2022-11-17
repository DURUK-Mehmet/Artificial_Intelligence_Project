import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComment, getCommentIdentifier } from '../comment.model';

export type EntityResponseType = HttpResponse<IComment>;
export type EntityArrayResponseType = HttpResponse<IComment[]>;

@Injectable({ providedIn: 'root' })
export class CommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(comment: IComment): Observable<EntityResponseType> {
    return this.http.post<IComment>(this.resourceUrl, comment, { observe: 'response' });
  }

  update(comment: IComment): Observable<EntityResponseType> {
    return this.http.put<IComment>(`${this.resourceUrl}/${getCommentIdentifier(comment) as number}`, comment, { observe: 'response' });
  }

  partialUpdate(comment: IComment): Observable<EntityResponseType> {
    return this.http.patch<IComment>(`${this.resourceUrl}/${getCommentIdentifier(comment) as number}`, comment, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IComment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCommentToCollectionIfMissing(commentCollection: IComment[], ...commentsToCheck: (IComment | null | undefined)[]): IComment[] {
    const comments: IComment[] = commentsToCheck.filter(isPresent);
    if (comments.length > 0) {
      const commentCollectionIdentifiers = commentCollection.map(commentItem => getCommentIdentifier(commentItem)!);
      const commentsToAdd = comments.filter(commentItem => {
        const commentIdentifier = getCommentIdentifier(commentItem);
        if (commentIdentifier == null || commentCollectionIdentifiers.includes(commentIdentifier)) {
          return false;
        }
        commentCollectionIdentifiers.push(commentIdentifier);
        return true;
      });
      return [...commentsToAdd, ...commentCollection];
    }
    return commentCollection;
  }
}
