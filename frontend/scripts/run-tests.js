// Script para ejecutar tests secuencialmente y evitar el error "too many open files"
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname equivalente en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Directorios de tests
const testDirs = [
  'src/__tests__/services',
  'src/__tests__/hooks',
  'src/__tests__/components'
];

// Función para encontrar archivos de test recursivamente
function findTestFiles(dir) {
  let testFiles = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      testFiles = testFiles.concat(findTestFiles(filePath));
    } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
      testFiles.push(filePath);
    }
  }
  
  return testFiles;
}

// Buscar todos los archivos de test
let allTestFiles = [];
for (const dir of testDirs) {
  try {
    const fullDir = path.join(rootDir, dir);
    allTestFiles = allTestFiles.concat(findTestFiles(fullDir));
  } catch (error) {
    console.error(`Error al buscar archivos en ${dir}:`, error.message);
  }
}

// Ejecutar tests uno por uno
console.log(`Encontrados ${allTestFiles.length} archivos de test`);
console.log('Ejecutando tests secuencialmente...\n');

let passedTests = 0;
let failedTests = 0;

for (const testFile of allTestFiles) {
  const relativePath = path.relative(rootDir, testFile);
  console.log(`\n🧪 Ejecutando: ${relativePath}`);
  
  try {
    execSync(`npx vitest run ${relativePath}`, { stdio: 'inherit', cwd: rootDir });
    console.log(`✅ Test pasado: ${relativePath}`);
    passedTests++;
  } catch (error) {
    console.error(`❌ Test fallido: ${relativePath}`);
    failedTests++;
  }
}

// Mostrar resumen final
console.log('\n===== RESUMEN =====');
console.log(`Total tests: ${allTestFiles.length}`);
console.log(`Tests pasados: ${passedTests}`);
console.log(`Tests fallidos: ${failedTests}`);

// Salir con código apropiado
process.exit(failedTests > 0 ? 1 : 0); 