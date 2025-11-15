// server/lib/db/connection.ts
import initSqlJs, { type SqlJsStatic, type Database } from "sql.js";
import fs from "fs";
import path from "path";


let SQL: SqlJsStatic;
let DB: Database;

const getDbPath = (): string => {
  const env = process.env.DATABASE_PATH;
  if (env && env.trim() !== "") return env;
  return path.resolve(process.cwd(), "data", "database.sqlite");
};

const getWasmBinary = (): ArrayBuffer => {
    const wasmFileName = "sql-wasm.wasm";

    // 1. Production path (as determined by the build script)
    const prodPath = path.resolve(process.cwd(), "dist", wasmFileName);
    if (fs.existsSync(prodPath)) {
        return fs.readFileSync(prodPath).buffer;
    }

    // 2. Development path (inside node_modules)
    const devPath = path.resolve(process.cwd(), "node_modules", "sql.js", "dist", wasmFileName);
    if (fs.existsSync(devPath)) {
        return fs.readFileSync(devPath).buffer;
    }

    throw new Error(`[DB] Could not find ${wasmFileName}. Looked in: ${prodPath} and ${devPath}`);
};

export async function initializeDatabase(): Promise<Database> {
  console.log("[DB] Initializing sql.js...");
  const wasmBinary = getWasmBinary();
  SQL = await initSqlJs({ wasmBinary });

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