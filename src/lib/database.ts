import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { Product, Order, Customer, SiteSettings, AdminUser } from '../types';

class DatabaseManager {
  private db: Database.Database;

  constructor() {
    this.db = new Database('rosario-denim.db');
    this.initializeTables();
    this.seedInitialData();
  }

  private initializeTables() {
    // Admin users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        images TEXT NOT NULL,
        video TEXT,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        material TEXT NOT NULL,
        rise TEXT NOT NULL,
        fit TEXT NOT NULL,
        sizes TEXT NOT NULL,
        is_new BOOLEAN DEFAULT 0,
        is_best_seller BOOLEAN DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      )
    `);

    // Customers table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        city TEXT,
        postal_code TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        items TEXT NOT NULL,
        total INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        shipping_address TEXT,
        payment_method TEXT,
        payment_status TEXT DEFAULT 'pending',
        tracking_number TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id)
      )
    `);

    // Site settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        type TEXT DEFAULT 'text',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Coupons table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL, -- 'percentage' or 'fixed'
        value INTEGER NOT NULL,
        min_amount INTEGER DEFAULT 0,
        max_uses INTEGER,
        current_uses INTEGER DEFAULT 0,
        expires_at DATETIME,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Analytics table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        event_data TEXT,
        user_agent TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private async seedInitialData() {
    // Create default admin user
    const adminExists = this.db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
    
    if (adminExists.count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      this.db.prepare(`
        INSERT INTO admin_users (username, password, email, role)
        VALUES (?, ?, ?, ?)
      `).run('admin', hashedPassword, 'admin@rosariodenim.com', 'super_admin');
    }

    // Seed default categories
    const categoriesExist = this.db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
    
    if (categoriesExist.count === 0) {
      const categories = [
        { name: 'Mom Jeans', slug: 'mom-jeans', description: 'Jeans de tiro alto con calce mom' },
        { name: 'Wide Leg', slug: 'wide-leg', description: 'Jeans de piernas amplias' },
        { name: 'Flare', slug: 'flare', description: 'Jeans acampanados desde la rodilla' },
        { name: 'Straight', slug: 'straight', description: 'Jeans de corte recto clásico' }
      ];

      const insertCategory = this.db.prepare(`
        INSERT INTO categories (name, slug, description, sort_order)
        VALUES (?, ?, ?, ?)
      `);

      categories.forEach((cat, index) => {
        insertCategory.run(cat.name, cat.slug, cat.description, index);
      });
    }

    // Seed default site settings
    const settingsExist = this.db.prepare('SELECT COUNT(*) as count FROM site_settings').get() as { count: number };
    
    if (settingsExist.count === 0) {
      const defaultSettings = [
        { key: 'site_name', value: 'Rosario Denim', type: 'text' },
        { key: 'site_description', value: 'Jeans anchos que sí te quedan bien. Hechos para durar.', type: 'textarea' },
        { key: 'hero_title', value: 'Jeans anchos que sí te quedan bien', type: 'text' },
        { key: 'hero_subtitle', value: 'Hechos para durar', type: 'text' },
        { key: 'hero_button_text', value: 'DESCUBRIR AHORA', type: 'text' },
        { key: 'hero_image', value: 'https://images.pexels.com/photos/7691840/pexels-photo-7691840.jpeg?auto=compress&cs=tinysrgb&w=1200', type: 'image' },
        { key: 'primary_color', value: '#D8A7B1', type: 'color' },
        { key: 'secondary_color', value: '#F5F5F5', type: 'color' },
        { key: 'text_color', value: '#222222', type: 'color' },
        { key: 'contact_email', value: 'hola@rosariodenim.com', type: 'email' },
        { key: 'contact_phone', value: '+54 9 341 XXX-XXXX', type: 'tel' },
        { key: 'contact_address', value: 'Rosario, Santa Fe, Argentina', type: 'text' },
        { key: 'instagram_url', value: 'https://instagram.com/rosariodenim', type: 'url' },
        { key: 'whatsapp_number', value: '5493411234567', type: 'tel' },
        { key: 'shipping_cost', value: '1500', type: 'number' },
        { key: 'free_shipping_threshold', value: '25000', type: 'number' },
        { key: 'meta_pixel_id', value: '', type: 'text' },
        { key: 'google_analytics_id', value: '', type: 'text' },
        { key: 'newsletter_discount', value: '10', type: 'number' },
        { key: 'currency_symbol', value: '$', type: 'text' },
        { key: 'tax_rate', value: '21', type: 'number' }
      ];

      const insertSetting = this.db.prepare(`
        INSERT INTO site_settings (key, value, type)
        VALUES (?, ?, ?)
      `);

      defaultSettings.forEach(setting => {
        insertSetting.run(setting.key, setting.value, setting.type);
      });
    }
  }

  // Admin authentication
  async authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
    const user = this.db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as AdminUser | undefined;
    
    if (user && await bcrypt.compare(password, user.password)) {
      return { ...user, password: '' }; // Don't return password
    }
    
    return null;
  }

  // Products CRUD
  getAllProducts(): Product[] {
    const rows = this.db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC').all();
    return rows.map(this.parseProduct);
  }

  getProductById(id: string): Product | null {
    const row = this.db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(id);
    return row ? this.parseProduct(row) : null;
  }

  createProduct(product: Omit<Product, 'id'>): string {
    const id = Date.now().toString();
    this.db.prepare(`
      INSERT INTO products (id, name, price, images, video, category, description, material, rise, fit, sizes, is_new, is_best_seller)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      product.name,
      product.price,
      JSON.stringify(product.images),
      product.video || null,
      product.category,
      product.description,
      product.material,
      product.rise,
      product.fit,
      JSON.stringify(product.sizes),
      product.isNew ? 1 : 0,
      product.isBestSeller ? 1 : 0
    );
    return id;
  }

  updateProduct(id: string, product: Partial<Product>): boolean {
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined) {
        switch (key) {
          case 'images':
          case 'sizes':
            updates.push(`${key} = ?`);
            values.push(JSON.stringify(value));
            break;
          case 'isNew':
            updates.push('is_new = ?');
            values.push(value ? 1 : 0);
            break;
          case 'isBestSeller':
            updates.push('is_best_seller = ?');
            values.push(value ? 1 : 0);
            break;
          default:
            updates.push(`${key} = ?`);
            values.push(value);
        }
      }
    });

    if (updates.length === 0) return false;

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = this.db.prepare(`
      UPDATE products SET ${updates.join(', ')} WHERE id = ?
    `).run(...values);

    return result.changes > 0;
  }

  deleteProduct(id: string): boolean {
    const result = this.db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // Categories CRUD
  getAllCategories() {
    return this.db.prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order').all();
  }

  createCategory(name: string, slug: string, description?: string, image?: string) {
    return this.db.prepare(`
      INSERT INTO categories (name, slug, description, image)
      VALUES (?, ?, ?, ?)
    `).run(name, slug, description || null, image || null);
  }

  updateCategory(id: number, data: any) {
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return false;

    values.push(id);
    const result = this.db.prepare(`
      UPDATE categories SET ${updates.join(', ')} WHERE id = ?
    `).run(...values);

    return result.changes > 0;
  }

  deleteCategory(id: number) {
    return this.db.prepare('UPDATE categories SET is_active = 0 WHERE id = ?').run(id);
  }

  // Site settings
  getAllSettings() {
    return this.db.prepare('SELECT * FROM site_settings ORDER BY key').all();
  }

  getSetting(key: string) {
    return this.db.prepare('SELECT value FROM site_settings WHERE key = ?').get(key);
  }

  updateSetting(key: string, value: string) {
    return this.db.prepare(`
      INSERT OR REPLACE INTO site_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).run(key, value);
  }

  // Coupons CRUD
  getAllCoupons() {
    return this.db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
  }

  createCoupon(coupon: any) {
    return this.db.prepare(`
      INSERT INTO coupons (code, type, value, min_amount, max_uses, expires_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      coupon.code,
      coupon.type,
      coupon.value,
      coupon.minAmount || 0,
      coupon.maxUses || null,
      coupon.expiresAt || null,
      coupon.isActive ? 1 : 0
    );
  }

  // Analytics
  trackEvent(eventType: string, eventData?: any, userAgent?: string, ipAddress?: string) {
    return this.db.prepare(`
      INSERT INTO analytics_events (event_type, event_data, user_agent, ip_address)
      VALUES (?, ?, ?, ?)
    `).run(
      eventType,
      eventData ? JSON.stringify(eventData) : null,
      userAgent || null,
      ipAddress || null
    );
  }

  getAnalytics(days: number = 30) {
    return this.db.prepare(`
      SELECT 
        event_type,
        COUNT(*) as count,
        DATE(created_at) as date
      FROM analytics_events 
      WHERE created_at >= datetime('now', '-${days} days')
      GROUP BY event_type, DATE(created_at)
      ORDER BY created_at DESC
    `).all();
  }

  private parseProduct(row: any): Product {
    return {
      id: row.id,
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
      isBestSeller: Boolean(row.is_best_seller)
    };
  }

  close() {
    this.db.close();
  }
}

export const db = new DatabaseManager();