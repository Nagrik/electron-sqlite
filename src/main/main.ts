/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Database from 'better-sqlite3';
import {
  BetterSQLite3Database,
  drizzle,
} from 'drizzle-orm-sqlite/better-sqlite3';
import { asc, eq, like } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  customers,
  details,
  employees,
  orders,
  products,
  shipper,
  suppliers,
} from '../data/schema';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let db: Database.Database;
let database: BetterSQLite3Database;

ipcMain.on('getFile', (event, arg) => {
  db = new Database(arg);
  database = drizzle(db);
});

ipcMain.on('employees', async (event, arg) => {
  const stmt = database
    .select(employees)
    .limit(20)
    .offset((arg - 1) * 20)
    .all();
  const stmtCount = database.select(employees).all();
  event.reply('employees', {
    data: stmt,
    count: stmtCount.length,
  });
});

ipcMain.on('employeesID', async (event, arg) => {
  const stmt = database.select(employees).where(eq(employees.id, arg)).all();
  const stmtReports = database
    .select(employees)
    // @ts-ignore
    .where(eq(employees.id, stmt[0].reportsTo))
    .all();
  event.reply('employeesID', {
    data: stmt,
    reports: stmtReports,
  });
});

ipcMain.on('suppliers', async (event, arg) => {
  const stmt = database
    .select(suppliers)
    .limit(20)
    .offset((arg - 1) * 20)
    .all();
  const stmtCount = database.select(suppliers).all();
  event.reply('suppliers', {
    data: stmt,
    count: stmtCount.length,
  });
});

ipcMain.on('supplierID', async (event, arg) => {
  const stmt = database.select(suppliers).where(eq(suppliers.id, arg)).all();
  event.reply('supplierID', {
    data: stmt,
  });
});

ipcMain.on('product', async (event, arg) => {
  const stmt = database
    .select(products)
    .limit(20)
    .offset((arg - 1) * 20)
    .all();
  const stmtCount = database.select(products).all();
  event.reply('product', {
    data: stmt,
    count: stmtCount.length,
  });
});

ipcMain.on('productID', async (event, arg) => {
  const stmt = database.select(products).where(eq(products.id, arg)).all();
  event.reply('productID', {
    data: stmt,
  });
});

ipcMain.on('orders', async (event, arg) => {
  const stmt = database
    .select(orders)
    .fields({
      id: orders.id,
      shippedDate: orders.shippedDate,
      shipName: orders.shipName,
      shipCity: orders.shipCity,
      shipCountry: orders.shipCountry,
      productsCount: sql`count(${details.productId})`.as<number>(),
      quantitySum: sql`sum(${details.quantity})`.as<number>(),
      totalPrice:
        sql`sum(${details.quantity} * ${details.unitPrice})`.as<number>(),
    })
    .leftJoin(details, eq(orders.id, details.orderId))
    .groupBy(orders.id)
    .orderBy(asc(orders.id))
    .limit(20)
    .offset((arg - 1) * 20)
    .all();
  const stmtCount = database.select(orders).all();
  event.reply('orders', {
    data: stmt,
    count: stmtCount.length,
  });
});

ipcMain.on('orderIDTable', async (event, arg) => {
  console.log(arg, 'arg');
  const stmt = database
    .select(products)
    .fields({
      orderId: details.orderId,
      unitPrice: products.unitPrice,
      discount: details.discount,
      productId: products.id,
      productName: products.name,
      totalDiscount: sql`sum(${details.unitPrice} * ${details.quantity} * ${details.discount})`,
      totalPrice: sql`sum(${details.unitPrice} * ${details.quantity})`,
      totalQuantity: sql`sum(${details.quantity})`,
      totalProducts: sql`count(${details.orderId})`,
    })
    .leftJoin(details, eq(details.productId, products.id))
    .where(eq(details.orderId, arg))
    .all();
  // const stmt2 = database.prepare(
  //   'SELECT OrderDetail.OrderID,OrderDetail.Quantity, Product.UnitPrice AS OrderUnitPrice,\n' +
  //     '        OrderDetail."Discount",\n' +
  //     '        ProductId,\n' +
  //     '        ProductName,\n' +
  //     '        Product.Id, OrderId, ProductId, Product.UnitPrice, Quantity, Discount,\n' +
  //     '        Product.UnitPrice AS "ProductUnitPrice",\n' +
  //     '      OrderId\n' +
  //     '      FROM Product\n' +
  //     '        LEFT JOIN OrderDetail\n' +
  //     '          ON OrderDetail."ProductID"=Product.Id\n' +
  //     '            WHERE OrderDetail."OrderID"=@id'
  // );
  event.reply('orderIDTable', {
    data: stmt,
  });
});

ipcMain.on('orderID', async (event, arg) => {
  const stmt = database
    .select(orders)
    .fields({
      orderId: orders.id,
      employeeId: orders.employeeId,
      orderDate: orders.orderDate,
      requiredDate: orders.requiredDate,
      shippedDate: orders.shippedDate,
      shipVia: orders.shipVia,
      freight: orders.freight,
      shipName: orders.shipName,
      shipAddress: orders.shipRegion,
      shipCity: orders.shipCity,
      shipRegion: orders.shipRegion,
      shipPostalCode: orders.shipPostalCode,
      shipCountry: orders.shipCountry,
      totalDiscount: sql`sum(${details.unitPrice} * ${details.quantity} * ${details.discount})`,
      totalPrice: sql`sum(${details.unitPrice} * ${details.quantity})`,
      totalQuantity: sql`sum(${details.quantity})`,
      totalProducts: sql`count(${details.orderId})`,
    })
    .leftJoin(details, eq(orders.id, details.orderId))
    .leftJoin(shipper, eq(orders.shipVia, shipper.id))
    .where(eq(orders.id, arg))
    .groupBy(orders.id, shipper.companyName)
    .all();
  // const stmt = database.prepare(s
  //   'SELECT "Order".Id,\n' +
  //     '       "Order".CustomerId,\n' +
  //     '       "Order".EmployeeId,\n' +
  //     '       "Order".OrderDate,\n' +
  //     '       "Order".RequiredDate,\n' +
  //     '       "Order".ShippedDate,\n' +
  //     '        "Order".ShipVia,\n' +
  //     '        "Order".Freight,\n' +
  //     '        "Order".ShipName,\n' +
  //     '         "Order".ShipAddress,\n' +
  //     '         "Order".ShipCity,\n' +
  //     '         "Order".ShipRegion,\n' +
  //     '         "Order".ShipPostalCode,\n' +
  //     '         "Order".ShipCountry as ShipVia,\n' +
  //     '          SUM(OrderDetail.UnitPrice * OrderDetail."Discount" * OrderDetail."Quantity") AS "TotalDiscount",\n' +
  //     '          SUM(OrderDetail."UnitPrice" * OrderDetail."Quantity") AS "TotalPrice",\n' +
  //     '          SUM(OrderDetail."Quantity") AS "TotalQuantity",\n' +
  //     '          COUNT(OrderDetail."OrderID") AS "TotalProducts"\n' +
  //     '        FROM "Order"\n' +
  //     '          LEFT JOIN OrderDetail\n' +
  //     '            ON "Order".Id = OrderDetail."OrderID"\n' +
  //     '          LEFT JOIN Shipper\n' +
  //     '            ON "Order"."ShipVia" = Shipper.Id\n' +
  //     '              WHERE "Order".Id = @id\n' +
  //     '              GROUP BY "Order".Id, Shipper.CompanyName'
  // );
  event.reply('orderID', {
    data: stmt,
  });
});
ipcMain.on('customers', async (event, arg) => {
  const stmt = database
    .select(customers)
    .limit(20)
    .offset((arg - 1) * 20)
    .all();
  const stmtCount = database.select(customers).all();
  event.reply('customers', {
    data: stmt,
    count: stmtCount.length,
  });
});

ipcMain.on('customersID', async (event, arg) => {
  const stmt = database.select(customers).where(eq(customers.id, arg)).all();
  event.reply('customersID', {
    data: stmt,
  });
});

ipcMain.on('searchProducts', async (event, arg) => {
  // const stmt = database.prepare(
  //   "SELECT * FROM Product WHERE Product.ProductName like (@search || '%');"
  // );
  const stmt = database
    .select(products)
    .where(like(products.name, `%${arg}%`))
    .all();

  event.reply('searchProducts', {
    data: stmt,
  });
});

ipcMain.on('searchCustomers', async (event, arg) => {
  const stmt = database
    .select(customers)
    .where(like(customers.contactName, `%${arg}%`))
    .all();

  event.reply('searchCustomers', {
    data: stmt,
  });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
