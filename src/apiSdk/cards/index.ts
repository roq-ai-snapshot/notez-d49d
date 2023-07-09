import axios from 'axios';
import queryString from 'query-string';
import { CardInterface, CardGetQueryInterface } from 'interfaces/card';
import { GetQueryInterface } from '../../interfaces';

export const getCards = async (query?: CardGetQueryInterface) => {
  const response = await axios.get(`/api/cards${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCard = async (card: CardInterface) => {
  const response = await axios.post('/api/cards', card);
  return response.data;
};

export const updateCardById = async (id: string, card: CardInterface) => {
  const response = await axios.put(`/api/cards/${id}`, card);
  return response.data;
};

export const getCardById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/cards/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCardById = async (id: string) => {
  const response = await axios.delete(`/api/cards/${id}`);
  return response.data;
};
