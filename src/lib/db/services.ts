// mat1gr/rosariodenim/ROSARIODENIM-0a9e948297937bd8aefc1890579b3a59f99d6fdc/src/lib/db/services.ts

import bcrypt from "bcryptjs";
import { dbConnection } from "./connection";
import {
  Product,
  AdminUser,
  Category,
  Order,
  Customer,
  SiteSettings,
  CartItem,
  CustomerOrder,
} from "../../types";

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

export const authService = {
  authenticateAdmin: async (
    username: string,
    password: string
  ): Promise<AdminUser | null> => {
    const user = dbConnection
      .prepare("SELECT * FROM admin_users WHERE username = ?")
      .get(username) as AdminUser | undefined;
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as AdminUser;
    }
    return null;
  },

  changeAdminPassword: async (
    username: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    const user = dbConnection
      .prepare("SELECT * FROM admin_users WHERE username = ?")
      .get(username) as AdminUser | undefined;

    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      dbConnection
        .prepare("UPDATE admin_users SET password = ? WHERE username = ?")
        .run(hashedNewPassword, username);
      return true;
    }

    return false;
  },
};

export const productService = {
  getAll: (filters: {
    category?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) => {
    const { category, sortBy, page = 1, limit = 9 } = filters;
    let whereClauses: string[] = ["is_active = 1"];
    let params: (string | number)[] = [];
    if (category) {
      whereClauses.push("category = ?");
      params.push(category);
    }
    const where =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    let orderBy = "ORDER BY id DESC";
    if (sortBy === "price-asc") orderBy = "ORDER BY price ASC";
    if (sortBy === "price-desc") orderBy = "ORDER BY price DESC";
    if (sortBy === "popular") orderBy = "ORDER BY is_best_seller DESC, id DESC";
    const offset = (page - 1) * limit;
    const productsQuery = `SELECT * FROM products ${where} ${orderBy} LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as total FROM products ${where}`;
    const products = dbConnection
      .prepare(productsQuery)
      .all(...params, limit, offset)
      .map(parseProduct);
    const totalResult = dbConnection.prepare(countQuery).get(...params) as {
      total: number;
    };
    return {
      products,
      totalPages: Math.ceil(totalResult.total / limit),
      currentPage: page,
      totalProducts: totalResult.total,
    };
  },

  getAllAdmin: (): Product[] => {
    const rows = dbConnection
      .prepare("SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC")
      .all();
    return rows.map(parseProduct);
  },

  getNewest: (limit: number = 3): Product[] => {
    const rows = dbConnection
      .prepare(
        `SELECT * FROM products WHERE is_active = 1 AND is_new = 1 ORDER BY id DESC LIMIT ?`
      )
      .all(limit);
    return rows.map(parseProduct);
  },

  getBestsellers: (limit: number = 3): Product[] => {
    const rows = dbConnection
      .prepare(
        `SELECT * FROM products WHERE is_active = 1 AND is_best_seller = 1 ORDER BY id DESC LIMIT ?`
      )
      .all(limit);
    return rows.map(parseProduct);
  },

  getById: (id: string | number): Product | null => {
    const row = dbConnection
      .prepare("SELECT * FROM products WHERE id = ? AND is_active = 1")
      .get(id);
    return row ? parseProduct(row) : null;
  },
  create: (product: Omit<Product, "id">): number => {
    const result = dbConnection
      .prepare(
        `
      INSERT INTO products (name, price, images, video, category, description, material, rise, fit, sizes, is_new, is_best_seller)
      VALUES (@name, @price, @images, @video, @category, @description, @material, @rise, @fit, @sizes, @isNew, @isBestSeller)
    `
      )
      .run({
        ...product,
        images: JSON.stringify(product.images),
        video: product.video || null,
        sizes: JSON.stringify(product.sizes),
        isNew: product.isNew ? 1 : 0,
        isBestSeller: product.isBestSeller ? 1 : 0,
      });
    return result.lastInsertRowid as number;
  },
  update: (id: string, data: Partial<Omit<Product, "id">>): boolean => {
    const stmt = dbConnection.prepare(`
      UPDATE products SET
        name = @name, price = @price, images = @images, video = @video, category = @category,
        description = @description, material = @material, rise = @rise, fit = @fit,
        sizes = @sizes, is_new = @isNew, is_best_seller = @isBestSeller,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    const result = stmt.run({
      id,
      ...data,
      images: JSON.stringify(data.images),
      video: data.video || null,
      sizes: JSON.stringify(data.sizes),
      isNew: data.isNew ? 1 : 0,
      isBestSeller: data.isBestSeller ? 1 : 0,
    });
    return result.changes > 0;
  },
  delete: (id: string): boolean => {
    const result = dbConnection
      .prepare("UPDATE products SET is_active = 0 WHERE id = ?")
      .run(id);
    return result.changes > 0;
  },

  updateProductStock: (items: CartItem[]): void => {
    const updateStmt = dbConnection.prepare(
      "UPDATE products SET sizes = ? WHERE id = ?"
    );
    const getProductStmt = dbConnection.prepare(
      "SELECT sizes FROM products WHERE id = ?"
    );

    const transaction = dbConnection.transaction((cartItems: CartItem[]) => {
      for (const item of cartItems) {
        const product = getProductStmt.get(item.product.id) as
          | { sizes: string }
          | undefined;
        if (product) {
          const sizes = JSON.parse(product.sizes);
          if (sizes[item.size]) {
            sizes[item.size].stock -= item.quantity;
            updateStmt.run(JSON.stringify(sizes), item.product.id);
          }
        }
      }
    });
    transaction(items);
  },
};

export const categoryService = {
  getAll: (): Category[] => {
    const rows = dbConnection
      .prepare(
        "SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, name ASC"
      )
      .all();
    return rows.map(parseCategory);
  },
  getById: (id: number): Category | null => {
    const row = dbConnection
      .prepare("SELECT * FROM categories WHERE id = ?")
      .get(id);
    return row ? parseCategory(row) : null;
  },
  create: (category: Omit<Category, "id" | "is_active">): number => {
    const result = dbConnection
      .prepare(
        "INSERT INTO categories (name, slug, description, image, sort_order) VALUES (@name, @slug, @description, @image, @sort_order)"
      )
      .run({
        name: category.name,
        slug: category.slug || category.name.toLowerCase().replace(/\s+/g, "-"),
        description: category.description || "",
        image: category.image || "",
        sort_order: category.sort_order || 0,
      });
    return result.lastInsertRowid as number;
  },
  update: (id: number, data: Partial<Omit<Category, "id">>): boolean => {
    const result = dbConnection
      .prepare(
        "UPDATE categories SET name = @name, slug = @slug, description = @description, image = @image, sort_order = @sort_order WHERE id = @id"
      )
      .run({
        id,
        name: data.name,
        slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, "-"),
        description: data.description,
        image: data.image,
        sort_order: data.sort_order,
      });
    return result.changes > 0;
  },
  delete: (id: number): boolean => {
    const result = dbConnection
      .prepare("UPDATE categories SET is_active = 0 WHERE id = ?")
      .run(id);
    return result.changes > 0;
  },
};

export const orderService = {
  create: (
    order: Omit<Order, "id" | "customerId"> & { customerId: string }
  ): number => {
    const result = dbConnection
      .prepare(
        `
            INSERT INTO orders (customer_id, customer_name, customer_email, customer_phone, customer_doc_number, items, total, status, created_at, 
                                shipping_street_name, shipping_street_number, shipping_apartment, shipping_description, shipping_city, shipping_postal_code, shipping_province, shipping_cost, shipping_name)
            VALUES (@customerId, @customerName, @customerEmail, @customerPhone, @customerDocNumber, @items, @total, @status, @createdAt,
                    @shippingStreetName, @shippingStreetNumber, @shippingApartment, @shippingDescription, @shippingCity, @shippingPostalCode, @shippingProvince, @shippingCost, @shippingName)
        `
      )
      .run({
        customerId: order.customerId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerDocNumber: order.customerDocNumber,
        items: JSON.stringify(order.items),
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        shippingStreetName: order.shippingStreetName,
        shippingStreetNumber: order.shippingStreetNumber,
        shippingApartment: order.shippingApartment,
        shippingDescription: order.shippingDescription,
        shippingCity: order.shippingCity,
        shippingPostalCode: order.shippingPostalCode,
        shippingProvince: order.shippingProvince,
        shippingCost: order.shippingCost,
        shippingName: order.shippingName,
      });
    return result.lastInsertRowid as number;
  },
  getAll: (): Order[] => {
    const rows = dbConnection
      .prepare("SELECT * FROM orders ORDER BY created_at DESC")
      .all();
    return rows.map(parseOrder);
  },
  updateStatus: (id: string, status: string): boolean => {
    const result = dbConnection
      .prepare("UPDATE orders SET status = ? WHERE id = ?")
      .run(status, id);
    return result.changes > 0;
  },
  getByCustomerId: (customerId: string): CustomerOrder[] => {
    const rows = dbConnection
      .prepare(
        "SELECT id, items, total, status, created_at FROM orders WHERE customer_id = ? ORDER BY created_at DESC"
      )
      .all(customerId);
    return rows.map(parseCustomerOrder);
  },
  getById: (id: string): Order | null => {
    const row = dbConnection
      .prepare("SELECT * FROM orders WHERE id = ?")
      .get(id);
    return row ? parseOrder(row) : null;
  },
};

export const customerService = {
  findOrCreate: (customer: {
    email: string;
    name: string;
    phone?: string;
    totalSpent: number;
  }): number => {
    let existingCustomer = dbConnection
      .prepare("SELECT id, total_spent FROM customers WHERE email = ?")
      .get(customer.email) as { id: number; total_spent: number } | undefined;

    if (existingCustomer) {
      dbConnection
        .prepare(
          "UPDATE customers SET name = ?, phone = ?, order_count = order_count + 1, total_spent = ? WHERE id = ?"
        )
        .run(
          customer.name,
          customer.phone || null,
          existingCustomer.total_spent + customer.totalSpent,
          existingCustomer.id
        );
      return existingCustomer.id;
    } else {
      const result = dbConnection
        .prepare(
          "INSERT INTO customers (name, email, phone, order_count, total_spent) VALUES (?, ?, ?, 1, ?)"
        )
        .run(
          customer.name,
          customer.email,
          customer.phone || null,
          customer.totalSpent
        );
      return result.lastInsertRowid as number;
    }
  },
  getAll: (): Customer[] => {
    const rows = dbConnection
      .prepare("SELECT * FROM customers ORDER BY created_at DESC")
      .all();
    return rows.map(parseCustomer);
  },
  getById: (id: string): Customer | null => {
    const row = dbConnection
      .prepare("SELECT * FROM customers WHERE id = ?")
      .get(id);
    return row ? parseCustomer(row) : null;
  },
};

export const settingsService = {
  getAll: (): SiteSettings => {
    const rows = dbConnection
      .prepare("SELECT key, value FROM site_settings")
      .all() as { key: string; value: string }[];
    return rows.reduce((acc, { key, value }) => {
      acc[key] = { value, type: "text" };
      return acc;
    }, {} as SiteSettings);
  },
  update: (settings: Record<string, string>): void => {
    const stmt = dbConnection.prepare(
      "INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)"
    );
    const transaction = dbConnection.transaction((settingsObject) => {
      for (const [key, value] of Object.entries(settingsObject)) {
        stmt.run(key, value);
      }
    });
    transaction(settings);
  },
};

export const dashboardService = {
  getStats: () => {
    const productCount = (
      dbConnection
        .prepare("SELECT COUNT(*) as count FROM products WHERE is_active = 1")
        .get() as { count: number }
    ).count;
    const orderCount = (
      dbConnection.prepare("SELECT COUNT(*) as count FROM orders").get() as {
        count: number;
      }
    ).count;
    const customerCount = (
      dbConnection.prepare("SELECT COUNT(*) as count FROM customers").get() as {
        count: number;
      }
    ).count;
    const totalRevenueResult = dbConnection
      .prepare(
        "SELECT SUM(total) as total FROM orders WHERE status = 'delivered'"
      )
      .get() as { total: number | null };
    const totalRevenue = totalRevenueResult.total || 0;

    return {
      productCount,
      orderCount,
      customerCount,
      totalRevenue,
    };
  },
  getRecentOrders: (limit: number = 5): Order[] => {
    const rows = dbConnection
      .prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT ?")
      .all(limit);
    return rows.map(parseOrder);
  },
  getRecentCustomers: (limit: number = 5): Customer[] => {
    const rows = dbConnection
      .prepare("SELECT * FROM customers ORDER BY created_at DESC LIMIT ?")
      .all(limit);
    return rows.map(parseCustomer);
  },
};
