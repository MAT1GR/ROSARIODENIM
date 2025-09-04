import { initializeDatabase } from './db/init';
import { 
    authService, 
    productService, 
    categoryService,
    orderService,
    customerService,
    settingsService,
    dashboardService
} from './db/services';

initializeDatabase();

export const db = {
  auth: authService,
  products: productService,
  categories: categoryService,
  orders: orderService,
  customers: customerService,
  settings: settingsService,
  dashboard: dashboardService,
};

