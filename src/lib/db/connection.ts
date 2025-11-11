import Database from 'better-sqlite3';
import path from 'path';

// Crea una única instancia de la base de datos para toda la aplicación
const dbPath = path.join(__dirname, '..', '..', '..', '..', 'rosario-denim.db');
export const db = new Database(dbPath);

// Habilita WAL (Write-Ahead Logging) para mejor concurrencia y rendimiento
db.pragma('journal_mode = WAL');