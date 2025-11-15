import { 
    authService, 
    productService, 
    categoryService,
    orderService,
    customerService,
    settingsService,
    dashboardService,
    notificationService
} from './db/services.js';

export const db = {
  auth: authService,
  products: productService,
  categories: categoryService,
  orders: orderService,
  customers: customerService,
  settings: settingsService,
  dashboard: dashboardService,
  notifications: notificationService,
};

