#!/usr/bin/env node

/**
 * Script de verificación pre-deployment
 * Verifica que la configuración sea correcta antes de desplegar
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Verificando configuración para deployment...\n');

let hasErrors = false;
let hasWarnings = false;

// Verificar package.json
try {
  const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));

  if (packageJson.homepage && packageJson.homepage.includes('<TU-USUARIO>')) {
    console.error('❌ ERROR: Actualiza el campo "homepage" en package.json con tu usuario de GitHub');
    console.error('   Actual: ' + packageJson.homepage);
    console.error('   Debe ser: https://TU-USUARIO.github.io/campus-distribucion\n');
    hasErrors = true;
  } else if (packageJson.homepage) {
    console.log('✅ Campo "homepage" configurado correctamente');
    console.log('   → ' + packageJson.homepage + '\n');
  }
} catch (error) {
  console.error('❌ ERROR: No se pudo leer package.json\n');
  hasErrors = true;
}

// Verificar vite.config.js
try {
  const viteConfig = readFileSync(join(rootDir, 'vite.config.js'), 'utf8');

  if (viteConfig.includes('base:')) {
    console.log('✅ Configuración de base en vite.config.js presente\n');
  } else {
    console.error('❌ ERROR: Falta configuración de "base" en vite.config.js\n');
    hasErrors = true;
  }
} catch (error) {
  console.error('❌ ERROR: No se pudo leer vite.config.js\n');
  hasErrors = true;
}

// Verificar .env (no debe existir en repo)
try {
  const gitignore = readFileSync(join(rootDir, '.gitignore'), 'utf8');
  if (gitignore.includes('.env')) {
    console.log('✅ .env está en .gitignore (correcto)\n');
  } else {
    console.warn('⚠️  ADVERTENCIA: .env no está en .gitignore\n');
    hasWarnings = true;
  }
} catch (error) {
  console.warn('⚠️  ADVERTENCIA: No se pudo verificar .gitignore\n');
  hasWarnings = true;
}

// Advertencias de seguridad
console.log('⚠️  RECORDATORIOS DE SEGURIDAD:\n');
console.log('   1. Configura VITE_GEMINI_API_KEY como Secret en GitHub');
console.log('      Settings > Secrets and variables > Actions > New repository secret\n');
console.log('   2. La API key estará visible en el código del navegador en GitHub Pages');
console.log('      Considera configurar restricciones en Google Cloud Console\n');
console.log('   3. Habilita GitHub Pages en Settings > Pages');
console.log('      Source: GitHub Actions\n');

// Resumen
console.log('━'.repeat(60));
if (hasErrors) {
  console.error('\n❌ Se encontraron errores. Por favor corrígelos antes de desplegar.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('\n⚠️  Hay advertencias pero puedes continuar con el deployment.\n');
  process.exit(0);
} else {
  console.log('\n✅ Todo listo para deployment!\n');
  console.log('Ejecuta: npm run deploy (manual) o git push origin main (automático)\n');
  process.exit(0);
}
