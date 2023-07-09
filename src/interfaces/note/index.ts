import { CardInterface } from 'interfaces/card';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface NoteInterface {
  id?: string;
  content: string;
  user_id?: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  card?: CardInterface[];
  user?: UserInterface;
  organization?: OrganizationInterface;
  _count?: {
    card?: number;
  };
}

export interface NoteGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  user_id?: string;
  organization_id?: string;
}
