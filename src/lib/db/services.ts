import bcrypt from 'bcryptjs';
import { dbConnection } from './connection';
import { Product, AdminUser, Category, Order, Customer, SiteSettings } from '../../types';

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
    id: row.id,
    customer: {
        id: row.customer_id,
        name: row.customer_name,
        email: row.customer_email,
    },
    items: JSON.parse(row.items),
    total: row.total,
    status: row.status,
    createdAt: new Date(row.created_at),
});

const parseCustomer = (row: any): Customer => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    order_count: row.order_count,
    total_spent: row.total_spent,
});


// --- Auth Services ---
export const authService = {
  authenticateAdmin: async (username: string, password: string): Promise<AdminUser | null> => {
    const user = dbConnection.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as AdminUser | undefined;
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as AdminUser;
    }
    return null;
  }
};

// --- Product Services ---
export const productService = {
  getAll: (): Product[] => {
    const rows = dbConnection.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC').all();
    return rows.map(parseProduct);
  },
  getById: (id: string | number): Product | null => {
    const row = dbConnection.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(id);
    return row ? parseProduct(row) : null;
  },
  create: (product: Omit<Product, 'id'>): number => {
    const result = dbConnection.prepare(`
      INSERT INTO products (name, price, images, category, description, material, rise, fit, sizes, is_new, is_best_seller)
      VALUES (@name, @price, @images, @category, @description, @material, @rise, @fit, @sizes, @isNew, @isBestSeller)
    `).run({
      ...product,
      images: JSON.stringify(product.images),
      sizes: JSON.stringify(product.sizes),
      isNew: product.isNew ? 1 : 0,
      isBestSeller: product.isBestSeller ? 1 : 0,
    });
    return result.lastInsertRowid as number;
  },
  update: (id: string, data: Partial<Omit<Product, 'id'>>): boolean => {
    const stmt = dbConnection.prepare(`
      UPDATE products SET
        name = @name, price = @price, images = @images, category = @category,
        description = @description, material = @material, rise = @rise, fit = @fit,
        sizes = @sizes, is_new = @isNew, is_best_seller = @isBestSeller,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    const result = stmt.run({
        id, ...data,
        images: JSON.stringify(data.images),
        sizes: JSON.stringify(data.sizes),
        isNew: data.isNew ? 1 : 0,
        isBestSeller: data.isBestSeller ? 1 : 0,
    });
    return result.changes > 0;
  },
  delete: (id: string): boolean => {
    const result = dbConnection.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// --- Category Services ---
export const categoryService = {
    getAll: (): Category[] => {
        const rows = dbConnection.prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, name ASC').all();
        return rows.map(parseCategory);
    },
    getById: (id: number): Category | null => {
        const row = dbConnection.prepare('SELECT * FROM categories WHERE id = ?').get(id);
        return row ? parseCategory(row) : null;
    },
    create: (category: Omit<Category, 'id' | 'is_active'>): number => {
        const result = dbConnection.prepare(
            'INSERT INTO categories (name, slug, description, image, sort_order) VALUES (@name, @slug, @description, @image, @sort_order)'
        ).run({
            name: category.name,
            slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
            description: category.description || '',
            image: category.image || '',
            sort_order: category.sort_order || 0,
        });
        return result.lastInsertRowid as number;
    },
    update: (id: number, data: Partial<Omit<Category, 'id'>>): boolean => {
        const result = dbConnection.prepare(
            'UPDATE categories SET name = @name, slug = @slug, description = @description, image = @image, sort_order = @sort_order WHERE id = @id'
        ).run({ 
            id, 
            name: data.name,
            slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-'),
            description: data.description,
            image: data.image,
            sort_order: data.sort_order,
        });
        return result.changes > 0;
    },
    delete: (id: number): boolean => {
        const result = dbConnection.prepare('UPDATE categories SET is_active = 0 WHERE id = ?').run(id);
        return result.changes > 0;
    }
};

// --- Order Services ---
export const orderService = {
    getAll: (): Order[] => {
        const rows = dbConnection.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        return rows.map(parseOrder);
    },
    updateStatus: (id: number, status: string): boolean => {
        const result = dbConnection.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
        return result.changes > 0;
    }
};

// --- Customer Services ---
export const customerService = {
    getAll: (): Customer[] => {
        const rows = dbConnection.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
        return rows.map(parseCustomer);
    }
};

// --- Settings Services ---
export const settingsService = {
    getAll: (): SiteSettings => {
        const rows = dbConnection.prepare('SELECT key, value FROM site_settings').all() as {key: string, value: string}[];
        return rows.reduce((acc, { key, value }) => {
            acc[key] = { value, type: 'text' };
            return acc;
        }, {} as SiteSettings);
    },
    update: (settings: Record<string, string>): void => {
        const stmt = dbConnection.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
        const transaction = dbConnection.transaction((settingsObject) => {
            for (const [key, value] of Object.entries(settingsObject)) {
                stmt.run(key, value);
            }
        });
        transaction(settings);
    }
};

// --- Dashboard Services ---
export const dashboardService = {
    getStats: () => {
        const productCount = (dbConnection.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get() as {count: number}).count;
        const orderCount = (dbConnection.prepare('SELECT COUNT(*) as count FROM orders').get() as {count: number}).count;
        const customerCount = (dbConnection.prepare('SELECT COUNT(*) as count FROM customers').get() as {count: number}).count;
        
        // CORRECCIÓN: Se envuelve 'delivered' en comillas simples para que sea un string literal en SQL.
        const totalRevenueResult = dbConnection.prepare("SELECT SUM(total) as total FROM orders WHERE status = 'delivered'").get() as {total: number | null};
        const totalRevenue = totalRevenueResult.total || 0;

        return {
            productCount,
            orderCount,
            customerCount,
            totalRevenue,
        };
    }
};