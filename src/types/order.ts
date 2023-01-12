import { Query } from './query';

export type OrderType = {
  customerId: string;
  employeeId: number;
  freight: number;
  orderDate: string;
  id: number;
  requiredDate: string;
  shipAddress: string;
  shipCity: string;
  shipCountry: string;
  shipName: string;
  shipPostalCode: string;
  shipRegion: string;
  shipVia: string;
  shippedDate: string;
  totalPrice: number;
  quantitySum: number;
  totalDiscount: number;
  productsCount: number;
  products?: Array<OrderProduct>;
};

export type OrderQuery = {
  queries: Query[];
  data: OrderType[];
};

export type OrderPageQuery = {
  queries?: Query[];
  data: OrderType[];
  count: number;
};

export type OrderProduct = {
  CategoryID: number;
  Discontinued: number;
  Discount: string;
  OrderID: number;
  OrderUnitPrice: string;
  ProductID: number;
  ProductName: string;
  ProductUnitPrice: string;
  Quantity: number;
  QuantityPerUnit: string;
  ReorderLevel: number;
  SupplierID: number;
  UnitsInStock: number;
  UnitsOnOrder: number;
};
