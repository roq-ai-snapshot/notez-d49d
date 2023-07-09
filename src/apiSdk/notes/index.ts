import axios from 'axios';
import queryString from 'query-string';
import { NoteInterface, NoteGetQueryInterface } from 'interfaces/note';
import { GetQueryInterface } from '../../interfaces';

export const getNotes = async (query?: NoteGetQueryInterface) => {
  const response = await axios.get(`/api/notes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createNote = async (note: NoteInterface) => {
  const response = await axios.post('/api/notes', note);
  return response.data;
};

export const updateNoteById = async (id: string, note: NoteInterface) => {
  const response = await axios.put(`/api/notes/${id}`, note);
  return response.data;
};

export const getNoteById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/notes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteNoteById = async (id: string) => {
  const response = await axios.delete(`/api/notes/${id}`);
  return response.data;
};
