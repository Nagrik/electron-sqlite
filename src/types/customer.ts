import { Query } from './query';

export type Customer = {
  address: string;
  city: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  country: string;
  id: string;
  fax: string;
  phone: string;
  postalCode: string;
  region: string;
};

export type CustomerQuery = {
  queries: Query[];
  data: Customer[];
};

export type CustomerPageQuery = {
  count: number;
  queries: Query[];
  data: Customer[];
};
