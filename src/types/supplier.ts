import { Query } from './query';

export type Supplier = {
  id: number;
  companyName: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  fax: string;
  homePage: string;
};

export type SupplierQuery = {
  queries: Query[];
  data: Supplier[];
};

export type SupplierPageQuery = {
  count: number;
  data: Supplier[];
};
