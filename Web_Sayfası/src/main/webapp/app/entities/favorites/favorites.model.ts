import { IMarble } from 'app/entities/marble/marble.model';
import { IUser } from 'app/entities/user/user.model';

export interface IFavorites {
  id?: number;
  userName?: string | null;
  marble?: IMarble | null;
  user?: IUser | null;
}

export class Favorites implements IFavorites {
  constructor(public id?: number, public userName?: string | null, public marble?: IMarble | null, public user?: IUser | null) {}
}

export function getFavoritesIdentifier(favorites: IFavorites): number | undefined {
  return favorites.id;
}
