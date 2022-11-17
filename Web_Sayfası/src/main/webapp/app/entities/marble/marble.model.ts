import { ISeller } from 'app/entities/seller/seller.model';

export interface IMarble {
  id?: number;
  imageContentType?: string | null;
  image?: string | null;
  colour?: string | null;
  pattern?: string | null;
  homogeneous?: string | null;
  vein?: string | null;
  stratification?: string | null;
  crack?: string | null;
  crackStatus?: string | null;
  quality?: string | null;
  price?: string | null;
  seller?: ISeller | null;
}

export class Marble implements IMarble {
  constructor(
    public id?: number,
    public imageContentType?: string | null,
    public image?: string | null,
    public colour?: string | null,
    public pattern?: string | null,
    public homogeneous?: string | null,
    public vein?: string | null,
    public stratification?: string | null,
    public crack?: string | null,
    public crackStatus?: string | null,
    public quality?: string | null,
    public price?: string | null,
    public seller?: ISeller | null
  ) {}
}

export function getMarbleIdentifier(marble: IMarble): number | undefined {
  return marble.id;
}
