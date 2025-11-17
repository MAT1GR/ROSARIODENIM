const fs = require('fs');
const path = require('path');

// Path to the project root
const projectRoot = path.resolve(__dirname, '..');

const source = path.join(projectRoot, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const destinationDir = path.join(projectRoot, 'dist');
const destination = path.join(destinationDir, 'sql-wasm.wasm');

try {
    if (!fs.existsSync(source)) {
        console.error(`Error: sql-wasm.wasm not found at ${source}`);
        console.error("Please run 'npm install' to ensure sql.js is installed correctly.");
        process.exit(1);
    }

    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
        console.log(`Created directory: ${destinationDir}`);
    }

    fs.copyFileSync(source, destination);
    console.log(`✅ Copied sql-wasm.wasm to ${destination}`);

} catch (error) {
    console.error('Error copying sql-wasm.wasm:', error);
    process.exit(1);
}
