// server/lib/db/connection.ts
import initSqlJs, { type SqlJsStatic, type Database } from "sql.js";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

let SQL: SqlJsStatic;
let DB: Database;

const getDbPath = (): string => {
  const env = process.env.DATABASE_PATH;
  if (env && env.trim() !== "") return env;
  return path.resolve(process.cwd(), "data", "database.sqlite");
};

const locateWasm = (file: string): string => {
    // Path for production (cPanel), as per user instructions and build script
    const prodPath = path.resolve(process.cwd(), "dist", file);
    if (fs.existsSync(prodPath)) {
        return prodPath;
    }

    // Fallback path for local development (e.g., running with tsx)
    try {
        const devPath = require.resolve('sql.js/dist/sql-wasm.wasm');
        if (fs.existsSync(devPath)) {
            return devPath;
        }
    } catch (e) {
        console.warn("[DB] Could not find wasm file via require.resolve. This is normal in production.");
    }
    
    // Final fallback based on user's original instruction
    return "sql-wasm.wasm";
};

export async function initializeDatabase(): Promise<Database> {
  console.log("[DB] Initializing sql.js...");
  SQL = await initSqlJs({ locateFile: locateWasm });

  const dbPath = getDbPath();
  const exists = fs.existsSync(dbPath);

  if (exists) {
    console.log("[DB] Loading DB from:", dbPath);
    const filebuffer = fs.readFileSync(dbPath);
    DB = new SQL.Database(filebuffer);
  } else {
    console.log("[DB] DB not found; creating new in memory (will be saved later):", dbPath);
    DB = new SQL.Database();
    // On first creation, save it immediately to ensure the file exists for subsequent operations.
    saveDatabase();
  }

  return DB;
}

export function getDB(): Database {
  if (!DB) {
    throw new Error("DB not initialized. Call initializeDatabase() first.");
  }
  return DB;
}

export function saveDatabase(): void {
  if (!DB) {
    console.warn("[DB] saveDatabase: DB not initialized, nothing to save.");
    return;
  }
  try {
    const data = DB.export();
    const buffer = Buffer.from(data);
    const dbPath = getDbPath();
    fs.writeFileSync(dbPath, buffer);
    console.log("[DB] Database saved to:", dbPath);
  } catch (e) {
      console.error("[DB] Error saving database:", e);
  }
}
