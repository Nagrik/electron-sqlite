import { OrderPageQuery, OrderQuery } from '../types/order';
import { EmployeePageQuery, EmployeeQuery } from '../types/employee';
import { ProductPageQuery, ProductQuery } from '../types/product';
import { CustomerPageQuery, CustomerQuery } from '../types/customer';
import { SupplierPageQuery, SupplierQuery } from '../types/supplier';

declare global {
  interface Window {
    electron: {
      ipcRenderer: any;
      removeAllListeners(channel: string): void;

      setDB(dbURL: string): void;

      file: {
        getFile(url: string): Promise<SupplierQuery>;
      };

      suppliers: {
        getSuppliers(id: string): Promise<SupplierQuery>;
        getSuppliersPage(page: number): Promise<SupplierPageQuery>;
      };
      customers: {
        getCustomer(id: string): Promise<CustomerQuery>;
        getCustomerPage(page: number): Promise<CustomerPageQuery>;
        searchCustomer(search: string): Promise<CustomerQuery>;
      };

      products: {
        getProduct(id: string): Promise<ProductQuery>;
        getProductPage(page: number): Promise<ProductPageQuery>;
        searchProduct(search: string): Promise<ProductQuery>;
      };

      employees: {
        getEmployee(id: string): Promise<EmployeeQuery>;
        getEmployeePage(page: number): Promise<EmployeePageQuery>;
      };

      orders: {
        getOrderId(id: string): Promise<OrderQuery>;
        getOrderPage(page: number): Promise<OrderPageQuery>;
        getOrderTable(id: string): Promise<OrderQuery>;
      };
    };
  }
}

export {};
