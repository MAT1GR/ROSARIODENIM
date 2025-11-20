// server/lib/db/services.ts
import bcrypt from "bcryptjs";
import { getDB, saveDatabase } from './connection.js';
import crypto from 'crypto';
import {
  Product,
  AdminUser,
  Category,
  Order,
  Customer,
  SiteSettings,
  CartItem,
  CustomerOrder,
} from "../../types/index.js";
import { type Database, type QueryExecResult } from "sql.js";

// --- Helpers ---

const toObjects = (res: QueryExecResult[] | undefined): any[] => {
  if (!res || res.length === 0) return [];
  const [firstResult] = res;
  return firstResult.values.map(row => {
    const obj: any = {};
    firstResult.columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
};

const parseProduct = (row: any): Product => ({
  id: String(row.id),
  name: row.name,
  price: row.price,
  images: JSON.parse(row.images),
  video: row.video,
  category: row.category,
  description: row.description,
  material: row.material,
  rise: row.rise,
  fit: row.fit,
  waist_flat: row.waist_flat,
  hip_flat: row.hip_flat,
  length: row.length,
  sizes: JSON.parse(row.sizes),
  isNew: Boolean(row.is_new),
  isBestSeller: Boolean(row.is_best_seller),
  isActive: Boolean(row.is_active),
});

const parseCategory = (row: any): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  image: row.image,
  is_active: Boolean(row.is_active),
  sort_order: row.sort_order,
});

const parseOrder = (row: any): Order => ({
  id: String(row.id),
  customerId: String(row.customer_id),
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  customerPhone: row.customer_phone,
  customerDocNumber: row.customer_doc_number,
  items: JSON.parse(row.items),
  total: row.total,
  status: row.status,
  shippingStreetName: row.shipping_street_name,
  shippingStreetNumber: row.shipping_street_number,
  shippingApartment: row.shipping_apartment,
  shippingDescription: row.shipping_description,
  shippingCity: row.shipping_city,
  shippingPostalCode: row.shipping_postal_code,
  shippingProvince: row.shipping_province,
  shippingCost: row.shipping_cost,
  shippingName: row.shipping_name,
  createdAt: new Date(row.created_at),
});

const parseCustomer = (row: any): Customer => ({
  id: String(row.id),
  name: row.name,
  email: row.email,
  phone: row.phone,
  order_count: row.order_count,
  total_spent: row.total_spent,
  createdAt: new Date(row.created_at),
});


// --- Services ---

export const authService = {
  authenticateAdmin(username: string, password: string): Omit<AdminUser, 'password'> | null {
    const db = getDB();
    const stmt = db.prepare("SELECT * FROM admin_users WHERE username = :username");
    const user = stmt.getAsObject({ ':username': username }) as unknown as AdminUser | undefined;
    stmt.free();

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  changeAdminPassword(username: string, oldPassword: string, newPassword: string): boolean {
    const db = getDB();
    const stmt = db.prepare("SELECT * FROM admin_users WHERE username = :username");
    const user = stmt.getAsObject({ ':username': username }) as unknown as AdminUser | undefined;
    stmt.free();

    if (user && bcrypt.compareSync(oldPassword, user.password)) {
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      db.run("UPDATE admin_users SET password = ? WHERE username = ?", [hashedNewPassword, username]);
      saveDatabase();
      return true;
    }
    return false;
  },
};

export const productService = {
  getAll(filters: { category?: string; sortBy?: string; page?: number; limit?: number }) {
    const db = getDB();
    const { category, sortBy, page = 1, limit = 9 } = filters;
    
    let whereClauses = ["is_active = 1"];
    const params: (string | number)[] = [];
    if (category) {
      whereClauses.push("category = ?");
      params.push(category);
    }

    const where = `WHERE ${whereClauses.join(" AND ")}`;
    let orderBy = "ORDER BY id DESC";
    if (sortBy === "price-asc") orderBy = "ORDER BY price ASC";
    if (sortBy === "price-desc") orderBy = "ORDER BY price DESC";
    if (sortBy === "popular") orderBy = "ORDER BY is_best_seller DESC, id DESC";

    const offset = (page - 1) * limit;
    
    const productsQuery = `SELECT * FROM products ${where} ${orderBy} LIMIT ? OFFSET ?`;
    const products = toObjects(db.exec(productsQuery, [...params, limit, offset])).map(parseProduct);

    const countQuery = `SELECT COUNT(*) as total FROM products ${where}`;
    const totalResult = toObjects(db.exec(countQuery, params))[0] as { total: number };
    
    return {
      products,
      totalPages: Math.ceil(totalResult.total / limit),
      currentPage: page,
      totalProducts: totalResult.total,
    };
  },

  getById(id: string | number): Product | null {
    const db = getDB();
    const stmt = db.prepare("SELECT * FROM products WHERE id = ? AND is_active = 1");
    const row = stmt.getAsObject([id]);
    stmt.free();
    return row ? parseProduct(row) : null;
  },

  updateProductStock(items: CartItem[]): void {
    const db = getDB();
    for (const item of items) {
      const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
      const productRow = stmt.getAsObject([item.product.id]);
      stmt.free();

      if (productRow) {
        const sizes = JSON.parse(productRow.sizes as string);
        if (sizes[item.size] && sizes[item.size].stock >= item.quantity) {
          sizes[item.size].stock -= item.quantity;
          db.run('UPDATE products SET sizes = ? WHERE id = ?', [JSON.stringify(sizes), productRow.id]);
        } else {
          console.warn(`[Stock] Insufficient stock for product ${productRow.id}, size ${item.size}.`);
        }
      }
    }
    saveDatabase();
  },

  getAllAdmin(): Product[] {
    const db = getDB();
    const rows = toObjects(db.exec('SELECT * FROM products ORDER BY id DESC'));
    return rows.map(parseProduct);
  },

  getNewest(limit: number): Product[] {
    const db = getDB();
    const rows = toObjects(db.exec('SELECT * FROM products WHERE is_new = 1 AND is_active = 1 ORDER BY id DESC LIMIT ?', [limit]));
    return rows.map(parseProduct);
  },

  getBestsellers(): Product[] {
    const db = getDB();
    const rows = toObjects(db.exec('SELECT * FROM products WHERE is_best_seller = 1 AND is_active = 1 ORDER BY created_at DESC'));
    return rows.map(parseProduct);
  },

  create(product: Omit<Product, 'id' | 'isActive'>): number {
    const db = getDB();
    const stmt = db.prepare(
      'INSERT INTO products (name, price, images, video, category, description, material, rise, fit, waist_flat, hip_flat, length, sizes, is_new, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run([
      product.name,
      product.price,
      JSON.stringify(product.images),
      product.video ?? null,
      product.category,
      product.description,
      product.material,
      product.rise,
      product.fit,
      product.waist_flat ?? null,
      product.hip_flat ?? null,
      product.length ?? null,
      JSON.stringify(product.sizes),
      Number(product.isNew),
      Number(product.isBestSeller)
    ]);
    stmt.free();
    const id = toObjects(db.exec("SELECT last_insert_rowid() as id"))[0].id;
    saveDatabase();
    return id;
  },

  update(productId: string, product: Partial<Product>): boolean {
    const db = getDB();
    db.run(
      'UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), images = COALESCE(?, images), video = COALESCE(?, video), category = COALESCE(?, category), description = COALESCE(?, description), material = COALESCE(?, material), rise = COALESCE(?, rise), fit = COALESCE(?, fit), waist_flat = COALESCE(?, waist_flat), hip_flat = COALESCE(?, hip_flat), length = COALESCE(?, length), sizes = COALESCE(?, sizes), is_new = COALESCE(?, is_new), is_best_seller = COALESCE(?, is_best_seller), is_active = COALESCE(?, is_active) WHERE id = ?',
      [
        product.name ?? null,
        product.price ?? null,
        product.images ? JSON.stringify(product.images) : null,
        product.video ?? null,
        product.category ?? null,
        product.description ?? null,
        product.material ?? null,
        product.rise ?? null,
        product.fit ?? null,
        product.waist_flat ?? null,
        product.hip_flat ?? null,
        product.length ?? null,
        product.sizes ? JSON.stringify(product.sizes) : null,
        product.isNew !== undefined ? Number(product.isNew) : null,
        product.isBestSeller !== undefined ? Number(product.isBestSeller) : null,
        product.isActive !== undefined ? Number(product.isActive) : null,
        productId
      ]
    );
    const changes = db.getRowsModified();
    saveDatabase();
    return changes > 0;
  },

  delete(productId: string): boolean {
    const db = getDB();
    db.run('DELETE FROM products WHERE id = ?', [productId]);
    const changes = db.getRowsModified();
    saveDatabase();
    return changes > 0;
  },
};

export const categoryService = {
  getAll(): Category[] {
    const db = getDB();
    const rows = toObjects(db.exec("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, name ASC"));
    return rows.map(parseCategory);
  },

  create(category: Omit<Category, 'id'>): number {
    const db = getDB();
    db.run(
      'INSERT INTO categories (name, slug, description, image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [
        category.name,
        category.slug,
        category.description ?? null,
        category.image ?? null,
        Number(category.is_active),
        category.sort_order
      ]
    );
    const id = toObjects(db.exec("SELECT last_insert_rowid() as id"))[0].id;
    saveDatabase();
    return id;
  },

  getById(categoryId: number): Category | null {
    const db = getDB();
    const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
    const row = stmt.getAsObject([categoryId]);
    stmt.free();
    return row ? parseCategory(row) : null;
  },

  update(categoryId: number, category: Partial<Category>): boolean {
    const db = getDB();
    db.run(
      'UPDATE categories SET name = ?, slug = ?, description = ?, image = ?, is_active = ?, sort_order = ? WHERE id = ?',
      [
        category.name ?? null,
        category.slug ?? null,
        category.description ?? null,
        category.image ?? null,
        category.is_active !== undefined ? Number(category.is_active) : null,
        category.sort_order ?? null,
        categoryId
      ]
    );
    const changes = db.getRowsModified();
    saveDatabase();
    return changes > 0;
  },

  delete(categoryId: number): boolean {
    const db = getDB();
    db.run('DELETE FROM categories WHERE id = ?', [categoryId]);
    const changes = db.getRowsModified();
    saveDatabase();
    return changes > 0;
  },
};

export const orderService = {
  create(orderData: any): string {
    const db = getDB();
    const orderId = crypto.randomUUID();

    // Handle different shapes of shipping data from controllers
    const shipping = orderData.shippingAddress || orderData.shippingInfo || {};
    
    const {
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        customerDocNumber, // Puede venir undefined
        items,
        total,
        status,
        createdAt = new Date()
    } = orderData;

    // --- CORRECCIÓN: Añadimos '|| null' para asegurar que no sea undefined ---
    const shippingStreetName = orderData.shippingStreetName || shipping.streetName || null;
    const shippingStreetNumber = orderData.shippingStreetNumber || shipping.streetNumber || null;
    const shippingApartment = orderData.shippingApartment || shipping.apartment || null;
    const shippingDescription = orderData.shippingDescription || shipping.description || null;
    const shippingCity = orderData.shippingCity || shipping.city || null;
    const shippingPostalCode = orderData.shippingPostalCode || shipping.postalCode || null;
    const shippingProvince = orderData.shippingProvince || shipping.province || null;
    
    const shippingCost = orderData.shippingCost ?? (orderData.shipping?.cost ?? 0);
    const shippingName = orderData.shippingName || (orderData.shipping?.name || 'No especificado');

    db.run(
      `INSERT INTO orders (id, customer_id, customer_name, customer_email, customer_phone, customer_doc_number, items, total, status, created_at, 
        shipping_street_name, shipping_street_number, shipping_apartment, shipping_description, shipping_city, shipping_postal_code, shipping_province, shipping_cost, shipping_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        customerDocNumber || null, // Aseguramos null aquí también
        JSON.stringify(items),
        total,
        status,
        createdAt.toISOString(),
        shippingStreetName,
        shippingStreetNumber,
        shippingApartment,
        shippingDescription,
        shippingCity,
        shippingPostalCode,
        shippingProvince,
        shippingCost,
        shippingName
      ]
    );
    saveDatabase();
    return orderId;
  },

  getAll(): Order[] {
    const db = getDB();
    const rows = toObjects(db.exec("SELECT * FROM orders ORDER BY created_at DESC"));
    return rows.map(parseOrder);
  },

  updateStatus(orderId: string, status: string): boolean {
    const db = getDB();
    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    const changes = db.getRowsModified();
    saveDatabase();
    return changes > 0;
  },

  getById(orderId: string): Order | null {
    const db = getDB();
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const row = stmt.getAsObject([orderId]);
    stmt.free();
    return row ? parseOrder(row) : null;
  },

  getByCustomerId(customerId: string): Order[] {
    const db = getDB();
    const rows = toObjects(db.exec('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [customerId]));
    return rows.map(parseOrder);
  },
};

export const customerService = {
  getAll(): Customer[] {
    const db = getDB();
    const rows = toObjects(db.exec("SELECT * FROM customers ORDER BY created_at DESC"));
    return rows.map(parseCustomer);
  },

  findOrCreate(customerData: { email: string; name: string; phone: string; }): number {
    const db = getDB();
    const stmt = db.prepare('SELECT * FROM customers WHERE email = ?');
    const existingCustomer = stmt.getAsObject([customerData.email]);
    stmt.free();
    
    if (existingCustomer && existingCustomer.id) {
      db.run(
        'UPDATE customers SET order_count = order_count + 1 WHERE id = ?',
        [existingCustomer.id]
      );
      saveDatabase();
      return existingCustomer.id as number;
    } else {
      db.run(
        'INSERT INTO customers (name, email, phone, order_count, total_spent) VALUES (?, ?, ?, 1, 0)',
        [
          customerData.name,
          customerData.email,
          customerData.phone
        ]
      );
      const id = toObjects(db.exec("SELECT last_insert_rowid() as id"))[0].id;
      saveDatabase();
      return id;
    }
  },

  updateTotalSpent(customerId: string, amount: number): void {
    const db = getDB();
    db.run(
      'UPDATE customers SET total_spent = total_spent + ? WHERE id = ?',
      [amount, customerId]
    );
    saveDatabase();
  },

  getById(customerId: string): Customer | null {
    const db = getDB();
    const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
    const row = stmt.getAsObject([customerId]);
    stmt.free();
    return row ? parseCustomer(row) : null;
  },
};

export const dashboardService = {
  getStats(): { totalRevenue: number; totalOrders: number; totalCustomers: number } {
    const db = getDB();
    const revenue = toObjects(db.exec("SELECT SUM(total) as total FROM orders WHERE status = 'paid'"))[0];
    const orders = toObjects(db.exec("SELECT COUNT(*) as total FROM orders"))[0];
    const customers = toObjects(db.exec("SELECT COUNT(*) as total FROM customers"))[0];
    return {
      totalRevenue: revenue?.total || 0,
      totalOrders: orders?.total || 0,
      totalCustomers: customers?.total || 0,
    };
  },

  getRecentOrders(): Order[] {
    const db = getDB();
    const rows = toObjects(db.exec('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5'));
    return rows.map(parseOrder);
  },

  getRecentCustomers(): Customer[] {
    const db = getDB();
    const rows = toObjects(db.exec('SELECT * FROM customers ORDER BY created_at DESC LIMIT 5'));
    return rows.map(parseCustomer);
  },
};

export const settingsService = {
  getAll(): SiteSettings {
    const db = getDB();
    const rows = toObjects(db.exec("SELECT key, value FROM site_settings")) as { key: string; value: string }[];
    return rows.reduce((acc, { key, value }) => {
      acc[key] = { value, type: "text" }; // Assuming type is always text
      return acc;
    }, {} as SiteSettings);
  },

  update(settings: { [key: string]: string }): void {
    const db = getDB();
    const stmt = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
    for (const key in settings) {
      stmt.run([key, settings[key]]);
    }
    stmt.free();
    saveDatabase();
  },
};

export const notificationService = {
  subscribe(email: string): boolean {
    const db = getDB();
    const stmt = db.prepare('SELECT id FROM drop_notifications WHERE email = ?');
    const existing = stmt.getAsObject([email]);
    stmt.free();
    if (existing) {
      return false;
    }
    db.run('INSERT INTO drop_notifications (email) VALUES (?)', [email]);
    saveDatabase();
    return true;
  },

  getAll(): { email: string }[] {
    const db = getDB();
    return toObjects(db.exec('SELECT email FROM drop_notifications ORDER BY created_at DESC'));
  },
};