import { IMarble } from 'app/entities/marble/marble.model';
import { IUser } from 'app/entities/user/user.model';

export interface IComment {
  id?: number;
  userName?: string | null;
  description?: string | null;
  marble?: IMarble | null;
  user?: IUser | null;
}

export class Comment implements IComment {
  constructor(
    public id?: number,
    public userName?: string | null,
    public description?: string | null,
    public marble?: IMarble | null,
    public user?: IUser | null
  ) {}
}

export function getCommentIdentifier(comment: IComment): number | undefined {
  return comment.id;
}
