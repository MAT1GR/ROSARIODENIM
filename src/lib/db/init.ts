// src/lib/db/init.ts
import type { Database } from "sqlite";
import bcrypt from "bcryptjs";
import { db } from "./connection";

export const initializeDatabase = async () => {
  const database = await db;
  await createTables(database);
  await seedInitialData(database);
};

const createTables = async (database: Database) => {
  await database.exec(`
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

  // ALTER TABLE condicional (seguro)
  for (const col of ["customer_phone", "customer_doc_number"]) {
    try {
      await database.exec(`ALTER TABLE orders ADD COLUMN ${col} TEXT;`);
    } catch (err: any) {
      // sqlite devuelve un mensaje con "duplicate column name" cuando ya existe
      if (!String(err?.message || "").includes("duplicate column name")) throw err;
    }
  }
};

const seedInitialData = async (database: Database) => {
  const adminExists = (await database.get<{ count: number }>(
    "SELECT COUNT(*) as count FROM admin_users"
  )) || { count: 0 };

  if (adminExists.count === 0) {
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    await database.run(
      `INSERT INTO admin_users (username, password, email, role) VALUES (?, ?, ?, ?)`,
      ["grigomati@gmail.com", hashedPassword, "admin@rosariodenim.com", "super_admin"]
    );
    console.log("✅ Default admin user created.");
  }

  const settingsExist = (await database.get<{ count: number }>(
    "SELECT COUNT(*) as count FROM site_settings"
  )) || { count: 0 };

  if (settingsExist.count === 0) {
    const settings = [
      ["site_name", "Rosario Denim"],
      ["contact_email", "hola@rosariodenim.com"],
      ["contact_phone", "+54 9 341 123-4567"],
    ];
    for (const [key, value] of settings) {
      await database.run("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)", [key, value]);
    }
    console.log("✅ Default site settings created.");
  }
};
