import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from 'path';

// 1. process.cwd() en cPanel es '.../backend/'
// 2. Tu archivo 'database.sqlite' está en '.../'
// 3. Usamos ".." para subir un nivel desde 'backend' a la raíz.
const fallbackDbPath = path.resolve(process.cwd(), "..", "database.sqlite");

// Si configuras DATABASE_PATH en cPanel, lo usará.
// Si no, usará la ruta de fallback que acabamos de calcular.
const dbPath = process.env.DATABASE_PATH || fallbackDbPath;

console.log(`[DB] Iniciando conexión con base de datos en: ${dbPath}`);

export const db = await open({
  filename: dbPath, // <-- Usamos la ruta correcta
  driver: sqlite3.Database,
});