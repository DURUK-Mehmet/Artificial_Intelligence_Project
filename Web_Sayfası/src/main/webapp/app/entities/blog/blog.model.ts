import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IBlog {
  id?: number;
  title?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export class Blog implements IBlog {
  constructor(
    public id?: number,
    public title?: string | null,
    public description?: string | null,
    public date?: dayjs.Dayjs | null,
    public user?: IUser | null
  ) {}
}

export function getBlogIdentifier(blog: IBlog): number | undefined {
  return blog.id;
}
