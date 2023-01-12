import { Query } from './query';

export type Product = {
  categoryID: number;
  discontinued: number;
  id: number;
  name: string;
  quantityPerUnit: string;
  reorderLevel: number;
  supplier: string;
  supplierID: number;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder: number;
};

export type ProductQuery = {
  queries: Query[];
  data: Product[];
};

export type ProductPageQuery = {
  count: number;
  queries?: Query[];
  data: Product[];
};
