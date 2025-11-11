"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const init_1 = require("./db/init");
const services_1 = require("./db/services");
(0, init_1.initializeDatabase)();
exports.db = {
    auth: services_1.authService,
    products: services_1.productService,
    categories: services_1.categoryService,
    orders: services_1.orderService,
    customers: services_1.customerService,
    settings: services_1.settingsService,
    dashboard: services_1.dashboardService,
};
