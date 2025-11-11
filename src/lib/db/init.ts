// mat1gr/rosariodenim/ROSARIODENIM-0a9e948297937bd8aefc1890579b3a59f99d6fdc/src/lib/db/init.ts

import type { Database } from "better-sqlite3";
import bcrypt from "bcryptjs";
import { dbConnection } from "./connection";

export const initializeDatabase = () => {
  createTables(dbConnection);
  seedInitialData(dbConnection);
};

const createTables = (db: Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    );
    CREATE INDEX IF NOT EXISTS idx_product_category ON products (category);

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      is_active BOOLEAN DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );
    
    -- Tabla de Órdenes con la estructura correcta (snake_case)
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        customer_doc_number TEXT,
        items TEXT NOT NULL,
        total INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        shipping_street_name TEXT,
        shipping_street_number TEXT,
        shipping_apartment TEXT,
        shipping_description TEXT,
        shipping_city TEXT,
        shipping_postal_code TEXT,
        shipping_province TEXT,
        shipping_cost INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        order_count INTEGER DEFAULT 0,
        total_spent INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT
    );
    CREATE TABLE IF NOT EXISTS drop_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec("ALTER TABLE orders ADD COLUMN customer_phone TEXT;");
  } catch (error: any) {
    if (!error.message.includes("duplicate column name")) throw error;
  }
  try {
    db.exec("ALTER TABLE orders ADD COLUMN customer_doc_number TEXT;");
  } catch (error: any) {
    if (!error.message.includes("duplicate column name")) throw error;
  }
};

const seedInitialData = (db: Database) => {
  const adminExists = db
    .prepare("SELECT COUNT(*) as count FROM admin_users")
    .get() as { count: number };
  if (adminExists.count === 0) {
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    db.prepare(
      `
      INSERT INTO admin_users (username, password, email, role)
      VALUES (?, ?, ?, ?)
    `
    ).run(
      "grigomati@gmail.com",
      hashedPassword,
      "admin@rosariodenim.com",
      "super_admin"
    );
    console.log("✅ Default admin user created.");
  }
  const settingsExist = db
    .prepare("SELECT COUNT(*) as count FROM site_settings")
    .get() as { count: number };
  if (settingsExist.count === 0) {
    const stmt = db.prepare(
      "INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)"
    );
    stmt.run("site_name", "Rosario Denim");
    stmt.run("contact_email", "hola@rosariodenim.com");
    stmt.run("contact_phone", "+54 9 341 123-4567");
    console.log("✅ Default site settings created.");
  }
};
