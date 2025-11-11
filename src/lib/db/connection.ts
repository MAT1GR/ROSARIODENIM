import Database from 'better-sqlite3';

// Crea una única instancia de la base de datos para toda la aplicación
export const dbConnection = new Database('rosario-denim.db');

// Habilita WAL (Write-Ahead Logging) para mejor concurrencia y rendimiento
dbConnection.pragma('journal_mode = WAL');