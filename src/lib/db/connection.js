"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
// Crea una única instancia de la base de datos para toda la aplicación
exports.dbConnection = new better_sqlite3_1.default('rosario-denim.db');
// Habilita WAL (Write-Ahead Logging) para mejor concurrencia y rendimiento
exports.dbConnection.pragma('journal_mode = WAL');
