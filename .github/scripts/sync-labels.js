#!/usr/bin/env node

/**
 * Script para sincronizar labels do GitHub via API
 * Uso: node .github/scripts/sync-labels.js
 */

const fs = require('fs');
const path = require('path');

// Lê configuração de labels
const labelsPath = path.join(__dirname, '..', 'labels.json');
const labels = JSON.parse(fs.readFileSync(labelsPath, 'utf8'));

console.log(`📋 ${labels.length} labels configurados:`);
labels.forEach((label) => {
  console.log(`  - ${label.name} (${label.color})`);
});

console.log('\n✅ Para aplicar, execute:');
console.log(
  'gh api repos/{owner}/{repo}/labels --method POST --input label.json'
);
console.log('\nOu use a action: Sync Labels workflow');
