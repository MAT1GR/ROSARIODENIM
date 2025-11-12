import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from 'path'; // <-- Agregamos la librería 'path'

// 1. Leemos la variable de entorno 'DATABASE_PATH' (que configurarás en cPanel).
const dbPath = process.env.DATABASE_PATH 
  ? process.env.DATABASE_PATH 
  // 2. Si la variable no existe (ej. en tu PC local), 
  //    usa una ruta local por defecto.
  : path.resolve(process.cwd(), "database.sqlite");

// 3. (Opcional) Un log para saber qué ruta está usando.
//    Podés ver esto en los logs de tu app de Node.js en cPanel.
console.log(`[DB] Iniciando conexión con base de datos en: ${dbPath}`);

export const db = await open({
  filename: dbPath, // <-- 4. Usamos la ruta dinámica
  driver: sqlite3.Database,
});