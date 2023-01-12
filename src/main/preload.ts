import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  removeAllListeners(channel: string) {
    ipcRenderer.removeAllListeners(channel);
  },
  file: {
    getFile(url: string) {
      ipcRenderer.send('getFile', url);

      return new Promise((resolve) => {
        ipcRenderer.once('getFile', (event, data) => {
          return resolve(data);
        });
      });
    },
  },

  employees: {
    getEmployeePage(page: number) {
      ipcRenderer.send('employees', page);

      return new Promise((resolve) => {
        ipcRenderer.once('employees', (event, data) => {
          return resolve(data);
        });
      });
    },

    getEmployee(page: number) {
      ipcRenderer.send('employeesID', page);

      return new Promise((resolve) => {
        ipcRenderer.once('employeesID', (event, data) => {
          return resolve(data);
        });
      });
    },
  },

  suppliers: {
    getSuppliersPage(page: number) {
      ipcRenderer.send('suppliers', page);

      return new Promise((resolve) => {
        ipcRenderer.once('suppliers', (event, data) => {
          return resolve(data);
        });
      });
    },
    getSuppliers(id: number) {
      ipcRenderer.send('supplierID', id);
      return new Promise((resolve) => {
        ipcRenderer.once('supplierID', (event, data) => {
          return resolve(data);
        });
      });
    },
  },

  orders: {
    getOrderPage(page: number) {
      ipcRenderer.send('orders', page);

      return new Promise((resolve) => {
        ipcRenderer.once('orders', (event, data) => {
          return resolve(data);
        });
      });
    },
    getOrderTable(id: number) {
      ipcRenderer.send('orderIDTable', id);
      return new Promise((resolve) => {
        ipcRenderer.once('orderIDTable', (event, data) => {
          return resolve(data);
        });
      });
    },
    getOrderId(id: number) {
      ipcRenderer.send('orderID', id);
      return new Promise((resolve) => {
        ipcRenderer.once('orderID', (event, data) => {
          return resolve(data);
        });
      });
    },
  },

  products: {
    getProductPage(page: number) {
      ipcRenderer.send('product', page);

      return new Promise((resolve) => {
        ipcRenderer.once('product', (event, data) => {
          return resolve(data);
        });
      });
    },
    getProduct(id: number) {
      ipcRenderer.send('productID', id);
      return new Promise((resolve) => {
        ipcRenderer.once('productID', (event, data) => {
          return resolve(data);
        });
      });
    },
    searchProduct(search: string) {
      ipcRenderer.send('searchProducts', search);
      return new Promise((resolve) => {
        ipcRenderer.once('searchProducts', (event, data) => {
          return resolve(data);
        });
      });
    },
  },

  customers: {
    getCustomerPage(page: number) {
      ipcRenderer.send('customers', page);

      return new Promise((resolve) => {
        ipcRenderer.once('customers', (event, data) => {
          return resolve(data);
        });
      });
    },
    getCustomer(id: number) {
      ipcRenderer.send('customersID', id);
      return new Promise((resolve) => {
        ipcRenderer.once('customersID', (event, data) => {
          return resolve(data);
        });
      });
    },
    searchCustomer(search: string) {
      ipcRenderer.send('searchCustomers', search);
      return new Promise((resolve) => {
        ipcRenderer.once('searchCustomers', (event, data) => {
          return resolve(data);
        });
      });
    },
  },
});
