import { IMarble } from 'app/entities/marble/marble.model';

export interface ISeller {
  id?: number;
  sellerName?: string | null;
  company?: string | null;
  name?: string | null;
  lastName?: string | null;
  adress?: string | null;
  telephone?: string | null;
  taxNumber?: string | null;
  marbles?: IMarble[] | null;
}

export class Seller implements ISeller {
  constructor(
    public id?: number,
    public sellerName?: string | null,
    public company?: string | null,
    public name?: string | null,
    public lastName?: string | null,
    public adress?: string | null,
    public telephone?: string | null,
    public taxNumber?: string | null,
    public marbles?: IMarble[] | null
  ) {}
}

export function getSellerIdentifier(seller: ISeller): number | undefined {
  return seller.id;
}
