// src/lib/db/services.ts
import bcrypt from "bcryptjs";
import { db } from "./connection.js";
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

// --- Helpers ---
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
  sizes: JSON.parse(row.sizes),
  isNew: Boolean(row.is_new),
  isBestSeller: Boolean(row.is_best_seller),
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
  createdAt: new Date(row.created_at),
});

const parseCustomerOrder = (row: any): CustomerOrder => ({
  id: String(row.id),
  items: JSON.parse(row.items),
  total: row.total,
  status: row.status,
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
  async authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
    const stmt = await db.prepare("SELECT * FROM admin_users WHERE username = ?");
    const user = (await stmt.get(username)) as AdminUser | undefined;
    await stmt.finalize();

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as AdminUser;
    }
    return null;
  },

  async changeAdminPassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const stmt = await db.prepare("SELECT * FROM admin_users WHERE username = ?");
    const user = (await stmt.get(username)) as AdminUser | undefined;
    await stmt.finalize();

    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      const updateStmt = await db.prepare("UPDATE admin_users SET password = ? WHERE username = ?");
      await updateStmt.run(hashedNewPassword, username);
      await updateStmt.finalize();
      return true;
    }
    return false;
  },
};

export const productService = {
  async getAll(filters: { category?: string; sortBy?: string; page?: number; limit?: number }) {
    const { category, sortBy, page = 1, limit = 9 } = filters;
    const whereClauses: string[] = ["is_active = 1"];
    const params: (string | number)[] = [];
    if (category) {
      whereClauses.push("category = ?");
      params.push(category);
    }

    const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    let orderBy = "ORDER BY id DESC";
    if (sortBy === "price-asc") orderBy = "ORDER BY price ASC";
    if (sortBy === "price-desc") orderBy = "ORDER BY price DESC";
    if (sortBy === "popular") orderBy = "ORDER BY is_best_seller DESC, id DESC";

    const offset = (page - 1) * limit;
    const productsQuery = `SELECT * FROM products ${where} ${orderBy} LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as total FROM products ${where}`;

    const products = (await db.all(productsQuery, ...params, limit, offset)).map(parseProduct);
    const totalResult = (await db.get(countQuery, ...params)) as { total: number };
    return {
      products,
      totalPages: Math.ceil(totalResult.total / limit),
      currentPage: page,
      totalProducts: totalResult.total,
    };
  },

  async getById(id: string | number): Promise<Product | null> {
    const row = await db.get("SELECT * FROM products WHERE id = ? AND is_active = 1", id);
    return row ? parseProduct(row) : null;
  },

  async updateProductStock(items: CartItem[]): Promise<void> {
    for (const item of items) {
      const product = await this.getById(item.product.id);
      if (product) {
        const sizes = product.sizes as any;
        if (sizes[item.size]) {
          sizes[item.size].stock -= item.quantity;
        }
        await db.run('UPDATE products SET sizes = ? WHERE id = ?', JSON.stringify(sizes), product.id);
      }
    }
  },

  async getAllAdmin(): Promise<Product[]> {
    const rows = await db.all('SELECT * FROM products ORDER BY id DESC');
    return rows.map(parseProduct);
  },

  async getNewest(limit: number): Promise<Product[]> {
    const rows = await db.all('SELECT * FROM products WHERE is_new = 1 AND is_active = 1 ORDER BY created_at DESC LIMIT ?', limit);
    return rows.map(parseProduct);
  },

  async getBestsellers(): Promise<Product[]> {
    const rows = await db.all('SELECT * FROM products WHERE is_best_seller = 1 AND is_active = 1 ORDER BY created_at DESC');
    return rows.map(parseProduct);
  },

  async create(product: Omit<Product, 'id'>): Promise<number> {
    const result = await db.run(
      'INSERT INTO products (name, price, images, video, category, description, material, rise, fit, sizes, is_new, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      product.name,
      product.price,
      JSON.stringify(product.images),
      product.video,
      product.category,
      product.description,
      product.material,
      product.rise,
      product.fit,
      JSON.stringify(product.sizes),
      product.isNew,
      product.isBestSeller
    );
    return result.lastID!;
  },

  async update(productId: string, product: Partial<Product>): Promise<boolean> {
    const result = await db.run(
      'UPDATE products SET name = ?, price = ?, images = ?, video = ?, category = ?, description = ?, material = ?, rise = ?, fit = ?, sizes = ?, is_new = ?, is_best_seller = ? WHERE id = ?',
      product.name,
      product.price,
      JSON.stringify(product.images),
      product.video,
      product.category,
      product.description,
      product.material,
      product.rise,
      product.fit,
      JSON.stringify(product.sizes),
      product.isNew,
      product.isBestSeller,
      productId
    );
    return (result.changes ?? 0) > 0;
  },

  async delete(productId: string): Promise<boolean> {
    const result = await db.run('DELETE FROM products WHERE id = ?', productId);
    return (result.changes ?? 0) > 0;
  },
};

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const rows = await db.all("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, name ASC");
    return rows.map(parseCategory);
  },

  async create(category: Omit<Category, 'id'>): Promise<number> {
    const result = await db.run(
      'INSERT INTO categories (name, slug, description, image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      category.name,
      category.slug,
      category.description,
      category.image,
      category.is_active,
      category.sort_order
    );
    return result.lastID!;
  },

  async getById(categoryId: number): Promise<Category | null> {
    const row = await db.get('SELECT * FROM categories WHERE id = ?', categoryId);
    return row ? parseCategory(row) : null;
  },

  async update(categoryId: number, category: Partial<Category>): Promise<boolean> {
    const result = await db.run(
      'UPDATE categories SET name = ?, slug = ?, description = ?, image = ?, is_active = ?, sort_order = ? WHERE id = ?',
      category.name,
      category.slug,
      category.description,
      category.image,
      category.is_active,
      category.sort_order,
      categoryId
    );
    return (result.changes ?? 0) > 0;
  },

  async delete(categoryId: number): Promise<boolean> {
    const result = await db.run('DELETE FROM categories WHERE id = ?', categoryId);
    return (result.changes ?? 0) > 0;
  },
};

export const orderService = {
  async create(order: Omit<Order, "id" | "customerId"> & { customerId: string }): Promise<number> {
    const result = await db.run(
      `INSERT INTO orders (customer_id, customer_name, customer_email, customer_phone, customer_doc_number, items, total, status, created_at, 
        shipping_street_name, shipping_street_number, shipping_apartment, shipping_description, shipping_city, shipping_postal_code, shipping_province, shipping_cost, shipping_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      order.customerId,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.customerDocNumber,
      JSON.stringify(order.items),
      order.total,
      order.status,
      order.createdAt.toISOString(),
      order.shippingStreetName,
      order.shippingStreetNumber,
      order.shippingApartment,
      order.shippingDescription,
      order.shippingCity,
      order.shippingPostalCode,
      order.shippingProvince,
      order.shippingCost,
      order.shippingName
    );
    return result.lastID!;
  },

  async getAll(): Promise<Order[]> {
    const rows = await db.all("SELECT * FROM orders ORDER BY created_at DESC");
    return rows.map(parseOrder);
  },

  async updateStatus(orderId: string, status: string): Promise<boolean> {
    const result = await db.run('UPDATE orders SET status = ? WHERE id = ?', status, orderId);
    return (result.changes ?? 0) > 0;
  },

  async getByCustomerId(customerId: string): Promise<Order[]> {
    const rows = await db.all('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', customerId);
    return rows.map(parseOrder);
  },

  async getById(orderId: string): Promise<Order | null> {
    const row = await db.get('SELECT * FROM orders WHERE id = ?', orderId);
    return row ? parseOrder(row) : null;
  },
};

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const rows = await db.all("SELECT * FROM customers ORDER BY created_at DESC");
    return rows.map(parseCustomer);
  },

  async findOrCreate(customerData: { email: string; name: string; phone: string; totalSpent: number }): Promise<number> {
    const existingCustomer = await db.get('SELECT * FROM customers WHERE email = ?', customerData.email);
    if (existingCustomer) {
      await db.run(
        'UPDATE customers SET order_count = order_count + 1, total_spent = total_spent + ? WHERE id = ?',
        customerData.totalSpent,
        existingCustomer.id
      );
      return existingCustomer.id;
    } else {
      const result = await db.run(
        'INSERT INTO customers (name, email, phone, order_count, total_spent) VALUES (?, ?, ?, 1, ?)',
        customerData.name,
        customerData.email,
        customerData.phone,
        customerData.totalSpent
      );
      return result.lastID!;
    }
  },

  async getById(customerId: string): Promise<Customer | null> {
    const row = await db.get('SELECT * FROM customers WHERE id = ?', customerId);
    return row ? parseCustomer(row) : null;
  },
};

export const dashboardService = {
  async getStats(): Promise<{ totalRevenue: number; totalOrders: number; totalCustomers: number }> {
    const revenue = await db.get("SELECT SUM(total) as total FROM orders WHERE status = 'paid'");
    const orders = await db.get("SELECT COUNT(*) as total FROM orders");
    const customers = await db.get("SELECT COUNT(*) as total FROM customers");
    return {
      totalRevenue: revenue?.total || 0,
      totalOrders: orders?.total || 0,
      totalCustomers: customers?.total || 0,
    };
  },

  async getRecentOrders(): Promise<Order[]> {
    const rows = await db.all('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
    return rows.map(parseOrder);
  },

  async getRecentCustomers(): Promise<Customer[]> {
    const rows = await db.all('SELECT * FROM customers ORDER BY created_at DESC LIMIT 5');
    return rows.map(parseCustomer);
  },
};

export const settingsService = {
  async getAll(): Promise<SiteSettings> {
    const rows = (await db.all("SELECT key, value FROM site_settings")) as { key: string; value: string }[];
    return rows.reduce((acc, { key, value }) => {
      acc[key] = { value, type: "text" };
      return acc;
    }, {} as SiteSettings);
  },

  async update(settings: { [key: string]: string }): Promise<void> {
    for (const key in settings) {
      await db.run('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)', key, settings[key]);
    }
  },
};

export const notificationService = {
  async subscribe(email: string): Promise<boolean> {
    const existing = await db.get('SELECT id FROM drop_notifications WHERE email = ?', email);
    if (existing) {
      return false;
    }
    await db.run('INSERT INTO drop_notifications (email) VALUES (?)', email);
    return true;
  },

  async getAll(): Promise<{ email: string }[]> {
    return db.all('SELECT email FROM drop_notifications ORDER BY created_at DESC');
  },
};
