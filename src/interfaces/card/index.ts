import { NoteInterface } from 'interfaces/note';
import { GetQueryInterface } from 'interfaces';

export interface CardInterface {
  id?: string;
  content_summary: string;
  note_id?: string;
  created_at?: any;
  updated_at?: any;

  note?: NoteInterface;
  _count?: {};
}

export interface CardGetQueryInterface extends GetQueryInterface {
  id?: string;
  content_summary?: string;
  note_id?: string;
}
